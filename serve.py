#!/usr/bin/env python3
"""
Servidor local estático para o app web Passo 6 - Radar do Investidor (Precificação)
Uso: python serve.py [porta]
"""

import http.server
import socketserver
import sys
import os

PORT = 8087

if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        pass

# Garante que o diretório atual seja a raiz da pasta do projeto
current_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(current_dir)

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.css': 'text/css',
    '.html': 'text/html; charset=utf-8'
})

print(f"🚀 Iniciando Radar do Investidor (Precificação) em http://localhost:{PORT}")
print(f"📂 Diretório de trabalho: {current_dir}")
print(f"⚡ Pressione Ctrl+C para encerrar o servidor.")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor encerrado.")
