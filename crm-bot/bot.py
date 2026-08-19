import os
import sys
import json
import sqlite3
import urllib.request
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Thread
import time
from datetime import datetime

BOT_TOKEN = "8618897926:AAEUvGUuGDF3IDQIQFnY1rD0zXTZdQmL36k"
API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"
DB_PATH = os.path.join(os.path.dirname(__file__), "crm.db")

# ── 1. DATABASE INITIALIZATION ──
def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    
    # Leads Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT,
            product TEXT,
            product_code TEXT,
            plan TEXT,
            status TEXT DEFAULT 'NEW',
            confirmed_by TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Subscribed Group & User Chats
    c.execute('''
        CREATE TABLE IF NOT EXISTS subscribed_chats (
            chat_id INTEGER PRIMARY KEY,
            chat_title TEXT,
            chat_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Inventory Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS inventory (
            code TEXT PRIMARY KEY,
            name TEXT,
            stock INTEGER
        )
    ''')

    # Pre-populate Inventory if empty
    c.execute('SELECT COUNT(*) FROM inventory')
    if c.fetchone()[0] == 0:
        default_stock = [
            ('3ta-gold', '3-Funksiyalik (Gold / Tillo)', 50),
            ('3ta-silver', '3-Funksiyalik (Silver / Seriy)', 35),
            ('3ta-black', '3-Funksiyalik (Black / Qora)', 40),
            ('3ta-red', '3-Funksiyalik (Red / Qizil)', 25),
            ('6ta-silver', '6-Funksiyalik (Silver / Seriy)', 60),
            ('6ta-black', '6-Funksiyalik (Black / Qora)', 45),
            ('6ta-gold', '6-Funksiyalik (Gold / Tillo)', 30),
            ('gift-set', 'Desco 5-in-1 Hadiya To''plami', 20)
        ]
        c.executemany('INSERT INTO inventory (code, name, stock) VALUES (?, ?, ?)', default_stock)

    conn.commit()
    conn.close()

# ── 2. TELEGRAM API UTILS ──
def tg_request(method, data=None):
    url = f"{API_URL}/{method}"
    try:
        if data:
            req_data = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(url, data=req_data, headers={'Content-Type': 'application/json'})
        else:
            req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"Telegram API Error [{method}]:", e)
        return None

def send_message(chat_id, text, reply_markup=None):
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    return tg_request("sendMessage", payload)

def edit_message(chat_id, message_id, text, reply_markup=None):
    payload = {
        "chat_id": chat_id,
        "message_id": message_id,
        "text": text,
        "parse_mode": "HTML"
    }
    if reply_markup is not None:
        payload["reply_markup"] = reply_markup
    return tg_request("editMessageText", payload)

def register_chat(chat_id, chat_title, chat_type):
    conn = get_db()
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO subscribed_chats (chat_id, chat_title, chat_type) VALUES (?, ?, ?)',
              (chat_id, str(chat_title), str(chat_type)))
    conn.commit()
    conn.close()

def get_all_chats():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT chat_id FROM subscribed_chats')
    rows = c.fetchall()
    conn.close()
    return [r['chat_id'] for r in rows]

# ── 3. CRM REPORT & STATS COMPUTATION ──
def generate_today_report():
    conn = get_db()
    c = conn.cursor()
    
    today_str = datetime.now().strftime('%Y-%m-%d')
    
    c.execute("SELECT COUNT(*) FROM leads WHERE date(created_at) = date('now')")
    total_today = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM leads WHERE date(created_at) = date('now') AND status = 'CONFIRMED'")
    confirmed_today = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM leads WHERE date(created_at) = date('now') AND status = 'CANCELLED'")
    cancelled_today = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM leads WHERE date(created_at) = date('now') AND status = 'NEW'")
    new_today = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM leads")
    total_all = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM leads WHERE status = 'CONFIRMED'")
    confirmed_all = c.fetchone()[0]

    conn.close()

    conv_rate = (confirmed_today / total_today * 100) if total_today > 0 else 0

    text = f"""
📊 <b>DESCO.PREMIUM — KUNLIK CRM HISOBOT</b>
📅 <b>Sana:</b> {datetime.now().strftime('%d.%m.%Y | %H:%M')}

📥 <b>Bugungi Leadlar:</b> <code>{total_today} ta</code>
🟢 <b>Qabul qilingan zakazlar:</b> <code>{confirmed_today} ta</code>
🔴 <b>O'tkaz (Rad etilgan):</b> <code>{cancelled_today} ta</code>
⏳ <b>Kutilayotgan leadlar:</b> <code>{new_today} ta</code>
📈 <b>Bugungi Konversiya:</b> <code>{conv_rate:.1f}%</code>

─────────────────
📦 <b>JAMI BARCHA VAQT:</b>
• Jami leadlar: <code>{total_all} ta</code>
• Tasdiqlangan zakazlar: <code>{confirmed_all} ta</code>

⚡ <i>Real vaqt rejimida avtomatik yangilandi.</i>
    """.strip()

    return text

def generate_inventory_report():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT name, stock FROM inventory')
    rows = c.fetchall()
    conn.close()

    text = "📦 <b>DESCO.PREMIUM — OMBOR QOLDIG'I (REAL-TIME)</b>\n\n"
    for r in rows:
        status_icon = "🟢" if r['stock'] > 10 else ("🟡" if r['stock'] > 0 else "🔴")
        text += f"{status_icon} <b>{r['name']}:</b> <code>{r['stock']} ta</code>\n"

    text += "\n⚡ <i>Zakaz olganda ombor qoldig'i avtomatik ayriladi.</i>"
    return text

# persistent main menu keyboard
def get_main_menu_keyboard():
    return {
        "keyboard": [
            [{"text": "📊 Bugungi Hisobot"}, {"text": "📦 Ombor Qoldig'i"}],
            [{"text": "📥 Oxirgi Leadlar"}, {"text": "📈 Umumiy Statistika"}]
        ],
        "resize_keyboard": True
    }

# ── 4. LEAD CREATION & NOTIFICATION DISPATCH ──
def process_new_lead(lead_data):
    conn = get_db()
    c = conn.cursor()
    
    name = lead_data.get('name', 'Noma\'lum')
    phone = lead_data.get('phone', 'Noma\'lum')
    product = lead_data.get('product', 'Desco Massajer')
    product_code = lead_data.get('product_code', '3ta-gold')
    plan = lead_data.get('plan', '12 oylik nasiya')

    c.execute('''
        INSERT INTO leads (name, phone, product, product_code, plan, status)
        VALUES (?, ?, ?, ?, ?, 'NEW')
    ''', (name, phone, product, product_code, plan))
    
    lead_id = c.lastrowid
    conn.commit()
    conn.close()

    msg_text = f"""
🛍 <b>YANGI LEAD (CRM ID: #{lead_id})</b>

👤 <b>Mijoz:</b> {name}
📞 <b>Telefon:</b> <code>{phone}</code>
📦 <b>Mahsulot:</b> {product}
💳 <b>To'lov rejasi:</b> {plan}
🕒 <b>Vaqt:</b> {datetime.now().strftime('%H:%M:%S')}

⚡ <i>Statusni o'zgartirish uchun pastdagi tugmani bosing:</i>
    """.strip()

    inline_kb = {
        "inline_keyboard": [
            [
                {"text": "✅ Zakaz Olindi", "callback_data": f"conf_{lead_id}"},
                {"text": "❌ O'tkaz (Rad)", "callback_data": f"canc_{lead_id}"}
            ]
        ]
    }

    # Broadcast to all registered groups & admin chats
    chats = get_all_chats()
    for cid in chats:
        send_message(cid, msg_text, reply_markup=inline_kb)

    return lead_id

# ── 5. BOT LONG-POLLING ENGINE ──
def bot_polling_loop():
    print("Starting CRM Bot Long-Polling Loop...")
    offset = 0
    while True:
        try:
            updates = tg_request("getUpdates", {"offset": offset, "timeout": 20})
            if updates and updates.get("ok"):
                for u in updates.get("result", []):
                    offset = u["update_id"] + 1
                    handle_update(u)
        except Exception as e:
            print("Polling Exception:", e)
            time.sleep(2)

def handle_update(u):
    if "message" in u:
        msg = u["message"]
        chat = msg["chat"]
        chat_id = chat["id"]
        chat_title = chat.get("title") or chat.get("username") or chat.get("first_name") or "User"
        chat_type = chat.get("type", "private")
        
        # Auto-register group or user
        register_chat(chat_id, chat_title, chat_type)

        text = msg.get("text", "")

        if text.startswith("/start") or text == "/menu":
            send_message(chat_id, f"👋 <b>Salom, {chat_title}!</b>\n\nDesco.premium CRM & Hisobot Botiga xush kelibsiz! Pastdagi menyudan kerakli bo'limni tanlang:", reply_markup=get_main_menu_keyboard())

        elif text == "📊 Bugungi Hisobot" or text == "/report":
            report_text = generate_today_report()
            send_message(chat_id, report_text, reply_markup=get_main_menu_keyboard())

        elif text == "📦 Ombor Qoldig'i" or text == "/inventory":
            inv_text = generate_inventory_report()
            send_message(chat_id, inv_text, reply_markup=get_main_menu_keyboard())

        elif text == "📈 Umumiy Statistika":
            report_text = generate_today_report()
            send_message(chat_id, report_text, reply_markup=get_main_menu_keyboard())

        elif text == "📥 Oxirgi Leadlar":
            conn = get_db()
            c = conn.cursor()
            c.execute('SELECT * FROM leads ORDER BY id DESC LIMIT 5')
            rows = c.fetchall()
            conn.close()

            if not rows:
                send_message(chat_id, "ℹ️ Hali hech qanday lead kelmagan.", reply_markup=get_main_menu_keyboard())
            else:
                send_message(chat_id, f"📥 <b>OXIRGI 5 TA LEAD:</b>", reply_markup=get_main_menu_keyboard())
                for r in rows:
                    st_icon = "🟢" if r['status'] == 'CONFIRMED' else ("🔴" if r['status'] == 'CANCELLED' else "🟡")
                    l_text = f"{st_icon} <b>Lead #{r['id']}</b> — {r['name']} ({r['phone']})\n📦 {r['product']} | Status: <b>{r['status']}</b>"
                    kb = {
                        "inline_keyboard": [
                            [
                                {"text": "✅ Zakaz Olindi", "callback_data": f"conf_{r['id']}"},
                                {"text": "❌ O'tkaz", "callback_data": f"canc_{r['id']}"}
                            ]
                        ]
                    }
                    send_message(chat_id, l_text, reply_markup=kb)

    elif "callback_query" in u:
        cb = u["callback_query"]
        cb_id = cb["id"]
        chat_id = cb["message"]["chat"]["id"]
        msg_id = cb["message"]["message_id"]
        data = cb.get("data", "")
        user_name = cb["from"].get("first_name", "Operator")

        if data.startswith("conf_"):
            lead_id = data.split("_")[1]
            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
            lead = c.fetchone()
            
            if lead:
                c.execute("UPDATE leads SET status = 'CONFIRMED', confirmed_by = ? WHERE id = ?", (user_name, lead_id))
                # Decrement inventory stock
                c.execute("UPDATE inventory SET stock = MAX(0, stock - 1) WHERE code = ?", (lead['product_code'],))
                conn.commit()

                updated_text = f"""
✅ <b>ZAKAZ TASDIQLANDI! (ID: #{lead_id})</b>

👤 <b>Mijoz:</b> {lead['name']}
📞 <b>Telefon:</b> <code>{lead['phone']}</code>
📦 <b>Mahsulot:</b> {lead['product']}
💳 <b>To'lov rejasi:</b> {lead['plan']}
👨‍💼 <b>Qabul qildi:</b> {user_name}
🕒 <b>Vaqt:</b> {datetime.now().strftime('%H:%M:%S')}

🟢 <i>Ombordan 1 ta mahsulot avtomatik ayrildi!</i>
                """.strip()

                edit_message(chat_id, msg_id, updated_text, reply_markup={"inline_keyboard": []})
                tg_request("answerCallbackQuery", {"callback_query_id": cb_id, "text": "✅ Zakaz olindi va ombordan ayrildi!"})
            conn.close()

        elif data.startswith("canc_"):
            lead_id = data.split("_")[1]
            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
            lead = c.fetchone()
            
            if lead:
                c.execute("UPDATE leads SET status = 'CANCELLED', confirmed_by = ? WHERE id = ?", (user_name, lead_id))
                conn.commit()

                updated_text = f"""
❌ <b>ZAKAZ RAD ETILDI / O'TKAZ! (ID: #{lead_id})</b>

👤 <b>Mijoz:</b> {lead['name']}
📞 <b>Telefon:</b> <code>{lead['phone']}</code>
📦 <b>Mahsulot:</b> {lead['product']}
👨‍💼 <b>Belgiladi:</b> {user_name}
🕒 <b>Vaqt:</b> {datetime.now().strftime('%H:%M:%S')}

🔴 <i>Status: Bekor qilindi</i>
                """.strip()

                edit_message(chat_id, msg_id, updated_text, reply_markup={"inline_keyboard": []})
                tg_request("answerCallbackQuery", {"callback_query_id": cb_id, "text": "❌ Lead bekor qilindi deb belgilandi."})
            conn.close()

# ── 6. HTTP SERVER FOR LANDING PAGE WEBHOOK ──
class CRMRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/lead':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body.decode('utf-8'))
                lead_id = process_new_lead(data)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "lead_id": lead_id}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_http_server():
    server = HTTPServer(('0.0.0.0', 8999), CRMRequestHandler)
    print("CRM HTTP Webhook Server running on port 8999...")
    server.serve_forever()

# ── 7. MAIN ENTRYPOINT ──
if __name__ == '__main__':
    init_db()
    
    # Start HTTP Webhook thread
    http_thread = Thread(target=run_http_server, daemon=True)
    http_thread.start()

    # Start Bot Polling loop
    bot_polling_loop()
