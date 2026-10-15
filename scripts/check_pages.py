"""Check exported page routes, fragments, assets and JavaScript/CSS root paths."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import argparse
import re

parser = argparse.ArgumentParser()
parser.add_argument('--directory', default='_site')
parser.add_argument('--base-path', default='/my_portfolio')
args = parser.parse_args()
root = Path(args.directory).resolve()
base = '/' + args.base_path.strip('/') if args.base_path.strip('/') else ''
pages = {}
refs = []
class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.file = file
        self.ids = set()
        self.h1 = 0
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if 'id' in data:
            assert data['id'] not in self.ids, (self.file, data['id'])
            self.ids.add(data['id'])
        self.h1 += tag == 'h1'
        for attr in ('href', 'src', 'poster'):
            if data.get(attr):
                refs.append((self.file, data[attr]))
        if tag == 'img':
            assert data.get('alt'), self.file
for file in root.rglob('*.html'):
    page = Page(file)
    page.feed(file.read_text())
    assert page.h1 == 1, file
    pages[file] = page

def local_target(file, url):
    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc:
        return None, None
    path = unquote(parsed.path)
    if path.startswith('/'):
        assert not base or path == base or path.startswith(base + '/'), (file, url)
        path = path[len(base):] if base else path
        target = root / path.lstrip('/')
    else:
        target = file.parent / path if path else file
    if target.is_dir():
        target = target / 'index.html'
    return target.resolve(), unquote(parsed.fragment)
for file, url in refs:
    target, fragment = local_target(file, url)
    if target is None:
        continue
    assert target.exists(), (file, url, target)
    if fragment and target in pages:
        assert fragment in pages[target].ids, (file, url)
for file in root.rglob('*'):
    if file.suffix not in ('.css', '.js'):
        continue
    text = file.read_text()
    pattern = r'''url\(["']?(/(?!/)[^)'"\s]+)''' if file.suffix == '.css' else r'''["'](/(?!/)[^"'\n]*)["']'''
    for match in re.finditer(pattern, text):
        target, _ = local_target(file, match[1])
        # JS constructs '/projects/robotics/#' + setting; its route still resolves.
        assert target is None or target.exists(), (file, match[1])
assert len(pages) == 6, len(pages)
print(f'PASS: {len(pages)} pages, all routes, fragments, image assets, CSS URLs and dynamic JS paths')
