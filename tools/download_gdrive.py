import urllib.request
import http.cookiejar
import re
import sys
import os

file_id = '1tQOMWjiQDaNZe2XkU71CjFWIYAvN8vHf'
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0')]

url = f'https://drive.google.com/uc?export=download&id={file_id}'
res = opener.open(url)
html = res.read().decode('utf-8', errors='ignore')

action_match = re.search(r'action="([^"]+)"', html)
params = []
for m in re.finditer(r'<input\s+type="hidden"\s+name="([^"]+)"\s+value="([^"]*)"', html):
    params.append((m.group(1), m.group(2)))

import urllib.parse
query_str = urllib.parse.urlencode(params)
download_url = action_match.group(1) if action_match else 'https://drive.usercontent.google.com/download'
final_url = download_url + ('?' + query_str if '?' not in download_url else '&' + query_str)

print('Connecting to download stream...')
dl_res = opener.open(final_url)
total_size = int(dl_res.headers.get('Content-Length', 0))
print(f'Total file size: {total_size / (1024*1024):.2f} MB')

out_path = os.path.join('assets', 'cell_ebook_walkthrough.mp4')
os.makedirs('assets', exist_ok=True)

with open(out_path, 'wb') as out_file:
    downloaded = 0
    while True:
        chunk = dl_res.read(2 * 1024 * 1024)
        if not chunk:
            break
        out_file.write(chunk)
        downloaded += len(chunk)
        pct = (downloaded / total_size * 100) if total_size else 0
        sys.stdout.write(f'\rDownloaded: {downloaded / (1024*1024):.2f} MB / {total_size / (1024*1024):.2f} MB ({pct:.1f}%)')
        sys.stdout.flush()

print('\nDownload completed successfully: ' + out_path)
