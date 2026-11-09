import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def make_profile():
    size = 1080
    im = Image.new("RGBA", (size, size), (5, 8, 17, 255))
    
    # 1. Radial glow in the center
    glow_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    center = size // 2
    
    # Draw radial gradient circles
    for r in range(480, 0, -8):
        alpha = int(45 * (1 - (r / 480) ** 1.5))
        glow_draw.ellipse(
            [center - r, center - r, center + r, center + r],
            fill=(2, 132, 199, alpha)
        )
    for r in range(240, 0, -6):
        alpha = int(80 * (1 - (r / 240) ** 1.8))
        glow_draw.ellipse(
            [center - r, center - r, center + r, center + r],
            fill=(56, 189, 248, alpha)
        )
    
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(30))
    im = Image.alpha_composite(im, glow_layer)
    
    # 2. Sleek circular tech frame matching circular crop (radius 430px, diameter 860px)
    ring_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring_layer)
    ring_r = 440
    ring_draw.ellipse(
        [center - ring_r, center - ring_r, center + ring_r, center + ring_r],
        outline=(56, 189, 248, 65),
        width=3
    )
    # Inner subtle dashed or thinner ring
    ring_r2 = 420
    ring_draw.ellipse(
        [center - ring_r2, center - ring_r2, center + ring_r2, center + ring_r2],
        outline=(255, 255, 255, 25),
        width=1
    )
    im = Image.alpha_composite(im, ring_layer)
    
    # 3. Logo Symbol
    sym_path = "apps/web/public/brand/VolleyStack_09_symbol_dark.png"
    if os.path.exists(sym_path):
        sym = Image.open(sym_path).convert("RGBA")
        # Scale symbol to ~520px width
        target_w = 540
        ratio = target_w / sym.width
        target_h = int(sym.height * ratio)
        sym_resized = sym.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Shadow / glow for symbol
        shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        sym_x = (size - target_w) // 2
        sym_y = (size - target_h) // 2 - 10
        shadow.paste(sym_resized, (sym_x, sym_y), sym_resized)
        
        # Make a vibrant cyan blur
        r_chan, g_chan, b_chan, a_chan = shadow.split()
        cyan_solid = Image.new("RGBA", (size, size), (56, 189, 248, 255))
        cyan_glow = Image.composite(cyan_solid, Image.new("RGBA", (size, size), (0,0,0,0)), a_chan)
        cyan_glow = cyan_glow.filter(ImageFilter.GaussianBlur(25))
        
        im = Image.alpha_composite(im, cyan_glow)
        im.paste(sym_resized, (sym_x, sym_y), sym_resized)
    
    # Save output
    out_path = "apps/web/public/social/volleystack_profile_1080x1080.png"
    im.save(out_path, "PNG")
    print("Saved profile:", out_path)

def make_cover():
    w, h = 1640, 924
    
    # Base Arena BG
    bg_path = "apps/web/public/backgrounds/volleyball_arena_poster.jpg"
    if os.path.exists(bg_path):
        bg = Image.open(bg_path).convert("RGBA")
        bg = bg.resize((w, h), Image.Resampling.LANCZOS)
    else:
        bg = Image.new("RGBA", (w, h), (4, 6, 10, 255))
        
    # Dark cinematic moody gradient overlay
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Left-heavy dark overlay
    for x in range(w):
        # Progress from 0.96 opacity on left to 0.65 on right
        factor = x / w
        alpha = int(245 - factor * 85)
        ov_draw.line([(x, 0), (x, h)], fill=(4, 8, 18, alpha))
        
    # Bottom vignette
    for y in range(h - 220, h):
        factor = (y - (h - 220)) / 220
        alpha = int(factor * 180)
        ov_draw.line([(0, y), (w, y)], fill=(2, 6, 14, alpha))
        
    im = Image.alpha_composite(bg, overlay)
    
    # Ambient cyan glow behind logo on the left
    glow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    for r in range(420, 0, -10):
        alpha = int(35 * (1 - (r / 420) ** 1.5))
        glow_draw.ellipse([260 - r, 440 - r, 260 + r, 440 + r], fill=(2, 132, 199, alpha))
    for r in range(200, 0, -8):
        alpha = int(60 * (1 - (r / 200) ** 1.8))
        glow_draw.ellipse([260 - r, 440 - r, 260 + r, 440 + r], fill=(56, 189, 248, alpha))
        
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(35))
    im = Image.alpha_composite(im, glow_layer)
    
    # Draw content
    draw = ImageDraw.Draw(im)
    
    font_dir = os.path.join(os.environ.get("WINDIR", "C:/Windows"), "Fonts")
    bold_font_path = os.path.join(font_dir, "segoeuib.ttf")
    if not os.path.exists(bold_font_path):
        bold_font_path = os.path.join(font_dir, "arialbd.ttf")
    reg_font_path = os.path.join(font_dir, "segoeui.ttf")
    if not os.path.exists(reg_font_path):
        reg_font_path = os.path.join(font_dir, "arial.ttf")
        
    font_badge = ImageFont.truetype(bold_font_path, 22)
    font_slogan = ImageFont.truetype(bold_font_path, 46)
    font_sub = ImageFont.truetype(reg_font_path, 28)
    font_pill = ImageFont.truetype(bold_font_path, 24)
    font_card_title = ImageFont.truetype(bold_font_path, 24)
    font_card_desc = ImageFont.truetype(reg_font_path, 20)
    
    # 1. Top Category Badge
    badge_x, badge_y = 120, 160
    badge_text = "⚡ LO SPOGLIATOIO DIGITALE PER IL VOLLEY"
    bbox = font_badge.getbbox(badge_text)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad_x, pad_y = 20, 10
    
    # Badge background
    badge_rect = [badge_x, badge_y, badge_x + tw + pad_x * 2, badge_y + th + pad_y * 2]
    badge_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge_layer)
    b_draw.rounded_rectangle(badge_rect, radius=12, fill=(10, 64, 89, 220), outline=(56, 189, 248, 120), width=2)
    b_draw.text((badge_x + pad_x, badge_y + pad_y - 2), badge_text, font=font_badge, fill=(56, 189, 248, 255))
    im = Image.alpha_composite(im, badge_layer)
    
    # 2. Horizontal Logo
    logo_path = "apps/web/public/brand/VolleyStack_09_horizontal_dark.png"
    logo_y = 240
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        target_w = 680
        ratio = target_w / logo.width
        target_h = int(logo.height * ratio)
        logo_res = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Glow for logo
        l_glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        l_glow.paste(logo_res, (120, logo_y), logo_res)
        _, _, _, a = l_glow.split()
        solid = Image.new("RGBA", (w, h), (56, 189, 248, 220))
        comp = Image.composite(solid, Image.new("RGBA", (w, h), (0,0,0,0)), a)
        comp = comp.filter(ImageFilter.GaussianBlur(18))
        im = Image.alpha_composite(im, comp)
        im.paste(logo_res, (120, logo_y), logo_res)
        slogan_y = logo_y + target_h + 30
    else:
        draw.text((120, logo_y), "VolleyStack", font=font_slogan, fill=(255, 255, 255))
        slogan_y = logo_y + 80
        
    # 3. Slogan & Pitch
    draw.text((120, slogan_y), "La piattaforma per atleti, capitani e allenatori.", font=font_slogan, fill=(255, 255, 255, 255))
    
    # 4. Feature list
    feats = [
        "✓  Convocazioni, Presenze & RSVPs in tempo reale",
        "✓  Cassa di Squadra, Regolamento Multe & Saldo Pagamenti",
        "✓  Tradizionale Turno Paste & Promemoria Compleanni 🎂",
    ]
    feat_y = slogan_y + 80
    for f in feats:
        draw.text((120, feat_y), f, font=font_sub, fill=(203, 213, 225, 240))
        feat_y += 48
        
    # 5. Bottom domain pill
    pill_text = "🌐  volleystack.pages.dev"
    pill_bbox = font_pill.getbbox(pill_text)
    pw, ph = pill_bbox[2] - pill_bbox[0], pill_bbox[3] - pill_bbox[1]
    pill_rect = [120, feat_y + 20, 120 + pw + 40, feat_y + 20 + ph + 24]
    
    pill_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(pill_layer)
    p_draw.rounded_rectangle(pill_rect, radius=14, fill=(255, 255, 255, 240))
    p_draw.text((140, feat_y + 30), pill_text, font=font_pill, fill=(4, 6, 10, 255))
    im = Image.alpha_composite(im, pill_layer)
    
    # 6. Right side floating glassmorphism cards
    cards_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(cards_layer)
    
    # Card 1: Prossima Partita
    c1_rect = [1060, 220, 1500, 360]
    c_draw.rounded_rectangle(c1_rect, radius=20, fill=(15, 23, 42, 210), outline=(56, 189, 248, 80), width=2)
    c_draw.text((1090, 245), "🏐 PROSSIMA GARA", font=font_card_title, fill=(56, 189, 248, 255))
    c_draw.text((1090, 285), "Domenica ore 18:00 · Palazzetto Sport", font=font_card_desc, fill=(241, 245, 249, 255))
    c_draw.text((1090, 315), "12 Giocatori Convocati · Presenze 100%", font=font_card_desc, fill=(148, 163, 184, 255))
    
    # Card 2: Cassa & Multe
    c2_rect = [1120, 400, 1520, 540]
    c_draw.rounded_rectangle(c2_rect, radius=20, fill=(15, 23, 42, 210), outline=(245, 158, 11, 80), width=2)
    c_draw.text((1150, 425), "💰 CASSA & MULTE VOLLEY", font=font_card_title, fill=(251, 191, 36, 255))
    c_draw.text((1150, 465), "Tariffario ufficiale (Paynalty style)", font=font_card_desc, fill=(241, 245, 249, 255))
    c_draw.text((1150, 495), "In partita vale doppio (2x) · Saldo rapido", font=font_card_desc, fill=(148, 163, 184, 255))
    
    # Card 3: Compleanni & Paste
    c3_rect = [1080, 580, 1480, 720]
    c_draw.rounded_rectangle(c3_rect, radius=20, fill=(15, 23, 42, 210), outline=(236, 72, 153, 80), width=2)
    c_draw.text((1110, 605), "🎂 TURNO PASTE SPOGLIATOIO", font=font_card_title, fill=(244, 114, 182, 255))
    c_draw.text((1110, 645), "Promemoria compleanni per il tesoriere", font=font_card_desc, fill=(241, 245, 249, 255))
    c_draw.text((1110, 675), "Pasticcini assicurati al prossimo allenamento!", font=font_card_desc, fill=(148, 163, 184, 255))
    
    cards_layer = cards_layer.filter(ImageFilter.BoxBlur(0))
    im = Image.alpha_composite(im, cards_layer)
    
    out_path = "apps/web/public/social/volleystack_cover_1640x924.png"
    im.save(out_path, "PNG")
    print("Saved cover:", out_path)

if __name__ == "__main__":
    os.makedirs("apps/web/public/social", exist_ok=True)
    make_profile()
    make_cover()

