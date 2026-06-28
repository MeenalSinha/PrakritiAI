import urllib.request, json, re

try:
    res = urllib.request.urlopen('https://prakriti-ai-kappa.vercel.app/')
    html = res.read().decode('utf-8')
    js_files = re.findall(r'href="(/assets/[^"]+\.js)"', html) + re.findall(r'src="(/assets/[^"]+\.js)"', html)
    
    jpg_found = False
    png_found = False
    
    for js_file in js_files:
        js_url = 'https://prakriti-ai-kappa.vercel.app' + js_file
        js_code = urllib.request.urlopen(js_url).read().decode('utf-8')
        if 'jeevamrut.jpg' in js_code:
            print(f'Found .jpg in {js_file}')
            jpg_found = True
        if 'jeevamrut.png' in js_code:
            print(f'Found .png in {js_file}')
            png_found = True
            
    print('Any JPG?', jpg_found)
    print('Any PNG?', png_found)
except Exception as e:
    print(f"Error: {e}")
