import os
import re
import base64

def build_standalone():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    with open(os.path.join(base_dir, 'index_modular.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    with open(os.path.join(base_dir, 'css', 'style.css'), 'r', encoding='utf-8') as f:
        style_css = f.read()

    with open(os.path.join(base_dir, 'css', 'animations.css'), 'r', encoding='utf-8') as f:
        animations_css = f.read()

    with open(os.path.join(base_dir, 'config.js'), 'r', encoding='utf-8') as f:
        config_js = f.read()

    with open(os.path.join(base_dir, 'js', 'bubbles-art.js'), 'r', encoding='utf-8') as f:
        bubbles_art_js = f.read()

    with open(os.path.join(base_dir, 'js', 'calendar.js'), 'r', encoding='utf-8') as f:
        calendar_js = f.read()

    with open(os.path.join(base_dir, 'js', 'app.js'), 'r', encoding='utf-8') as f:
        app_js = f.read()

    def file_to_b64(rel_path):
        full_path = os.path.join(base_dir, rel_path.replace('/', os.sep))
        if os.path.exists(full_path):
            ext = os.path.splitext(full_path)[1].lower().replace('.', '')
            if ext == 'jpg':
                ext = 'jpeg'
            with open(full_path, 'rb') as img_f:
                b64_str = base64.b64encode(img_f.read()).decode('utf-8')
            return f'data:image/{ext};base64,{b64_str}'
        return rel_path

    # Convert chapter images in config.js to base64 data URIs
    def img_to_b64_match(match):
        rel_path = match.group(1)
        b64_uri = file_to_b64(rel_path)
        return f'image: "{b64_uri}"'

    config_js_b64 = re.sub(r'image:\s*"([^"]+)"', img_to_b64_match, config_js)

    # Convert Bubbles hero and giggle images in app.js to base64 data URIs
    bubbles_hero_b64 = file_to_b64('assets/bubbles_hero.jpg')
    bubbles_giggle_b64 = file_to_b64('assets/bubbles_giggle.jpg')
    app_js_b64 = app_js.replace("'assets/bubbles_hero.jpg'", f'"{bubbles_hero_b64}"')
    app_js_b64 = app_js_b64.replace("'assets/bubbles_giggle.jpg'", f'"{bubbles_giggle_b64}"')

    # Combine CSS
    combined_css = f"<style>\n/* --- style.css --- */\n{style_css}\n\n/* --- animations.css --- */\n{animations_css}\n</style>"

    html_bundled = re.sub(
        r'<link\s+rel="stylesheet"\s+href="css/style\.css">\s*<link\s+rel="stylesheet"\s+href="css/animations\.css">',
        lambda m: combined_css,
        html
    )

    # Combine JS
    combined_js = f"<script>\n/* --- config.js --- */\n{config_js_b64}\n\n/* --- bubbles-art.js --- */\n{bubbles_art_js}\n\n/* --- calendar.js --- */\n{calendar_js}\n\n/* --- app.js --- */\n{app_js_b64}\n</script>"

    html_bundled = re.sub(
        r'<script\s+src="config\.js"></script>\s*<script\s+src="js/bubbles-art\.js"></script>\s*<script\s+src="js/calendar\.js"></script>\s*<script\s+src="js/app\.js"></script>',
        lambda m: combined_js,
        html_bundled
    )

    out_file = os.path.join(base_dir, 'index.html')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html_bundled)

    print(f"Created standalone index.html: {len(html_bundled)} bytes")

if __name__ == '__main__':
    build_standalone()
