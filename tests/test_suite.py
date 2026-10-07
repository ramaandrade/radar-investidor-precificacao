#!/usr/bin/env python3
"""
Test Suite de Validação e Integridade Técnica
Passo 6: Radar do Investidor - Precificação de Ativos e Teorias de Mercado
"""

import os
import re
import unittest

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestRadarPrecificacaoIntegrity(unittest.TestCase):
    def setUp(self):
        self.root = PROJECT_ROOT
        self.html_path = os.path.join(self.root, 'index.html')
        self.css_path = os.path.join(self.root, 'css', 'styles.css')
        self.analytics_path = os.path.join(self.root, 'js', 'analytics.js')
        self.app_path = os.path.join(self.root, 'js', 'app.js')
        self.manifest_path = os.path.join(self.root, 'manifest.json')
        self.sw_path = os.path.join(self.root, 'sw.js')
        self.icon192_path = os.path.join(self.root, 'assets', 'icon-192.svg')
        self.icon512_path = os.path.join(self.root, 'assets', 'icon-512.svg')

    def test_files_exist(self):
        """Verifica se todos os arquivos obrigatórios existem"""
        files = [
            self.html_path, self.css_path, self.analytics_path,
            self.app_path, self.manifest_path, self.sw_path,
            self.icon192_path, self.icon512_path
        ]
        for f in files:
            self.assertTrue(os.path.isfile(f), f"Arquivo não encontrado: {f}")

    def test_prd_content_card_a(self):
        """Valida requisitos de conteúdo do Card A"""
        with open(self.html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('Preço vs. Valor', content)
        self.assertIn('Warren Buffett', content)
        self.assertIn('A Ilusão da Eficiência', content)
        self.assertIn('Finanças Comportamentais', content)
        self.assertIn('Kahneman', content)
        self.assertIn('Aversão à Perda', content)

    def test_prd_content_card_b(self):
        """Valida requisitos de conteúdo do Card B"""
        with open(self.html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('Fluxo de Caixa Descontado', content)
        self.assertIn('Cash is King', content)
        self.assertIn('CAPM', content)
        self.assertIn('Margem de Segurança', content)

    def test_prd_content_card_c_toolkit(self):
        """Valida ferramentas do Toolkit do Card C e links"""
        with open(self.html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('Aswath Damodaran', content)
        self.assertIn('TradingView', content)
        self.assertIn('Portal CVM', content)
        self.assertIn('Status Invest', content)
        self.assertIn('data-tool-key="damodaran"', content)

    def test_aha_moment_tracking(self):
        """Valida se a métrica de Aha Moment do Damodaran está implementada"""
        with open(self.analytics_path, 'r', encoding='utf-8') as f:
            analytics_code = f.read()

        self.assertIn('trackDamodaranAhaMoment', analytics_code)
        self.assertIn('aha_moment_damodaran_accessed', analytics_code)

        with open(self.app_path, 'r', encoding='utf-8') as f:
            app_code = f.read()

        self.assertIn('trackDamodaranAhaMoment', app_code)

    def test_zero_delay_and_fluid_typography(self):
        """Valida zero-delay e tipografia fluida clamp() no CSS"""
        with open(self.css_path, 'r', encoding='utf-8') as f:
            css_code = f.read()

        self.assertIn('clamp(', css_code, "Deveria conter regras de tipografia fluida clamp()")
        self.assertIn('grid-template-rows', css_code, "Deveria usar técnica CSS Grid para acordeões fluidos")
        self.assertIn('data-theme="light"', css_code, "Deveria suportar alternância de temas")

    def test_sticky_cta_present(self):
        """Valida a presença do Sticky Footer persistente"""
        with open(self.html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('sticky-footer', content)
        self.assertIn('Estou Pronto: Iniciar Avaliação', content)

    def test_pwa_service_worker_registered(self):
        """Valida registro do Service Worker e suporte offline"""
        with open(self.app_path, 'r', encoding='utf-8') as f:
            app_code = f.read()

        self.assertIn('serviceWorker.register', app_code)

        with open(self.sw_path, 'r', encoding='utf-8') as f:
            sw_code = f.read()

        self.assertIn('CACHE_NAME', sw_code)

if __name__ == '__main__':
    unittest.main()
