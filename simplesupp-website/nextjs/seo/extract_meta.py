from bs4 import BeautifulSoup
from pathlib import Path
import csv

base = Path('/home/ubuntu/aviera_audit')
rows = []
for path in sorted(base.glob('*.html')):
    text = path.read_text(errors='ignore')
    soup = BeautifulSoup(text, 'html.parser')
    title = soup.title.get_text(' ', strip=True) if soup.title else ''
    desc = ''
    md = soup.find('meta', attrs={'name':'description'})
    if md and md.get('content'):
        desc = md['content'].strip()
    canonical = ''
    link = soup.find('link', attrs={'rel': lambda v: v and 'canonical' in v})
    if link and link.get('href'):
        canonical = link['href'].strip()
    og_title = ''
    og_desc = ''
    og_image = ''
    for prop, key in [('og:title','og_title'),('og:description','og_desc'),('og:image','og_image')]:
        tag = soup.find('meta', attrs={'property': prop})
        val = tag.get('content','').strip() if tag else ''
        if key == 'og_title':
            og_title = val
        elif key == 'og_desc':
            og_desc = val
        else:
            og_image = val
    h1 = ' | '.join(h.get_text(' ', strip=True) for h in soup.find_all('h1'))
    h2 = ' | '.join(h.get_text(' ', strip=True) for h in soup.find_all('h2')[:5])
    word_count = len(soup.get_text(' ', strip=True).split())
    rows.append({
        'file': path.name,
        'title': title,
        'title_len': len(title),
        'meta_description': desc,
        'meta_desc_len': len(desc),
        'canonical': canonical,
        'og_title': og_title,
        'og_description': og_desc,
        'og_image': og_image,
        'h1': h1,
        'h2_sample': h2,
        'word_count': word_count,
    })

out = base / 'meta_summary.csv'
with out.open('w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)
print(out)
