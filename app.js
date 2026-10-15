/**
 * ==============================================================================
 * BIRTHDAY MISSION CONTROLLER (app.js)
 * Enhanced Edition:
 * - Playful progressive dodging on the choice button with "Excuse me?" & Bubbles dialog
 * - Barbie & Zendaya cinema clues
 * - Lymphatic Drainage Massage & Jacuzzi focus
 * - Interactive coffee spot picker (Koffe Kulture, Starbucks, Daily Dose, Saints)
 * - "Our Little Book of Achievements 🤍" chapter reader & polaroids
 * ==============================================================================
 */

(function() {
  'use strict';

  let currentStage = 1;
  const TOTAL_STAGES = 8;

  let cluesRevealed = { barbie: false, odyssey: false };
  let giftBoxOpened = false;
  let dateConfirmed = false;
  let choiceClickCount = 0;
  let selectedCoffeeSpot = "Koffe Kulture";
  let activeChapterIndex = 0;

  const STAGE_TITLES = [
    "The Secret Mission",
    "A Simple Question",
    "Cinema Memories",
    "Part 1: The Mystery Gift",
    "Part 2: Massage & Jacuzzi",
    "Pick Your Date",
    "The Coffee Spot",
    "Our Little Book of Achievements"
  ];

  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });

  function initApp() {
    renderConfigData();
    initStageNavigation();
    initScreen2Question();
    initScreen3Clues();
    initScreen4GiftBox();
    initScreen6DatePicker();
    initScreen7CoffeePicker();
    initScreen8BookOfAchievements();
    initLightbox();

    // Pre-render Bubbles illustrations for all stages
    for (let i = 1; i <= TOTAL_STAGES; i++) {
      renderBubblesForStage(i);
    }
    updateStageUI(1);
  }

  /* --------------------------------------------------------------------------
     1. Configuration Rendering
     -------------------------------------------------------------------------- */
  function renderConfigData() {
    const cfg = window.BIRTHDAY_CONFIG || {};

    const recipientEls = document.querySelectorAll('.var-recipient-name');
    recipientEls.forEach(el => {
      el.textContent = cfg.recipientName || "Noni";
    });

    const senderEls = document.querySelectorAll('.var-sender-name');
    senderEls.forEach(el => {
      el.textContent = cfg.senderName || "Your Best Friend";
    });

    // Mystery Clues text
    if (cfg.mysteryGift) {
      if (cfg.mysteryGift.barbieClue) {
        const bTag = document.getElementById('barbie-clue-tag');
        const bTitle = document.getElementById('barbie-clue-title');
        const bBody = document.getElementById('barbie-clue-body');
        if (bTag) bTag.textContent = cfg.mysteryGift.barbieClue.tag;
        if (bTitle) bTitle.textContent = cfg.mysteryGift.barbieClue.title;
        if (bBody) bBody.textContent = cfg.mysteryGift.barbieClue.body;
      }
      if (cfg.mysteryGift.odysseyClue) {
        const oTag = document.getElementById('odyssey-clue-tag');
        const oTitle = document.getElementById('odyssey-clue-title');
        const oBody = document.getElementById('odyssey-clue-body');
        if (oTag) oTag.textContent = cfg.mysteryGift.odysseyClue.tag;
        if (oTitle) oTitle.textContent = cfg.mysteryGift.odysseyClue.title;
        if (oBody) oBody.textContent = cfg.mysteryGift.odysseyClue.body;
      }
      if (cfg.mysteryGift.openedBoxLetter) {
        const quoteEl = document.getElementById('mystery-quote-text');
        const subEl = document.getElementById('mystery-sub-text');
        if (quoteEl) quoteEl.textContent = cfg.mysteryGift.openedBoxLetter.quote;
        if (subEl) subEl.textContent = cfg.mysteryGift.openedBoxLetter.subtext;
      }
    }

    // Initialize Calendar with blackout dates
    if (window.SpaCalendar) {
      window.SpaCalendar.init(cfg.unavailableDates || []);
    }
  }

  /* --------------------------------------------------------------------------
     2. Stage Navigation & Progress Indicator
     -------------------------------------------------------------------------- */
  function initStageNavigation() {
    const prevBtn = document.getElementById('btn-prev-stage');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStage > 1) {
          goToStage(currentStage - 1);
        }
      });
    }

    const replayBtn = document.getElementById('btn-replay-mission');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        resetMission();
      });
    }
  }

  function goToStage(stageNum) {
    if (stageNum < 1 || stageNum > TOTAL_STAGES) return;

    if (currentStage === 2 && stageNum > 2 && !window.__screen2Affirmed) {
      handleChoiceClick();
      return;
    }

    const screens = document.querySelectorAll('.stage-screen');
    screens.forEach(s => s.classList.remove('active'));

    currentStage = stageNum;
    updateStageUI(currentStage);

    const targetScreen = document.getElementById(`stage-${currentStage}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      renderBubblesForStage(currentStage);

      const heading = targetScreen.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }

    if (currentStage === 8) {
      launchConfetti();
    }
  }

  function updateStageUI(stageNum) {
    const badgeText = document.getElementById('mission-badge-text');
    if (badgeText) {
      badgeText.textContent = `Stage ${stageNum}/${TOTAL_STAGES}: ${STAGE_TITLES[stageNum - 1]}`;
    }

    const progressFill = document.getElementById('progress-track-fill');
    if (progressFill) {
      const percentage = ((stageNum - 1) / (TOTAL_STAGES - 1)) * 100;
      progressFill.style.width = `${percentage}%`;
    }

    const stepItems = document.querySelectorAll('.progress-step-item');
    stepItems.forEach((item, idx) => {
      const stepIdx = idx + 1;
      item.classList.remove('active', 'completed');
      if (stepIdx === stageNum) {
        item.classList.add('active');
      } else if (stepIdx < stageNum) {
        item.classList.add('completed');
      }
    });

    const prevBtn = document.getElementById('btn-prev-stage');
    if (prevBtn) {
      prevBtn.disabled = (stageNum === 1);
      prevBtn.setAttribute('aria-disabled', String(stageNum === 1));
    }
  }

  function renderBubblesForStage(stageNum, customMood = null) {
    const avatarSlots = [
      'bubbles-avatar-1',
      'bubbles-avatar-2',
      'bubbles-avatar-3',
      'bubbles-avatar-4',
      'bubbles-avatar-5',
      'bubbles-avatar-6',
      'bubbles-avatar-7',
      'bubbles-avatar-8'
    ];

    const slotId = avatarSlots[stageNum - 1];
    if (slotId) {
      const container = document.getElementById(slotId);
      if (container) {
        const isGiggle = (stageNum === 2 && (customMood === 'giggle' || customMood === 'excuse_me'));
        const imgSrc = isGiggle ? 'assets/bubbles_giggle.jpg' : 'assets/bubbles_hero.jpg';
        container.innerHTML = `<img src="${imgSrc}" alt="Bubbles from The Powerpuff Girls" class="bubbles-avatar-img" loading="eager" />`;
      }
    }
  }

  /* --------------------------------------------------------------------------
     3. Screen 1 & 2: Progressive Dodge & Humorous Dialogue
     -------------------------------------------------------------------------- */
  function initScreen2Question() {
    const btnAcceptMission = document.getElementById('btn-accept-mission');
    if (btnAcceptMission) {
      btnAcceptMission.addEventListener('click', () => {
        goToStage(2);
      });
    }

    const btnYes = document.getElementById('btn-screen2-yes');
    const btnChoice = document.getElementById('btn-screen2-choice');

    if (btnYes) {
      btnYes.addEventListener('click', () => {
        window.__screen2Affirmed = true;
        goToStage(3);
      });
    }

    if (btnChoice) {
      btnChoice.addEventListener('click', (e) => {
        e.preventDefault();
        handleChoiceClick();
      });
    }
  }

  function handleChoiceClick() {
    choiceClickCount++;
    const btnChoice = document.getElementById('btn-screen2-choice');
    const callout = document.getElementById('screen2-playful-callout');
    const contentEl = document.getElementById('screen2-callout-text');

    // Remove previous dodge classes
    btnChoice.classList.remove('btn-dodge-1', 'btn-dodge-2', 'btn-dodge-3');

    if (choiceClickCount === 1) {
      btnChoice.classList.add('btn-dodge-1');
      renderBubblesForStage(2, 'excuse_me');
      if (contentEl) {
        contentEl.innerHTML = `<strong>Bubbles says:</strong><br>“Excuse me? Are you saying no?! 🤨”`;
      }
    } else if (choiceClickCount === 2) {
      btnChoice.classList.add('btn-dodge-2');
      renderBubblesForStage(2, 'excuse_me');
      if (contentEl) {
        contentEl.innerHTML = `<strong>Bubbles says:</strong><br>“Wait, really?? You can't escape this mission! 🙈”`;
      }
    } else {
      btnChoice.classList.add('btn-dodge-3');
      renderBubblesForStage(2, 'giggle');
      if (contentEl) {
        contentEl.innerHTML = `<strong>Bubbles says:</strong><br>“Girl, you know you’re going to have to say yes eventually! 😂”`;
      }
    }

    if (callout) {
      callout.classList.add('show');
      callout.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* --------------------------------------------------------------------------
     4. Screen 3: Cinema Clues (Barbie & Zendaya Odyssey)
     -------------------------------------------------------------------------- */
  function initScreen3Clues() {
    const barbieCard = document.getElementById('clue-card-barbie');
    const odysseyCard = document.getElementById('clue-card-odyssey');
    const btnToGift = document.getElementById('btn-to-gift-box');

    if (barbieCard) {
      barbieCard.addEventListener('click', () => {
        barbieCard.classList.toggle('revealed');
        cluesRevealed.barbie = true;
      });
      barbieCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          barbieCard.click();
        }
      });
    }

    if (odysseyCard) {
      odysseyCard.addEventListener('click', () => {
        odysseyCard.classList.toggle('revealed');
        cluesRevealed.odyssey = true;
      });
      odysseyCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          odysseyCard.click();
        }
      });
    }

    if (btnToGift) {
      btnToGift.addEventListener('click', () => {
        goToStage(4);
      });
    }
  }

  /* --------------------------------------------------------------------------
     5. Screen 4: Mystery Gift Box
     -------------------------------------------------------------------------- */
  function initScreen4GiftBox() {
    const giftBox = document.getElementById('interactive-gift-box');
    const letterCard = document.getElementById('mystery-letter-card');
    const btnToSpa = document.getElementById('btn-to-spa-reveal');

    if (giftBox) {
      const toggleOpen = () => {
        giftBoxOpened = !giftBoxOpened;
        if (giftBoxOpened) {
          giftBox.classList.add('opened');
          giftBox.setAttribute('aria-expanded', 'true');
          if (letterCard) letterCard.classList.add('visible');
        } else {
          giftBox.classList.remove('opened');
          giftBox.setAttribute('aria-expanded', 'false');
          if (letterCard) letterCard.classList.remove('visible');
        }
      };

      giftBox.addEventListener('click', toggleOpen);
      giftBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleOpen();
        }
      });
    }

    if (btnToSpa) {
      btnToSpa.addEventListener('click', () => {
        goToStage(5);
      });
    }

    const btnToCalendar = document.getElementById('btn-to-calendar');
    if (btnToCalendar) {
      btnToCalendar.addEventListener('click', () => {
        goToStage(6);
      });
    }
  }

  /* --------------------------------------------------------------------------
     6. Screen 6: Date Picker & WhatsApp Sharing
     -------------------------------------------------------------------------- */
  function initScreen6DatePicker() {
    const btnConfirmDate = document.getElementById('btn-confirm-date');
    const dateError = document.getElementById('date-validation-error');
    const dateConfirmedPanel = document.getElementById('date-confirmed-panel');
    const selectedDateLabel = document.getElementById('confirmed-date-display');
    const btnToCoffee = document.getElementById('btn-to-coffee-stage');

    if (btnConfirmDate) {
      btnConfirmDate.addEventListener('click', () => {
        const selected = window.SpaCalendar ? window.SpaCalendar.getSelectedDate() : null;

        if (!selected) {
          if (dateError) {
            dateError.classList.add('show');
            dateError.textContent = "Please pick a preferred date on the calendar first! 📅";
          }
          return;
        }

        if (dateError) dateError.classList.remove('show');
        dateConfirmed = true;

        const formatted = window.SpaCalendar.getFormattedSelectedDate();
        if (selectedDateLabel) {
          selectedDateLabel.textContent = formatted;
        }

        if (dateConfirmedPanel) {
          dateConfirmedPanel.style.display = 'block';
          dateConfirmedPanel.scrollIntoView({ behavior: 'smooth' });
        }
        btnConfirmDate.style.display = 'none';

        updateWhatsAppLink();
      });
    }

    const btnChangeDate = document.getElementById('btn-change-date');
    if (btnChangeDate) {
      btnChangeDate.addEventListener('click', () => {
        if (dateConfirmedPanel) dateConfirmedPanel.style.display = 'none';
        if (btnConfirmDate) btnConfirmDate.style.display = 'inline-flex';
        dateConfirmed = false;
      });
    }

    if (btnToCoffee) {
      btnToCoffee.addEventListener('click', () => {
        goToStage(7);
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. Screen 7: Interactive Coffee Spot Picker
     -------------------------------------------------------------------------- */
  function initScreen7CoffeePicker() {
    const container = document.getElementById('coffee-spots-container');
    const btnToScrapbook = document.getElementById('btn-to-scrapbook');
    const cfg = window.BIRTHDAY_CONFIG || {};
    const spots = cfg.coffeeSpots || [
      { id: "koffe-kulture", name: "Koffe Kulture", icon: "☕", vibe: "Aesthetic brew & deep talks" },
      { id: "starbucks", name: "Starbucks", icon: "🧜‍♀️", vibe: "Classic iced favourites" },
      { id: "daily-dose", name: "Daily Dose", icon: "✨", vibe: "Good vibes & specialty coffee" },
      { id: "saints", name: "Saints", icon: "🥐", vibe: "Cozy chats & artisanal treats" }
    ];

    if (container) {
      container.innerHTML = '';
      spots.forEach((spot, idx) => {
        const card = document.createElement('div');
        card.className = `coffee-spot-card ${idx === 0 ? 'selected' : ''}`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('data-name', spot.name);

        card.innerHTML = `
          <div class="coffee-check-badge" aria-hidden="true">✓</div>
          <div class="coffee-spot-header">
            <span class="coffee-spot-name">${escapeHTML(spot.name)}</span>
            <span class="coffee-spot-icon" aria-hidden="true">${spot.icon || '☕'}</span>
          </div>
          <div class="coffee-spot-vibe">${escapeHTML(spot.vibe || '')}</div>
        `;

        const selectThis = () => {
          document.querySelectorAll('.coffee-spot-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedCoffeeSpot = spot.name;
          updateWhatsAppLink();
        };

        card.addEventListener('click', selectThis);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectThis();
          }
        });

        container.appendChild(card);
      });
    }

    if (btnToScrapbook) {
      btnToScrapbook.addEventListener('click', () => {
        goToStage(8);
      });
    }
  }

  function updateWhatsAppLink() {
    const btnWhatsApp = document.getElementById('btn-send-whatsapp');
    const statusNote = document.getElementById('whatsapp-status-note');
    if (!btnWhatsApp) return;

    const cfg = window.BIRTHDAY_CONFIG || {};
    const recipientNum = (cfg.whatsappNumber || '').replace(/[^0-9]/g, '');
    const dateFormatted = window.SpaCalendar ? window.SpaCalendar.getFormattedSelectedDate() : "a relaxing day";

    const message = encodeURIComponent(
      `Hey! 💙 I've completed my birthday mission! My preferred massage & jacuzzi day is ${dateFormatted}. And for our coffee reunion, I chose ${selectedCoffeeSpot}! ☕✨ Can't wait!`
    );

    if (recipientNum) {
      btnWhatsApp.href = `https://wa.me/${recipientNum}?text=${message}`;
      btnWhatsApp.target = "_blank";
      btnWhatsApp.rel = "noopener noreferrer";
      btnWhatsApp.style.display = 'inline-flex';
      if (statusNote) {
        statusNote.textContent = "Tap above to share your preferred date & coffee spot with me on WhatsApp!";
      }
    } else {
      btnWhatsApp.href = `https://wa.me/?text=${message}`;
      btnWhatsApp.target = "_blank";
      btnWhatsApp.rel = "noopener noreferrer";
      btnWhatsApp.style.display = 'inline-flex';
      if (statusNote) {
        statusNote.textContent = "(WhatsApp phone number unset in config.js — this will open WhatsApp so you can choose who to send it to!)";
      }
    }
  }

  /* --------------------------------------------------------------------------
     8. Screen 8: "Our Little Book of Achievements 🤍"
     -------------------------------------------------------------------------- */
  function initLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImg = document.getElementById('photo-lightbox-img');
    if (!lightbox || !lightboxImg) return;

    document.addEventListener('click', (e) => {
      const img = e.target.closest('.polaroid-img');
      if (img && img.src) {
        lightboxImg.src = img.src;
        lightbox.classList.add('show');
      } else if (e.target.closest('.photo-lightbox')) {
        lightbox.classList.remove('show');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        lightbox.classList.remove('show');
      }
    });
  }

  function initScreen8BookOfAchievements() {
    renderBookChapters();
  }

  function renderBookChapters() {
    const scroller = document.getElementById('chapter-nav-scroller');
    const contentContainer = document.getElementById('chapter-content-page');
    const prevBtn = document.getElementById('btn-chapter-prev');
    const nextBtn = document.getElementById('btn-chapter-next');

    const cfg = window.BIRTHDAY_CONFIG || {};
    const chapters = Array.isArray(cfg.bookChapters) ? cfg.bookChapters : [];

    if (!scroller || !contentContainer || chapters.length === 0) return;

    scroller.innerHTML = '';
    chapters.forEach((ch, idx) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `chapter-pill-btn ${idx === activeChapterIndex ? 'active' : ''}`;
      pill.innerHTML = `<span>Ch. ${ch.chapterNumber}</span>`;
      pill.setAttribute('aria-label', `Chapter ${ch.chapterNumber}: ${ch.title}`);

      pill.addEventListener('click', () => {
        activeChapterIndex = idx;
        renderActiveChapter();
        launchConfetti(); // Confetti popper on opening each chapter!
      });

      scroller.appendChild(pill);
    });

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (activeChapterIndex > 0) {
          activeChapterIndex--;
          renderActiveChapter();
          launchConfetti(); // Confetti on navigation
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (activeChapterIndex < chapters.length - 1) {
          activeChapterIndex++;
          renderActiveChapter();
          launchConfetti(); // Confetti on navigation
        }
      };
    }

    renderActiveChapter();
  }

  function renderActiveChapter() {
    const scroller = document.getElementById('chapter-nav-scroller');
    const contentContainer = document.getElementById('chapter-content-page');
    const prevBtn = document.getElementById('btn-chapter-prev');
    const nextBtn = document.getElementById('btn-chapter-next');

    const cfg = window.BIRTHDAY_CONFIG || {};
    const chapters = cfg.bookChapters || [];
    const ch = chapters[activeChapterIndex];

    if (!ch || !contentContainer) return;

    if (scroller) {
      const pills = scroller.querySelectorAll('.chapter-pill-btn');
      pills.forEach((p, idx) => {
        if (idx === activeChapterIndex) {
          p.classList.add('active');
          p.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
          p.classList.remove('active');
        }
      });
    }

    if (prevBtn) prevBtn.disabled = (activeChapterIndex === 0);
    if (nextBtn) nextBtn.disabled = (activeChapterIndex === chapters.length - 1);

    const paragraphsHTML = (ch.paragraphs || []).map(p => `<p>${escapeHTML(p)}</p>`).join('');

    contentContainer.innerHTML = `
      <div class="chapter-badge-tag">${escapeHTML(ch.badge || 'ACHIEVEMENT')}</div>
      <h3 class="chapter-title">Chapter ${ch.chapterNumber}: ${escapeHTML(ch.title)}</h3>

      ${ch.image ? `
        <div class="chapter-polaroid-wrap">
          <div class="polaroid-frame" style="max-width: ${ch.orientation === 'landscape' ? '320px' : '280px'}; width: 100%;">
            <div class="polaroid-tape" aria-hidden="true"></div>
            <div class="polaroid-photo-container ${ch.orientation === 'landscape' ? 'landscape' : 'portrait'}">
              <img src="${escapeHTML(ch.image)}" alt="${escapeHTML(ch.polaroidCaption || ch.title)}" class="polaroid-img" onerror="this.onerror=null; this.parentElement.innerHTML = getFallbackIllustration('${activeChapterIndex}');">
            </div>
            <p class="polaroid-caption">${escapeHTML(ch.polaroidCaption || '')}</p>
          </div>
        </div>
      ` : ''}

      ${ch.cuteNote ? `<div class="chapter-cute-note">${escapeHTML(ch.cuteNote)}</div>` : ''}

      ${ch.loveQuote ? `
        <div class="chapter-love-quote">
          <span>${escapeHTML(ch.loveQuote)}</span>
        </div>
      ` : ''}

      <div class="chapter-cute-divider" aria-hidden="true">♡ • ──────── ୨୧ ──────── • ♡</div>

      <div class="chapter-body-text">
        ${paragraphsHTML}
      </div>
    `;
  }

  window.getFallbackIllustration = function(index) {
    const icons = ['🎬🍿', '☕✨', '🌸🌊', '🎉🩵', '📸💫'];
    const titles = ['Cinema Memories', 'Coffee Dates', 'Unstoppable Duo', 'Adventures', 'Best Friends'];
    const chosenIcon = icons[index % icons.length];
    const chosenTitle = titles[index % titles.length];

    return `
      <div class="polaroid-fallback-art">
        <span style="font-size: 2.5rem; margin-bottom: 0.5rem;" aria-hidden="true">${chosenIcon}</span>
        <strong style="font-size: 0.95rem; color: #103657;">${chosenTitle}</strong>
      </div>
    `;
  };

  /* --------------------------------------------------------------------------
     9. Reset Mission
     -------------------------------------------------------------------------- */
  function resetMission() {
    window.__screen2Affirmed = false;
    giftBoxOpened = false;
    dateConfirmed = false;
    choiceClickCount = 0;
    cluesRevealed = { barbie: false, odyssey: false };

    const btnChoice = document.getElementById('btn-screen2-choice');
    if (btnChoice) btnChoice.classList.remove('btn-dodge-1', 'btn-dodge-2', 'btn-dodge-3');

    document.querySelectorAll('.clue-card').forEach(c => c.classList.remove('revealed'));

    const giftBox = document.getElementById('interactive-gift-box');
    if (giftBox) giftBox.classList.remove('opened');
    const letterCard = document.getElementById('mystery-letter-card');
    if (letterCard) letterCard.classList.remove('visible');

    const callout = document.getElementById('screen2-playful-callout');
    if (callout) callout.classList.remove('show');

    const dateConfirmedPanel = document.getElementById('date-confirmed-panel');
    if (dateConfirmedPanel) dateConfirmedPanel.style.display = 'none';
    const btnConfirmDate = document.getElementById('btn-confirm-date');
    if (btnConfirmDate) btnConfirmDate.style.display = 'inline-flex';

    activeChapterIndex = 0;
    renderActiveChapter();

    goToStage(1);
  }

  /* --------------------------------------------------------------------------
     10. Confetti Celebration
     -------------------------------------------------------------------------- */
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const colors = ['#91D5F5', '#F6B7D2', '#F5E5C7', '#103657', '#FFFFFF', '#58B4E6'];
    const particles = [];
    const count = 70;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height,
        r: Math.random() * 6 + 3,
        d: Math.random() * count,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0
      });
    }

    let frames = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      frames++;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(0.01 * frames);
        p.tilt = Math.sin(p.tiltAngle) * 12;

        ctx.beginPath();
        ctx.lineWidth = p.r / 1.5;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      }

      if (frames < 220) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    draw();
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.goToStage = goToStage;
})();
