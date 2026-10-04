import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os

PORT = 8085
API_KEY = "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"
NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, xi-api-key')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Content-Length', '0')
        self.end_headers()

    def send_json(self, status, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        self.wfile.flush()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                req = urllib.request.Request(
                    NVIDIA_URL,
                    data=post_data,
                    headers={
                        'Content-Type': 'application/json',
                        'Authorization': f'Bearer {API_KEY}'
                    },
                    method='POST'
                )
                with urllib.request.urlopen(req, timeout=45) as resp:
                    resp_data = resp.read()
                    self.send_response(resp.status)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Content-Length', str(len(resp_data)))
                    self.end_headers()
                    self.wfile.write(resp_data)
                    self.wfile.flush()
            except urllib.error.HTTPError as e:
                err_data = e.read()
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err_data)))
                self.end_headers()
                self.wfile.write(err_data)
                self.wfile.flush()
            except Exception as e:
                self.send_json(500, {'error': str(e)})

        elif self.path == '/api/tts':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                text = payload.get('text', '')
                voice_id = payload.get('voice_id', '21m00Tcm4TlvDq8ikWAM')  # Rachel (Multilingual)
                xi_key = payload.get('api_key') or os.environ.get('ELEVENLABS_API_KEY') or ''
                
                if not xi_key:
                    self.send_json(400, {
                        'error': 'No ElevenLabs API key provided',
                        'hint': 'Please provide an API key in the avatar settings or env ELEVENLABS_API_KEY'
                    })
                    return
                
                tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
                tts_body = json.dumps({
                    "text": text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.75
                    }
                }).encode('utf-8')
                
                req = urllib.request.Request(
                    tts_url,
                    data=tts_body,
                    headers={
                        'xi-api-key': xi_key,
                        'Content-Type': 'application/json',
                        'Accept': 'audio/mpeg'
                    },
                    method='POST'
                )
                with urllib.request.urlopen(req, timeout=30) as resp:
                    audio_data = resp.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_header('Content-Length', str(len(audio_data)))
                    self.end_headers()
                    self.wfile.write(audio_data)
                    self.wfile.flush()
            except urllib.error.HTTPError as e:
                err_data = e.read()
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err_data)))
                self.end_headers()
                self.wfile.write(err_data)
                self.wfile.flush()
            except Exception as e:
                self.send_json(500, {'error': str(e)})
        else:
            self.send_error(404, "Not Found")

if __name__ == '__main__':
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    socketserver.TCPServer.allow_reuse_address = True
    print(f"Starting Cell Life 3D Web & AI Proxy Server on http://localhost:{PORT}...")
    with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
        httpd.serve_forever()
