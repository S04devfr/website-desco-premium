import math
from PIL import Image, ImageDraw, ImageFilter

def create_hd_massager(filename, body_color_start, body_color_end, trim_color_start, trim_color_end, accent_color=(197, 155, 39)):
    width, height = 1000, 1000
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Ambient Drop Shadow underneath
    shadow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.ellipse([200, 800, 800, 920], fill=(0, 0, 0, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    img.paste(shadow, (0, 0), shadow)

    # 2. Main Outer Housing (Sleek Ergonomic Massager Body)
    housing_box = [180, 220, 820, 840]
    
    # Draw metallic gradient housing
    for y in range(220, 841):
        t = (y - 220) / 620.0
        # Color interpolation
        r = int(body_color_start[0] * (1 - t) + body_color_end[0] * t)
        g = int(body_color_start[1] * (1 - t) + body_color_end[1] * t)
        b = int(body_color_start[2] * (1 - t) + body_color_end[2] * t)
        
        # Horizontal curvature highlights
        h_ratio = math.sin(t * math.pi)
        
        draw.line([180 + int(30 * (1-h_ratio)), y, 820 - int(30 * (1-h_ratio)), y], fill=(r, g, b, 255), width=1)

    # Outer Glossy Bezel Frame
    draw.rounded_rectangle(housing_box, radius=90, outline=trim_color_start, width=8)
    draw.rounded_rectangle([184, 224, 816, 836], radius=86, outline=trim_color_end, width=4)

    # Top Crown Curved Hood
    draw.chord([180, 160, 820, 320], start=180, end=360, fill=body_color_start, outline=trim_color_start, width=6)

    # 3. Dual Deep Massage Chambers (Left and Right Foot Pockets)
    left_pocket = [230, 280, 470, 780]
    right_pocket = [530, 280, 770, 780]

    # Inner Fabric Cushion (Rich Dark Obsidian Fabric Inside)
    draw.rounded_rectangle(left_pocket, radius=55, fill=(18, 18, 22, 255), outline=(40, 40, 48, 255), width=5)
    draw.rounded_rectangle(right_pocket, radius=55, fill=(18, 18, 22, 255), outline=(40, 40, 48, 255), width=5)

    # Chamber Airbag Texture Lines
    for y_pos in range(320, 740, 30):
        draw.line([250, y_pos, 450, y_pos], fill=(35, 35, 42, 255), width=2)
        draw.line([550, y_pos, 750, y_pos], fill=(35, 35, 42, 255), width=2)

    # 4. Central Premium Touch Screen Panel
    panel_box = [460, 380, 540, 560]
    draw.rounded_rectangle(panel_box, radius=16, fill=(10, 10, 14, 255), outline=accent_color, width=4)
    
    # Glowing LED Display Screen
    draw.rounded_rectangle([472, 395, 528, 460], radius=8, fill=(15, 23, 42, 255), outline=(56, 189, 248, 255), width=2)
    # LED Digital Readout (15 min)
    draw.text((482, 412), "15", fill=(56, 189, 248, 255))

    # Touch Buttons on Panel
    draw.ellipse([480, 480, 500, 500], fill=accent_color)
    draw.ellipse([500, 480, 520, 500], fill=(220, 220, 220))
    draw.ellipse([490, 515, 510, 535], fill=(56, 189, 248))

    # 5. Metallic Base Pedestal Stand
    draw.rounded_rectangle([260, 810, 740, 860], radius=24, fill=trim_color_start, outline=trim_color_end, width=4)

    # 6. Ultra-Glossy Curved Highlights (Glass sheen)
    gloss = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gloss)
    g_draw.polygon([(200, 220), (380, 220), (280, 700), (190, 700)], fill=(255, 255, 255, 40))
    img.paste(gloss, (0, 0), gloss)

    img.save(filename, "PNG", quality=100)
    print(f"Saved HD Render: {filename}")

# Generate HD Colors for 3-Funksiyalik
create_hd_massager("img/color-3-gold.png", (212, 175, 55), (160, 120, 20), (245, 225, 150), (180, 140, 30))
create_hd_massager("img/color-3-silver.png", (220, 225, 230), (150, 155, 165), (255, 255, 255), (180, 185, 195))
create_hd_massager("img/color-3-black.png", (30, 32, 38), (12, 14, 18), (80, 85, 95), (40, 42, 48))
create_hd_massager("img/color-3-red.png", (220, 38, 38), (140, 20, 20), (254, 180, 180), (185, 28, 28))

# Generate HD Colors for 6-Funksiyalik
create_hd_massager("img/color-6-silver.png", (230, 235, 240), (160, 165, 175), (255, 255, 255), (190, 195, 205), accent_color=(56, 189, 248))
create_hd_massager("img/color-6-black.png", (35, 38, 45), (15, 18, 22), (90, 95, 105), (50, 55, 65), accent_color=(56, 189, 248))
create_hd_massager("img/color-6-gold.png", (215, 180, 60), (165, 125, 25), (250, 230, 160), (185, 145, 35), accent_color=(56, 189, 248))

