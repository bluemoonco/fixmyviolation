from pathlib import Path
from lxml import html
from urllib.parse import urlsplit,unquote
import json,re,gzip
root=Path(__file__).resolve().parents[1]/'public'
errors=[];titles=[];descriptions=[]; count=0
for file in root.rglob('*.html'):
    doc=html.fromstring(file.read_text());count+=1
    if len(doc.xpath('//h1'))!=1:errors.append(f'{file}: h1 count')
    ids=doc.xpath('//@id')
    if len(ids)!=len(set(ids)):errors.append(f'{file}: duplicate ids')
    titles+=doc.xpath('//title/text()');descriptions+=doc.xpath('//meta[@name="description"]/@content')
    for script in doc.xpath('//script[@type="application/ld+json"]/text()'):json.loads(script)
    for target in doc.xpath('//@href|//script/@src|//img/@src'):
        u=urlsplit(target)
        if u.scheme or u.netloc:continue
        path=root/unquote(u.path).lstrip('/') if u.path else file
        if path.is_dir():path=path/'index.html'
        if not path.exists():errors.append(f'{file.relative_to(root)}: missing {target}')
        elif u.fragment and path.suffix=='.html' and not html.fromstring(path.read_text()).xpath(f'//*[@id="{u.fragment}"]'):errors.append(f'{file}: missing fragment {target}')
    for inp in doc.xpath('//input[not(@type="hidden") and not(@hidden)]|//select|//textarea'):
        if not doc.xpath(f'//label[@for="{inp.get("id")}"]'):errors.append(f'{file}: unlabeled {inp.get("name")}')
    text=doc.text_content()
    if re.search(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}',text):errors.append(f'{file}: email address')
if len(titles)!=len(set(titles)):errors.append('Duplicate titles')
if len(descriptions)!=len(set(descriptions)):errors.append('Duplicate descriptions')
print(f'{count} pages; unique titles/descriptions, one H1, JSON-LD parse, form labels, internal destinations/fragments, no public email.')
print('Errors:',json.dumps(errors,indent=2))
print('Homepage / CSS / JS gzip bytes:',*[len(gzip.compress((root/p).read_bytes())) for p in ['index.html','assets/site.v1.css','assets/site.v2.js']])
raise SystemExit(bool(errors))
