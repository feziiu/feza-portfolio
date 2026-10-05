"""Create WebP assets from referenced originals, preserving source files."""
from pathlib import Path
from PIL import Image, ImageOps
import re
root = Path(__file__).resolve().parents[1]
sources = {}
for page in root.glob('*.html'):
    for src in re.findall(r'<img[^>]+src="([^"]+)"', page.read_text()):
        if Path(src).suffix.lower() in ('.png', '.jpg', '.jpeg'):
            sources[src] = 1000 if '/redesign/' in src else 1350
before = after = 0
outputs = {}
for src, width in sources.items():
    path = root / src
    with Image.open(path) as original:
        im = ImageOps.exif_transpose(original)
        scale = min(1, width / im.width, 16000 / im.height)
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
        if im.mode not in ('RGB', 'RGBA'): im = im.convert('RGBA' if 'transparency' in im.info else 'RGB')
        target = path.with_suffix('.webp')
        im.save(target, 'WEBP', quality=88, method=6)
        outputs[src] = (target.relative_to(root).as_posix(), im.width, im.height)
        before += path.stat().st_size
        after += target.stat().st_size
for page in root.glob('*.html'):
    def update(match):
        tag = match.group(0)
        source = re.search(r'src="([^"]+)"', tag).group(1)
        if source not in outputs: return tag
        target, w, h = outputs[source]
        tag = tag.replace(source, target)
        tag = re.sub(r'\s(?:width|height|loading|decoding|fetchpriority)="[^"]*"', '', tag)
        is_hero = source == 'assets/img/redesign/hero.png'
        attrs = ' loading="eager" fetchpriority="high"' if is_hero else ' loading="lazy"'
        return tag[:-1] + f' width="{w}" height="{h}" decoding="async"' + attrs + '>'
    page.write_text(re.sub(r'<img\b[^>]*>', update, page.read_text()))
if before: print(f'{len(outputs)} images: {before / 1e6:.2f} MB → {after / 1e6:.2f} MB ({(1-after/before)*100:.1f}% smaller)')
