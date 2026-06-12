from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse, subprocess, json, os

def get_spec_info():
    spec = open('.current_spec').read().strip() if os.path.exists('.current_spec') else 'nephilim'
    path = f'{spec}.spec'
    info = {'spec': f'{spec}.spec', 'symmetry':'?', 'freq':'?'}
    try:
        with open(path) as f:
            for line in f:
                if 'internal_symmetry' in line: info['symmetry'] = line.split(':',1)[1].strip()
                if 'resonant_frequency' in line: info['freq'] = line.split(':',1)[1].strip()
    except: pass
    return info

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        text = q.get('text',[''])[0]
        out = subprocess.check_output(['./target/release/nephilim-core', text], cwd='core').decode()
        d = {}
        for l in out.splitlines():
            if ':' in l: k,v = l.split(':',1); d[k.strip()] = v.strip()
        d.update(get_spec_info())
        self.send_response(200); self.send_header('Content-Type','application/json'); self.send_header('Access-Control-Allow-Origin','*'); self.end_headers()
        self.wfile.write(json.dumps(d).encode())

print('VESPER server on http://127.0.0.1:5000')
HTTPServer(('127.0.0.1',5000), H).serve_forever()
