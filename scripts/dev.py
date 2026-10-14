"""Bygg och visa Receptboken lokalt utan beroenden."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Request logging must not interrupt responses when a terminal closes.
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=5173)
    args = parser.parse_args()
    subprocess.run([sys.executable, str(ROOT/'scripts/build.py')], cwd=ROOT, check=True)
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(ROOT/'dist')))
    except OSError as error:
        raise SystemExit(f'Kunde inte starta på port {args.port}. Stoppa den gamla servern med Ctrl+C eller välj --port 5174.\n{error}')
    print(f'Öppna http://127.0.0.1:{args.port}/ – stoppa med Ctrl+C.', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
