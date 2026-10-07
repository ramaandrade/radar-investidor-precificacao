/**
 * Passo 6: Radar do Investidor - Precificação de Ativos e Teorias de Mercado
 * Script Principal da Aplicação Mobile Fast Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const cards = document.querySelectorAll('.modular-card');
  const toggleAllBtn = document.getElementById('toggle-all-btn');
  const progressFill = document.getElementById('reading-progress-fill');
  const progressText = document.getElementById('reading-progress-text');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // Modais
  const inspectorModal = document.getElementById('inspector-modal');
  const openInspectorBtn = document.getElementById('open-inspector-btn');
  const closeInspectorBtn = document.getElementById('close-inspector-btn');
  const copyMetricsBtn = document.getElementById('copy-metrics-btn');

  // Garantia ativa contra cache: Remove qualquer elemento legado de footer ou quiz
  document.querySelectorAll('.sticky-footer, #sticky-cta-btn, #quiz-modal').forEach(el => el.remove());

  // Conjunto de cards explorados
  const exploredCards = new Set();
  const totalCards = cards.length;

  /**
   * Feedback Háptico suave no smartphone (se suportado)
   */
  const triggerHaptic = (ms = 12) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // Silencioso se não houver permissão
      }
    }
  };

  /**
   * Gerenciamento de Tema (Terminal Dark vs Clean Light)
   */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('radar_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        triggerHaptic(10);
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('radar_theme', nextTheme);

        window.radarAnalytics?.logEvent('theme_toggled', { theme: nextTheme });
      });
    }
  };

  /**
   * Atualização da barra e contador de progresso
   */
  const updateProgress = () => {
    const count = exploredCards.size;
    const percent = Math.round((count / totalCards) * 100);

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }

    if (progressText) {
      progressText.textContent = `${count}/${totalCards} explorados`;
      if (count === totalCards) {
        progressText.classList.add('completed');
      } else {
        progressText.classList.remove('completed');
      }
    }
  };

  /**
   * Inicialização e controle dos acordeões (Zero-Delay < 100ms)
   */
  cards.forEach((card) => {
    const header = card.querySelector('.card-header');
    const cardId = card.getAttribute('data-card-id') || 'unknown';
    const cardTitle = card.querySelector('.card-title')?.textContent?.trim() || '';

    // Se o primeiro card já começar aberto, marca
    if (card.classList.contains('is-open')) {
      exploredCards.add(cardId);
      updateProgress();
    }

    header.addEventListener('click', () => {
      triggerHaptic(14);
      const isOpen = card.classList.contains('is-open');

      if (isOpen) {
        card.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
        window.radarAnalytics?.trackCardToggle(cardId, cardTitle, false);
      } else {
        card.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        exploredCards.add(cardId);
        updateProgress();
        window.radarAnalytics?.trackCardToggle(cardId, cardTitle, true);
      }
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  /**
   * Botão Alternar Todos (Expandir/Recolher)
   */
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      triggerHaptic(15);
      const anyClosed = Array.from(cards).some(c => !c.classList.contains('is-open'));

      cards.forEach((card) => {
        const header = card.querySelector('.card-header');
        const cardId = card.getAttribute('data-card-id');

        if (anyClosed) {
          card.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
          exploredCards.add(cardId);
        } else {
          card.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
        }
      });

      updateProgress();
      toggleAllBtn.textContent = anyClosed ? 'Recolher todos' : 'Expandir todos';

      window.radarAnalytics?.logEvent('toggle_all_clicked', {
        action: anyClosed ? 'expand_all' : 'collapse_all'
      });
    });
  }

  /**
   * =========================================================================
   * MICRO-SIMULADORES INTERATIVOS
   * =========================================================================
   */

  // 1. Simulador: Preço vs. Valor (Margem de Segurança)
  const priceSlider = document.getElementById('price-slider');
  const priceDisplay = document.getElementById('price-display');
  const marginDisplay = document.getElementById('margin-display');
  const decisionBadge = document.getElementById('decision-badge');
  const INTRINSIC_VALUE = 50.0; // Valor fixado conforme exemplo do PRD (R$ 50,00)

  const updatePriceVsValue = () => {
    if (!priceSlider) return;
    const currentPrice = parseFloat(priceSlider.value);
    if (priceDisplay) priceDisplay.textContent = `R$ ${currentPrice.toFixed(2)}`;

    // Margem = (Valor - Preço) / Valor
    const margin = ((INTRINSIC_VALUE - currentPrice) / INTRINSIC_VALUE) * 100;

    if (marginDisplay) {
      marginDisplay.textContent = `${margin.toFixed(1)}%`;
      marginDisplay.style.color = margin > 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    }

    if (decisionBadge) {
      if (margin >= 20) {
        decisionBadge.textContent = 'COMPRA FORTE (Margem Ampla)';
        decisionBadge.className = 'result-badge buy';
      } else if (margin > 0) {
        decisionBadge.textContent = 'COMPRA ARRISCADA (Margem Estreita)';
        decisionBadge.className = 'result-badge';
        decisionBadge.style.color = 'var(--accent-amber)';
      } else {
        decisionBadge.textContent = 'NÃO COMPRE (Sobrepreço / Caríssimo)';
        decisionBadge.className = 'result-badge avoid';
      }
    }
  };

  if (priceSlider) {
    priceSlider.addEventListener('input', () => {
      updatePriceVsValue();
    });
    priceSlider.addEventListener('change', () => {
      window.radarAnalytics?.trackSimulatorInteraction('preco_vs_valor', {
        price: parseFloat(priceSlider.value),
        intrinsicValue: INTRINSIC_VALUE
      });
    });
    updatePriceVsValue();
  }

  // 2. Simulador: CAPM Express
  const selicSlider = document.getElementById('selic-slider');
  const betaSlider = document.getElementById('beta-slider');
  const erpSlider = document.getElementById('erp-slider');
  const selicDisplay = document.getElementById('selic-display');
  const betaDisplay = document.getElementById('beta-display');
  const erpDisplay = document.getElementById('erp-display');
  const capmResult = document.getElementById('capm-result');
  const capmInsight = document.getElementById('capm-insight');

  const updateCapm = () => {
    if (!selicSlider || !betaSlider || !erpSlider) return;
    const rf = parseFloat(selicSlider.value);
    const beta = parseFloat(betaSlider.value);
    const erp = parseFloat(erpSlider.value);

    if (selicDisplay) selicDisplay.textContent = `${rf.toFixed(2)}%`;
    if (betaDisplay) betaDisplay.textContent = `${beta.toFixed(2)}x`;
    if (erpDisplay) erpDisplay.textContent = `${erp.toFixed(2)}%`;

    // E(R) = Rf + Beta * ERP
    const expectedReturn = rf + (beta * erp);

    if (capmResult) {
      capmResult.textContent = `${expectedReturn.toFixed(2)}% a.a.`;
    }

    if (capmInsight) {
      capmInsight.textContent = `A empresa tem risco ${beta > 1 ? 'maior' : beta < 1 ? 'menor' : 'igual'} ao do mercado. Você exige ${expectedReturn.toFixed(2)}% para aceitar comprá-la!`;
    }
  };

  [selicSlider, betaSlider, erpSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', updateCapm);
      slider.addEventListener('change', () => {
        window.radarAnalytics?.trackSimulatorInteraction('capm_calculator', {
          rf: parseFloat(selicSlider.value),
          beta: parseFloat(betaSlider.value),
          erp: parseFloat(erpSlider.value)
        });
      });
    }
  });
  updateCapm();

  // 3. Widget Interativo: Aversão à Perda (Kahneman & Tversky)
  const lossBtnGain = document.getElementById('loss-btn-gain');
  const lossBtnLoss = document.getElementById('loss-btn-loss');
  const lossExpText = document.getElementById('loss-explanation');

  if (lossBtnGain && lossBtnLoss && lossExpText) {
    lossBtnGain.addEventListener('click', () => {
      triggerHaptic(10);
      lossExpText.innerHTML = '<strong>Ganho de R$ 1.000:</strong> Sensação de satisfação moderada (+1.0x). Você se sente contente, mas logo se acostuma.';
      lossExpText.style.color = 'var(--accent-green)';
      window.radarAnalytics?.trackSimulatorInteraction('loss_aversion', { selected: 'gain' });
    });

    lossBtnLoss.addEventListener('click', () => {
      triggerHaptic(25);
      lossExpText.innerHTML = '<strong>Perda de R$ 1.000:</strong> Dor emocional intensa (-2.0x a -2.5x)! O cérebro reage como se sofresse dano físico. Por isso investidores vendem no fundo em pânico!';
      lossExpText.style.color = 'var(--accent-red)';
      window.radarAnalytics?.trackSimulatorInteraction('loss_aversion', { selected: 'loss' });
    });
  }

  /**
   * =========================================================================
   * TOOLKIT DA INTERNET & DISPARO DO "AHA MOMENT" (DAMODARAN)
   * =========================================================================
   */
  const toolkitLinks = document.querySelectorAll('.toolkit-item');
  toolkitLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const toolKey = link.getAttribute('data-tool-key');
      const href = link.getAttribute('href');

      if (toolKey === 'damodaran') {
        // Dispara o AHA MOMENT oficial do PRD!
        window.radarAnalytics?.trackDamodaranAhaMoment(href);
      } else {
        const toolName = link.querySelector('.toolkit-name')?.textContent?.trim() || toolKey;
        const category = link.getAttribute('data-category') || 'market_tool';
        window.radarAnalytics?.trackToolkitClick(toolName, href, category);
      }
    });
  });

  /**
   * =========================================================================
   * PAINEL INSPETOR DO DOCENTE (TELEMETRIA EM TEMPO REAL)
   * =========================================================================
   */
  if (openInspectorBtn && inspectorModal) {
    openInspectorBtn.addEventListener('click', () => {
      triggerHaptic(10);
      inspectorModal.classList.add('active');
      window.radarAnalytics?.updateInspectorUI();
    });
  }

  if (closeInspectorBtn && inspectorModal) {
    closeInspectorBtn.addEventListener('click', () => {
      inspectorModal.classList.remove('active');
    });
  }

  if (copyMetricsBtn) {
    copyMetricsBtn.addEventListener('click', () => {
      triggerHaptic(15);
      const payload = window.radarAnalytics?.generateExportPayload() || {};
      const str = JSON.stringify(payload, null, 2);

      navigator.clipboard.writeText(str).then(() => {
        copyMetricsBtn.textContent = '✅ Copiado com Sucesso!';
        setTimeout(() => {
          copyMetricsBtn.textContent = '📋 Copiar Relatório JSON';
        }, 2200);
      }).catch(err => {
        console.error('Erro ao copiar', err);
      });
    });
  }

  // Fechar modal do inspetor ao clicar no overlay externo
  if (inspectorModal) {
    inspectorModal.addEventListener('click', (e) => {
      if (e.target === inspectorModal) {
        inspectorModal.classList.remove('active');
      }
    });
  }

  // Inicializa tema
  initTheme();

  /**
   * =========================================================================
   * REGISTRO DO SERVICE WORKER (PWA OFFLINE-FIRST)
   * =========================================================================
   */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          console.log('[PWA] Service Worker registrado com sucesso:', reg.scope);
        })
        .catch(err => {
          console.warn('[PWA] Falha ao registrar Service Worker:', err);
        });
    });
  }

  // Monitoramento de conectividade online/offline
  const offlinePill = document.getElementById('offline-status-pill');
  const updateOnlineStatus = () => {
    if (!offlinePill) return;
    if (navigator.onLine) {
      offlinePill.className = 'offline-pill is-online';
      offlinePill.querySelector('.status-text').textContent = 'Online • Terminal Conectado';
    } else {
      offlinePill.className = 'offline-pill is-offline';
      offlinePill.querySelector('.status-text').textContent = 'Offline • Modo Cache Ativo';
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
});
