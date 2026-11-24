import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette (Dark Financial / Linear aesthetic)
    BG_DARK = RGBColor(13, 15, 21)       # #0d0f15
    SURFACE_DARK = RGBColor(18, 20, 28)  # #12141c
    BORDER_DARK = RGBColor(30, 34, 48)   # #1e2230
    BTC_ORANGE = RGBColor(247, 147, 26)  # #f7931a
    TEXT_LIGHT = RGBColor(243, 244, 246) # #f3f4f6
    TEXT_MUTED = RGBColor(156, 163, 175) # #9ca3af
    EMERALD_GREEN = RGBColor(16, 185, 129) # #10b981
    SKY_BLUE = RGBColor(56, 189, 248)    # #38bdf8

    def add_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_card(slide, left, top, width, height, border_color=BORDER_DARK, bg_color=SURFACE_DARK):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        return card

    # ==========================================
    # SLIDE 1: Title Slide (Grand Impact)
    # ==========================================
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])
    add_background(slide1)

    # Main Card
    add_card(slide1, Inches(1.5), Inches(1.2), Inches(10.333), Inches(5.1), border_color=BTC_ORANGE)

    # Badge Pill
    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.2), Inches(1.8), Inches(2.5), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(35, 25, 15)
    badge.line.color.rgb = BTC_ORANGE
    badge_tf = badge.text_frame
    badge_tf.paragraphs[0].text = "BITCOIN & LIGHTNING HACKATHON"
    badge_tf.paragraphs[0].font.size = Pt(10)
    badge_tf.paragraphs[0].font.bold = True
    badge_tf.paragraphs[0].font.color.rgb = BTC_ORANGE
    badge_tf.paragraphs[0].alignment = PP_ALIGN.CENTER

    # Title & Subtitle
    tx_box = slide1.shapes.add_textbox(Inches(2.2), Inches(2.5), Inches(8.9), Inches(3.0))
    tf = tx_box.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "BTC Copilot"
    p0.font.size = Pt(48)
    p0.font.bold = True
    p0.font.color.rgb = TEXT_LIGHT

    p1 = tf.add_paragraph()
    p1.text = "L'Assistant Intelligent et Gardien de Sécurité pour Bitcoin & Lightning"
    p1.font.size = Pt(22)
    p1.font.bold = True
    p1.font.color.rgb = BTC_ORANGE
    p1.space_before = Pt(12)

    p2 = tf.add_paragraph()
    p2.text = "Comprendre, surveiller et interagir en toute sécurité. 100% Non-Custodial, Zéro Clé Privée."
    p2.font.size = Pt(15)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_before = Pt(10)

    # ==========================================
    # SLIDE 2: Le Problème (Pain Points)
    # ==========================================
    slide2 = prs.slides.add_slide(prs.slide_layouts[6])
    add_background(slide2)

    # Header
    head_box = slide2.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(1.0))
    htf = head_box.text_frame
    hp = htf.paragraphs[0]
    hp.text = "Le Problème : Pourquoi Bitcoin reste intimidant ?"
    hp.font.size = Pt(32)
    hp.font.bold = True
    hp.font.color.rgb = TEXT_LIGHT

    # 3 Cards Problem
    problems = [
        ("🤯 Jargon & Incompréhension", "Les explorateurs de blocs sont conçus pour les développeurs. UTXO, vBytes, mempool congestion, scripts... Un utilisateur novice est totalement perdu face à ses transactions."),
        ("🛡️ Arnaques & Attaques Dust", "Multiplication des attaques par poussière (dust attack < 546 sats) et adresses frauduleuses visant à désanonymiser et dérober les fonds des épargnants sans avertissement."),
        ("⚡ Complexité de Lightning", "Le Layer 2 offre des paiements instantanés à frais infimes, mais la gestion des canaux et des factures BOLT-11 effraie sans un compagnon clair et non-custodial.")
    ]

    for i, (title, desc) in enumerate(problems):
        left = Inches(1.0 + i * 3.9)
        add_card(slide2, left, Inches(2.2), Inches(3.6), Inches(4.5))
        cbox = slide2.shapes.add_textbox(left + Inches(0.2), Inches(2.5), Inches(3.2), Inches(3.8))
        ctf = cbox.text_frame
        ctf.word_wrap = True
        
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = BTC_ORANGE
        
        p2 = ctf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(14)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(14)

    # ==========================================
    # SLIDE 3: La Solution BTC Copilot
    # ==========================================
    slide3 = prs.slides.add_slide(prs.slide_layouts[6])
    add_background(slide3)

    head_box = slide3.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(1.0))
    htf = head_box.text_frame
    hp = htf.paragraphs[0]
    hp.text = "La Solution : Les 3 Piliers de BTC Copilot"
    hp.font.size = Pt(32)
    hp.font.bold = True
    hp.font.color.rgb = TEXT_LIGHT

    solutions = [
        ("💡 1. Pédagogie & IA Native", "Assistant IA (Google Gemini 3.5) connecté à une passerelle d'assainissement de confidentialité. Il vulgarise les vBytes, explique chaque frais et solde sans détours ni réponses bloquantes."),
        ("🛡️ 2. Gardien de Sécurité Actif", "Audit déterministe d'adresses en temps réel. Détection immédiate des attaques Dust, des vidages anormaux (wallet drain) et vérification automatique contre les bases de risques."),
        ("⚡ 3. Lightning via NWC (NIP-47)", "Intégration du standard Nostr Wallet Connect. Permet d'observer son solde Lightning et de simuler des micropaiements instantanés sans jamais confier sa clé privée.")
    ]

    for i, (title, desc) in enumerate(solutions):
        left = Inches(1.0 + i * 3.9)
        add_card(slide3, left, Inches(2.2), Inches(3.6), Inches(4.5), border_color=EMERALD_GREEN if i==0 else (BTC_ORANGE if i==1 else SKY_BLUE))
        cbox = slide3.shapes.add_textbox(left + Inches(0.2), Inches(2.5), Inches(3.2), Inches(3.8))
        ctf = cbox.text_frame
        ctf.word_wrap = True
        
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT
        
        p2 = ctf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(14)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(14)

    # ==========================================
    # SLIDE 4: Démonstration des 3 Profils Clés
    # ==========================================
    slide4 = prs.slides.add_slide(prs.slide_layouts[6])
    add_background(slide4)

    head_box = slide4.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(1.0))
    htf = head_box.text_frame
    hp = htf.paragraphs[0]
    hp.text = "Scénarios Démo Concrets pour le Jury"
    hp.font.size = Pt(32)
    hp.font.bold = True
    hp.font.color.rgb = TEXT_LIGHT

    personas = [
        ("🟢 Fatou", "Épargne & Découverte", "bc1qzg00x... (SegWit)", "60 000 sats reçus proprement. Zéro risque. L'IA vulgarise immédiatement l'historique et détaille les frais simplement."),
        ("🟠 Moussa", "Alerte Sécurité & Dust", "13AM4VW2d... (Legacy)", "Ciblé par une attaque dust (< 546 sats). BTC Copilot alerte immédiatement et bloque le risque de traçage de son identité."),
        ("⚡ Cheikh", "Paiements Lightning", "Nœud Phoenix (NWC)", "Connexion NWC instantanée. Démonstration de la vitesse Layer 2 : règlement en < 1 seconde et 1 satoshi de frais.")
    ]

    for i, (name, role, addr, desc) in enumerate(personas):
        left = Inches(1.0 + i * 3.9)
        add_card(slide4, left, Inches(2.2), Inches(3.6), Inches(4.5))
        cbox = slide4.shapes.add_textbox(left + Inches(0.2), Inches(2.5), Inches(3.2), Inches(3.8))
        ctf = cbox.text_frame
        ctf.word_wrap = True
        
        p = ctf.paragraphs[0]
        p.text = name
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT

        p_sub = ctf.add_paragraph()
        p_sub.text = role
        p_sub.font.size = Pt(13)
        p_sub.font.bold = True
        p_sub.font.color.rgb = BTC_ORANGE
        p_sub.space_before = Pt(4)

        p_addr = ctf.add_paragraph()
        p_addr.text = addr
        p_addr.font.size = Pt(11)
        p_addr.font.color.rgb = SKY_BLUE
        p_addr.space_before = Pt(8)
        
        p2 = ctf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(12)

    # ==========================================
    # SLIDE 5: Architecture & Respect de la Vie Privée
    # ==========================================
    slide5 = prs.slides.add_slide(prs.slide_layouts[6])
    add_background(slide5)

    head_box = slide5.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(1.0))
    htf = head_box.text_frame
    hp = htf.paragraphs[0]
    hp.text = "Architecture Technique & Confidentialité"
    hp.font.size = Pt(32)
    hp.font.bold = True
    hp.font.color.rgb = TEXT_LIGHT

    # 2 Big Cards
    add_card(slide5, Inches(1.0), Inches(2.2), Inches(5.5), Inches(4.5))
    cbox1 = slide5.shapes.add_textbox(Inches(1.3), Inches(2.5), Inches(4.9), Inches(3.9))
    ctf1 = cbox1.text_frame
    ctf1.word_wrap = True
    p = ctf1.paragraphs[0]
    p.text = "🔒 Privacy Gateway (Zéro Fuite)"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = EMERALD_GREEN

    points1 = [
        "• Aucune clé privée stockée ou manipulée (Mode Read-Only).",
        "• Assainissement préalable avant envoi au LLM : suppression des IP, masquage des métadonnées confidentielles.",
        "• Modèle Google Gemini 3.5 Flash-Lite à sub-seconde latence avec fallback local déterministe en cas de coupure."
    ]
    for pt in points1:
        pp = ctf1.add_paragraph()
        pp.text = pt
        pp.font.size = Pt(14)
        pp.font.color.rgb = TEXT_MUTED
        pp.space_before = Pt(10)

    add_card(slide5, Inches(6.8), Inches(2.2), Inches(5.5), Inches(4.5))
    cbox2 = slide5.shapes.add_textbox(Inches(7.1), Inches(2.5), Inches(4.9), Inches(3.9))
    ctf2 = cbox2.text_frame
    ctf2.word_wrap = True
    p = ctf2.paragraphs[0]
    p.text = "⚙️ Stack Technique Moderne"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = SKY_BLUE

    points2 = [
        "• Frontend / Backend : Next.js 14 App Router, TypeScript 100%.",
        "• Design System : Tailwind CSS v4, Dark Financial Theme.",
        "• Bitcoin On-Chain : Mempool.space REST API & Décodeur Bech32 local.",
        "• Layer 2 : Nostr Wallet Connect (NIP-47) & Relays Décentralisés."
    ]
    for pt in points2:
        pp = ctf2.add_paragraph()
        pp.text = pt
        pp.font.size = Pt(14)
        pp.font.color.rgb = TEXT_MUTED
        pp.space_before = Pt(10)

    # ==========================================
    # SLIDE 6: Conclusion & Impact
    # ==========================================
    slide6 = prs.slides.add_slide(prs.slide_layouts[6])
    add_background(slide6)

    add_card(slide6, Inches(1.5), Inches(1.2), Inches(10.333), Inches(5.1), border_color=EMERALD_GREEN)
    
    tx_box = slide6.shapes.add_textbox(Inches(2.2), Inches(1.8), Inches(8.9), Inches(4.0))
    tf = tx_box.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "L'Impact : Démocratiser Bitcoin en Toute Sérénité"
    p0.font.size = Pt(36)
    p0.font.bold = True
    p0.font.color.rgb = TEXT_LIGHT

    concl_points = [
        "🌍 Pour les nouveaux entrants : Élimination de la peur de l'erreur grâce à l'explication interactive.",
        "🛡️ Pour les épargnants : Surveillance continue contre le vol et les attaques sans confier ses clés.",
        "⚡ Pour l'écosystème : Accélération de l'adoption de Lightning et du standard ouvert Nostr (NIP-47).",
        "🚀 100% Fonctionnel & Déployable : Prêt pour le Mainnet."
    ]

    for pt in concl_points:
        p = tf.add_paragraph()
        p.text = pt
        p.font.size = Pt(16)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(14)

    output_path = "/Users/mac/.gemini/antigravity/scratch/btc-copilot/BTC_Copilot_Pitch_Deck.pptx"
    prs.save(output_path)
    print(f"Presentation saved to {output_path}")

if __name__ == '__main__':
    create_presentation()
