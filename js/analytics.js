/**
 * Passo 6: Radar do Investidor - Precificação de Ativos e Teorias de Mercado
 * Módulo de Analytics, Telemetria & Rastreamento de "Aha Moment"
 */

class PrecificacaoAnalytics {
  constructor() {
    this.sessionStartTime = Date.now();
    this.scrollMilestones = {
      25: false,
      50: false,
      75: false,
      100: false
    };
    this.eventsLog = [];
    this.cardReadingTimes = {
      'card-a': 0,
      'card-b': 0,
      'card-c': 0
    };
    this.activeCard = null;
    this.activeCardStartTime = null;
    this.hasReachedAhaMoment = false;
    this.activeTimerInterval = null;

    this.initScrollTracking();
    this.initVisibilityTracking();
    this.initTimeTracking();
    this.restoreStoredState();
  }

  /**
   * Restaura estado persistente anterior se houver
   */
  restoreStoredState() {
    try {
      const stored = sessionStorage.getItem('radar_precificacao_events');
      if (stored) {
        this.eventsLog = JSON.parse(stored);
        const ahaFound = this.eventsLog.some(e => e.event === 'aha_moment_damodaran_accessed');
        if (ahaFound) {
          this.hasReachedAhaMoment = true;
        }
      }
    } catch (e) {
      console.warn('Não foi possível restaurar sessão prévia', e);
    }
  }

  /**
   * Registra um evento de telemetria estruturado
   */
  logEvent(eventName, eventData = {}) {
    const timeOnPage = Math.round((Date.now() - this.sessionStartTime) / 1000);
    const event = {
      timestamp: new Date().toISOString(),
      timeOnPageSeconds: timeOnPage,
      event: eventName,
      data: eventData
    };

    this.eventsLog.push(event);

    try {
      sessionStorage.setItem('radar_precificacao_events', JSON.stringify(this.eventsLog));
      if (this.hasReachedAhaMoment) {
        localStorage.setItem('radar_precificacao_aha_moment', 'true');
      }
    } catch (e) {
      console.warn('Storage indisponível', e);
    }

    // Console com formatação especial inspirada em terminais de dados
    const isAha = eventName === 'aha_moment_damodaran_accessed';
    const tagBg = isAha ? '#10b981' : '#0284c7';
    console.info(
      `%c[RADAR PRECIFICAÇÃO]%c ${eventName} (+${timeOnPage}s)`,
      `background: ${tagBg}; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;`,
      'color: #38bdf8; font-weight: bold;',
      eventData
    );

    // Dispara CustomEvent global para LMS ou plataformas externas
    window.dispatchEvent(new CustomEvent('precificacao_analytics', { detail: event }));

    // Atualiza interface do Inspetor se estiver aberta
    this.updateInspectorUI();
  }

  /**
   * Monitora scroll tracking (25%, 50%, 75%, 100%)
   */
  initScrollTracking() {
    let ticking = false;

    const checkScrollDepth = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));

      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !this.scrollMilestones[milestone]) {
          this.scrollMilestones[milestone] = true;
          this.logEvent('scroll_depth_reached', {
            milestone: `${milestone}%`,
            actualPercent: scrollPercent,
            viewportY: Math.round(scrollTop),
            totalHeight: Math.round(docHeight)
          });
        }
      });

      // Atualiza badge de scroll no topo da tela
      const scrollBadge = document.getElementById('telemetry-scroll-badge');
      if (scrollBadge) {
        scrollBadge.textContent = `${scrollPercent}%`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScrollDepth);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Rastreia visibilidade da aba para não contar tempo falso
   */
  initVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseActiveCardReading();
        this.logEvent('session_visibility_hidden');
      } else {
        this.resumeActiveCardReading();
        this.logEvent('session_visibility_visible');
      }
    });
  }

  /**
   * Contador periódico de tempo
   */
  initTimeTracking() {
    this.activeTimerInterval = setInterval(() => {
      if (!document.hidden && this.activeCard && this.activeCardStartTime) {
        const deltaSec = Math.round((Date.now() - this.activeCardStartTime) / 1000);
        if (deltaSec >= 1) {
          this.cardReadingTimes[this.activeCard] = (this.cardReadingTimes[this.activeCard] || 0) + 1;
          this.activeCardStartTime = Date.now();
        }
      }
    }, 1000);
  }

  /**
   * Monitora expansão / recolhimento dos cards
   */
  trackCardToggle(cardId, cardTitle, isOpen) {
    if (isOpen) {
      this.pauseActiveCardReading();
      this.activeCard = cardId;
      this.activeCardStartTime = Date.now();

      this.logEvent('card_expanded', {
        cardId,
        cardTitle,
        action: 'open'
      });
    } else {
      if (this.activeCard === cardId) {
        this.pauseActiveCardReading();
        this.activeCard = null;
      }
      this.logEvent('card_collapsed', {
        cardId,
        cardTitle,
        action: 'close'
      });
    }
  }

  pauseActiveCardReading() {
    if (this.activeCard && this.activeCardStartTime) {
      const elapsed = Math.round((Date.now() - this.activeCardStartTime) / 1000);
      this.cardReadingTimes[this.activeCard] = (this.cardReadingTimes[this.activeCard] || 0) + elapsed;
      this.activeCardStartTime = null;
    }
  }

  resumeActiveCardReading() {
    if (this.activeCard) {
      this.activeCardStartTime = Date.now();
    }
  }

  /**
   * RASTREAMENTO DO AHA MOMENT: Aswath Damodaran (NYU Stern)
   * Requisito crítico do PRD: "Disparar um evento analítico específico quando o aluno clica
   * no link do site do Damodaran, pois este é um forte indicador de que o estudante realmente
   * se aprofundou nas ferramentas práticas do mercado de precificação."
   */
  trackDamodaranAhaMoment(linkUrl) {
    this.hasReachedAhaMoment = true;
    this.logEvent('aha_moment_damodaran_accessed', {
      source: 'toolkit_damodaran_button',
      institution: 'NYU Stern / Aswath Damodaran',
      significance: 'O aluno acessou a maior base global aberta de Betas, ERPs e WACCs para Valuation.',
      destinationUrl: linkUrl
    });

    // Exibe notificação tátil e visual de conquista
    this.showAhaToast();
  }

  /**
   * Rastreamento dos demais botões do toolkit
   */
  trackToolkitClick(toolName, url, category) {
    this.logEvent('toolkit_resource_clicked', {
      toolName,
      url,
      category
    });
  }

  /**
   * Rastreamento de micro-simuladores
   */
  trackSimulatorInteraction(simulatorName, payload) {
    this.logEvent('micro_simulator_used', {
      simulator: simulatorName,
      ...payload
    });
  }

  /**
   * Rastreia clique no CTA sticky da prova
   */
  trackStickyCtaClick() {
    this.logEvent('sticky_cta_clicked', {
      label: 'Estou Pronto: Iniciar Avaliação',
      totalReadCards: Object.values(this.cardReadingTimes).filter(t => t > 2).length,
      hasAhaMoment: this.hasReachedAhaMoment
    });
  }

  /**
   * Rastreia conclusão da avaliação de fixação
   */
  trackQuizCompleted(score, total, answers) {
    this.logEvent('quiz_assessment_completed', {
      score,
      total,
      percentage: Math.round((score / total) * 100),
      answers
    });
  }

  /**
   * Notificação visual de conquista Aha Moment
   */
  showAhaToast() {
    const toast = document.getElementById('aha-toast');
    if (!toast) return;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  /**
   * Atualiza a UI do inspetor docente em tempo real
   */
  updateInspectorUI() {
    const timeEl = document.getElementById('inspector-time');
    const scrollEl = document.getElementById('inspector-scroll');
    const ahaBadge = document.getElementById('inspector-aha-status');
    const logPre = document.getElementById('inspector-events-log');

    const totalSeconds = Math.round((Date.now() - this.sessionStartTime) / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    if (timeEl) {
      timeEl.textContent = `${mins}m ${secs}s`;
    }

    if (scrollEl) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
      scrollEl.textContent = `${scrollPercent}%`;
    }

    if (ahaBadge) {
      if (this.hasReachedAhaMoment) {
        ahaBadge.innerHTML = '<span style="color:#10b981;font-weight:700;">✅ DESBLOQUEADO (Damodaran Acessado)</span>';
      } else {
        ahaBadge.innerHTML = '<span style="color:#94a3b8;">⏳ Pendente (Clique no Damodaran)</span>';
      }
    }

    if (logPre) {
      logPre.textContent = JSON.stringify(this.eventsLog.slice(-10), null, 2);
    }
  }

  /**
   * Gera relatório exportável de telemetria
   */
  generateExportPayload() {
    return {
      studentSession: {
        startTime: new Date(this.sessionStartTime).toISOString(),
        totalSessionSeconds: Math.round((Date.now() - this.sessionStartTime) / 1000),
        scrollMilestones: this.scrollMilestones,
        ahaMomentDamodaran: this.hasReachedAhaMoment,
        readingTimePerCardSeconds: this.cardReadingTimes,
        totalEventsRecorded: this.eventsLog.length
      },
      events: this.eventsLog
    };
  }
}

// Instancia globalmente para fácil acesso nos módulos e no console
window.radarAnalytics = new PrecificacaoAnalytics();
