# 📡 Passo 6 — Radar do Investidor: Precificação de Ativos e Teorias de Mercado

> 🌐 **Acesso Online (GitHub Pages):** [https://ramaandrade.github.io/radar-investidor-precificacao/](https://ramaandrade.github.io/radar-investidor-precificacao/)  
> 📦 **Repositório GitHub:** [https://github.com/ramaandrade/radar-investidor-precificacao](https://github.com/ramaandrade/radar-investidor-precificacao)  
> 📱 **Formato:** Fast Page Mobile (*Single-Page Scroller*) Mobile-First  
> 🎓 **Contexto Acadêmico:** Fechamento analítico do módulo de Precificação de Ativos e Teorias de Mercado  
> 🧭 **Posição na Trilha:** Passo 6 de 6 (Aulão prático e desmistificação antes da Avaliação Final)  
> 🏛️ **Público:** Estudantes de Finanças, Ciências Econômicas, Mercado de Capitais e Valuation  
> ⚡ **Performance:** Resposta táctil < 100ms, Tipografia Fluida (`clamp()`), PWA 100% Offline  

---

## 🎯 1. Visão Geral e Objetivo do Recurso

O recurso **"Passo 6 - Radar do Investidor: Precificação de Ativos e Teorias de Mercado"** atua como o elo definitivo entre a teoria acadêmica clássica (fórmulas matemáticas, CAPM, WACC, FCD) e o **"chão de fábrica" do mercado financeiro**.

Projetado sob a filosofia de *fast page* mobile, o aplicativo traduz equações e premissas densas em comportamentos práticos do dia a dia dos analistas, preparando a mente do estudante para a avaliação de fixação e para o mercado real.

---

## 📱 2. Especificações de UI/UX (Interface e Experiência)

* **Layout Fast Page Ergonômico:** Desenvolvido prioritariamente para dispositivos móveis (360px+), respeitando a *thumb zone* com alvos de toque mínimos de 48px.
* **Dual Theme (Terminal Bloomberg / Profit & Clean Pro):** 
  - **Modo Terminal Escuro (Padrão):** Paleta inspirada nos terminais profissionais de negociação (Bloomberg, Koyfin, Profit), com fundo escuro de alto contraste e acentos em âmbar, ciano e esmeralda.
  - **Modo Clean Pro Claro:** Interface arejada para leitura sob iluminação intensa ou preferência individual, com persistência no `localStorage`.
* **Acordeões de "Decodificação" com Zero-Delay (<100ms):**
  - Implementação via CSS Grid puro (`grid-template-rows: 0fr -> 1fr`), dispensando cálculos de altura via JavaScript.
  - Transições a 60/120fps nativas aceleradas por GPU com abertura e fechamento instantâneos.
* **Elementos Gráficos SVG Inline Ultraleves:**
  - Balança de *Preço vs. Valor*
  - Curva de Ciclo Emocional e Histeria Coletiva (*HME*)
  - Dualidade de Processamento Cerebral e Aversão à Perda (*Kahneman & Tversky*)
  - Máquina de Fluxo de Caixa Descontado (*DCF / FCD*)
  - Linha do Mercado de Títulos (*CAPM / SML*)
  - Escudo da *Margem de Segurança*

---

## 📚 3. Conteúdo Pedagógico Desmistificado

### 🧠 Card A: O Mindset — Racionalidade vs. Caos (Teorias de Mercado)
1. **Preço vs. Valor (A Lição Nº 1 de Warren Buffett):**  
   *"Preço é o que você paga, Valor é o que você leva."* A precificação busca achar o Valor intrínseco pelos fundamentos da companhia; o mercado dita o Preço na tela a cada milissegundo. Se o Preço < Valor, compra-se com desconto.  
   *Inclui micro-simulador interativo de Preço vs. Valor com cálculo dinâmico de Margem de Segurança.*
2. **A Ilusão da Eficiência (HME):**  
   A Hipótese dos Mercados Eficientes defende que as cotações sempre refletem todas as notícias. Na prática, momentos de euforia e pânico coletivo geram distorções grosseiras, criando as verdadeiras janelas de lucro para investidores disciplinados.
3. **Finanças Comportamentais na Veia (Kahneman & Tversky):**  
   A neurociência comprova que a **dor de perder R$ 1.000 é mais de duas vezes maior que o prazer de ganhar R$ 1.000** (Aversão à Perda). Alerta explícito contra viés de confirmação e efeito manada.  
   *Inclui widget tátil sensorial comparando as intensidades emocionais de Ganho (+1.0x) vs. Perda (-2.5x).*

### ⚙️ Card B: A Máquina de Precificação (O Motor do Valuation)
1. **Fluxo de Caixa Descontado (FCD / DCF):**  
   Uma ação é uma fração de um negócio real. Seu valor hoje é a soma de todo o caixa livre que ele gerará no futuro trazido a valor presente pelo custo de oportunidade. *"Cash is King" (O Caixa é Rei)*.
2. **Risco e Retorno (O Famoso CAPM):**  
   Não existe almoço grátis. Para aceitar a oscilação de uma ação, o investidor exige:  
   $$E(R) = R_f + \beta \times [E(R_m) - R_f]$$  
   *Inclui Calculadora CAPM Express interativa com ajuste de Selic, Beta e Prêmio de Risco.*
3. **Margem de Segurança (Graham & Buffett):**  
   Nunca confie 100% na planilha. Se a fórmula aponta que a empresa vale R$ 50,00, não compre por R$ 49,00; compre por R$ 35,00 para proteger o patrimônio contra incertezas e crises.

### 🛠️ Card C: Toolkit da Internet (Onde os Quants e Analistas Vivem)
Botões de toque largo (mínimo 48px) com atalhos diretos:
* 🌟 **Aswath Damodaran (NYU Stern) — "O Santo Graal":** Maior base de dados aberta do planeta para Valuation (Betas setoriais, ERP, WACC e planilhas gratuitas).  
  *Gera o evento de telemetria crucial: `aha_moment_damodaran_accessed`!*
* 📈 **TradingView:** Ecossistema gráfico global para análise comportamental do fluxo e pressão compradora/vendedora de curto prazo.
* 🏛️ **Portal CVM / SEC EDGAR:** Acesso direto às demonstrações financeiras oficiais auditadas (DRE, DFC, Balanços Patrimoniais) na fonte reguladora, sem intermediários.
* 📊 **Status Invest (Múltiplos Históricos):** Comparação do P/L e EV/EBITDA atual com as médias de 5 e 10 anos da empresa.

---

## ⚡ 4. Requisitos Técnicos & Auditoria Docente

### 🚀 Zero-Delay & Tipografia Fluida
* Animações estruturadas puramente em CSS (`grid-template-rows`), garantindo abertura e resposta tátil em menos de 100ms.
* Tipografia baseada em `clamp()` que se autoajusta fluidamente a telas de 360px a monitores ultrawide, permitindo leitura confortável até em situações adversas (ônibus, sol ou baixa luminosidade).

### 📊 Telemetria de Engajamento & "Aha Moment"
* **Disparo do "Aha Moment":** Ao tocar no botão de Damodaran (NYU), a aplicação dispara um evento analítico dedicado, exibindo um toast comemorativo e registrando o marco na telemetria docente.
* **Scroll Depth:** Registro de marcos de 25%, 50%, 75% e 100%.
* **Tempo de Leitura Ativa:** Cronometrado por card apenas enquanto a aba estiver visível (`visibilitychange`).
* **Painel do Docente Integrado:** Acesso rápido no topo superior direito com tempo de estudo, profundidade de scroll, status do Aha Moment e exportação de JSON para integração com LMS.

### 📦 PWA Offline-First
* Suporte a Service Worker (`sw.js`) com cache prévio de arquivos essenciais e Web App Manifest (`manifest.json`) para instalação como aplicativo na tela inicial do celular.

---

## 💻 5. Como Executar Localmente

```bash
# Navegue até a pasta do recurso:
cd C:\Users\ramal\.gemini\antigravity\scratch\radar-investidor-precificacao

# Inicie o servidor local:
python serve.py 8087

# Acesse no navegador:
http://localhost:8087/index.html

# Para rodar a suíte de testes automatizados:
python tests/test_suite.py
```
