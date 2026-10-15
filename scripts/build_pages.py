"""Build a static export for a GitHub Pages project path or a custom domain."""
from pathlib import Path
import argparse
import re
import shutil

parser = argparse.ArgumentParser()
parser.add_argument('--base-path', default='/my_portfolio')
parser.add_argument('--output', default='_site')
args = parser.parse_args()
base = '/' + args.base_path.strip('/') if args.base_path.strip('/') else ''
if any(part in ('.', '..') for part in base.split('/')) or re.search(r'[^A-Za-z0-9_./-]', base):
    parser.error('base-path must be a URL path containing ordinary repository-name characters')
root = Path(__file__).resolve().parents[1]
source = root / 'dist'
out = (root / args.output).resolve()
if out == root or source == out or root not in out.parents:
    parser.error('output must be a separate directory within this project')
out.mkdir(parents=True, exist_ok=True)
shutil.copytree(source, out, dirs_exist_ok=True)
for file in out.rglob('*'):
    if not file.is_file():
        continue
    if file.suffix == '.html':
        content = file.read_text()
        content = re.sub(r'''(\b(?:href|src|poster|action)=["'])(/(?!/)[^"']*)''',
                         lambda m: m[1] + base + m[2], content)
    elif file.suffix == '.css':
        content = file.read_text()
        content = re.sub(r'''url\((["']?)(/(?!/)[^)'"\s]+)\1\)''',
                         lambda m: 'url(' + m[1] + base + m[2] + m[1] + ')', content)
    elif file.suffix == '.js':
        content = file.read_text()
        content = re.sub(r'''(["'])(/(?!/)[^"'\n]*)\1''',
                         lambda m: m[1] + base + m[2] + m[1], content)
    else:
        continue
    file.write_text(content)
(out / '.nojekyll').write_text('')
print(f'Built {out.name} with base path {base or "/"}')
