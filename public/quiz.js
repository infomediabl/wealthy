(function () {
  'use strict';

  // ===== STATE =====
  let currentStep = 1;
  let recordId = null;
  let userEmail = '';

  const answers = {
    goal: null,
    amount: null,
    duration: null,
    source_of_funds: null,
    personal_status: null,
    monthly_income: null,
    credit_obligations: null,
    investment_knowledge: null,
    investment_experience: null,
    risk_percentage: null,
    acceptable_drop: null,
  };

  // Step → progress bar mapping (which progress step each screen represents)
  // Step 1 = no progress, Steps 2–6 = 1–5, Step 7 = break, Steps 8–12 = 6–10, Step 13 = 11, Step 14 = 12
  const stepToProgress = {
    1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5,
    7: 5, // frozen at 5
    8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: 12,
  };

  const totalProgressSteps = 12;

  // ===== DOM REFS =====
  const progressTrack = document.getElementById('progressBarTrack');
  const progressFill = document.getElementById('progressBarFill');
  const stepCounter = document.getElementById('stepCounter');

  // ===== NAVIGATION =====
  const stepAnnouncer = document.getElementById('stepAnnouncer');

  function goToStep(newStep) {
    const currentEl = document.getElementById(`step-${currentStep}`);
    const nextEl = document.getElementById(`step-${newStep}`);
    if (!currentEl || !nextEl) return;

    // Animate out
    currentEl.classList.add('exiting');
    setTimeout(() => {
      currentEl.classList.remove('active', 'exiting');
      nextEl.classList.add('active');
      currentStep = newStep;
      updateProgressBar();
      window.scrollTo(0, 0);

      // Focus management: move focus to first heading or input in new step
      const focusTarget = nextEl.querySelector('h1, h2, .input-field, .btn-primary');
      if (focusTarget) {
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
      }

      // Announce step change to screen readers
      const prog = stepToProgress[newStep] || 0;
      if (prog > 0) {
        stepAnnouncer.textContent = `Korak ${prog} od ${totalProgressSteps}`;
      }
    }, 250);
  }

  function updateProgressBar() {
    const prog = stepToProgress[currentStep] || 0;

    if (prog === 0) {
      progressTrack.classList.remove('visible');
      stepCounter.textContent = '';
      progressTrack.setAttribute('aria-valuenow', '0');
    } else {
      progressTrack.classList.add('visible');
      progressFill.style.width = `${(prog / totalProgressSteps) * 100}%`;
      stepCounter.textContent = `Korak ${prog} od ${totalProgressSteps}`;
      progressTrack.setAttribute('aria-valuenow', String(prog));
    }
  }

  // ===== OPTION SELECTION =====
  function setupOptionGroups() {
    // List-style and pill-style options
    document.querySelectorAll('.options-list, .options-grid').forEach((group) => {
      const questionKey = group.dataset.question;
      const buttons = group.querySelectorAll('.option-btn, .option-pill, .icon-option');

      // Accessibility: mark group as radiogroup
      group.setAttribute('role', 'radiogroup');

      buttons.forEach((btn) => {
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');

        btn.addEventListener('click', () => {
          // Deselect siblings
          buttons.forEach((b) => {
            b.classList.remove('selected');
            b.setAttribute('aria-checked', 'false');
          });
          // Select this
          btn.classList.add('selected');
          btn.setAttribute('aria-checked', 'true');

          // Store answer
          answers[questionKey] = btn.dataset.value;

          // Enable continue button for this step
          enableContinueForCurrentStep();
        });
      });
    });
  }

  function enableContinueForCurrentStep() {
    // For Step 12, both questions must be answered
    if (currentStep === 12) {
      const btn = document.getElementById('next-12');
      btn.disabled = !(answers.risk_percentage && answers.acceptable_drop);
      return;
    }

    // For other steps, find the continue button
    const nextBtn = document.getElementById(`next-${currentStep}`);
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  // ===== EMAIL VALIDATION & SUBMIT (Step 1) =====
  function setupEmailStep() {
    const emailInput = document.getElementById('emailInput');
    const emailError = document.getElementById('emailError');
    const emailSubmit = document.getElementById('emailSubmit');

    emailInput.addEventListener('input', () => {
      emailError.textContent = '';
      emailInput.classList.remove('error');
      emailInput.removeAttribute('aria-invalid');
    });

    emailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        emailSubmit.click();
      }
    });

    emailSubmit.addEventListener('click', async () => {
      const email = emailInput.value.trim();

      // Validate
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        emailError.textContent = 'Molimo unesite ispravnu e-mail adresu.';
        emailInput.classList.add('error');
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        return;
      }

      userEmail = email;
      emailSubmit.classList.add('loading');
      emailSubmit.disabled = true;

      try {
        const res = await fetch('/api/lead/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.recordId) {
          recordId = data.recordId;
        }
      } catch (err) {
        console.error('Email API error:', err);
        // Don't block — continue even if API fails
      }

      emailSubmit.classList.remove('loading');
      emailSubmit.disabled = false;
      goToStep(2);
    });
  }

  // ===== AMOUNT INPUT (Step 3) =====
  function setupAmountStep() {
    const amountInput = document.getElementById('amountInput');
    const nextBtn = document.getElementById('next-3');

    amountInput.addEventListener('input', () => {
      const val = amountInput.value.trim();
      answers.amount = val || null;
      nextBtn.disabled = !val;
    });

    amountInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !nextBtn.disabled) {
        e.preventDefault();
        nextBtn.click();
      }
    });
  }

  // ===== PROFILE FORM (Step 13) =====
  function setupProfileForm() {
    const form = document.getElementById('profileForm');
    const nameInput = document.getElementById('nameInput');
    const dobInput = document.getElementById('dobInput');
    const cityInput = document.getElementById('cityInput');
    const phoneInput = document.getElementById('phoneInput');
    const submitBtn = document.getElementById('profileSubmit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate
      let valid = true;

      if (!nameInput.value.trim()) {
        document.getElementById('nameError').textContent = 'Polje je obavezno.';
        nameInput.classList.add('error');
        nameInput.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        document.getElementById('nameError').textContent = '';
        nameInput.classList.remove('error');
        nameInput.removeAttribute('aria-invalid');
      }

      if (!dobInput.value) {
        document.getElementById('dobError').textContent = 'Polje je obavezno.';
        dobInput.classList.add('error');
        dobInput.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        document.getElementById('dobError').textContent = '';
        dobInput.classList.remove('error');
        dobInput.removeAttribute('aria-invalid');
      }

      if (!cityInput.value.trim()) {
        document.getElementById('cityError').textContent = 'Polje je obavezno.';
        cityInput.classList.add('error');
        cityInput.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        document.getElementById('cityError').textContent = '';
        cityInput.classList.remove('error');
        cityInput.removeAttribute('aria-invalid');
      }

      if (!valid) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Compute score & profile
      const score = computeScore(answers);
      const profile = getProfile(score);

      // 1) POST quiz answers + score
      try {
        await fetch('/api/lead/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recordId,
            goal: answers.goal,
            amount: answers.amount,
            duration: answers.duration,
            source_of_funds: answers.source_of_funds,
            personal_status: answers.personal_status,
            monthly_income: answers.monthly_income,
            credit_obligations: answers.credit_obligations,
            investment_knowledge: answers.investment_knowledge,
            investment_experience: answers.investment_experience,
            risk_percentage: answers.risk_percentage,
            acceptable_drop: answers.acceptable_drop,
            risk_score: score,
            risk_profile: profile.name,
          }),
        });
      } catch (err) {
        console.error('Quiz API error:', err);
      }

      // 2) POST personal info + trigger email
      try {
        await fetch('/api/lead/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recordId,
            email: userEmail,
            first_name: nameInput.value.trim(),
            date_of_birth: dobInput.value,
            city: cityInput.value.trim(),
            phone: phoneInput.value.trim() || null,
            profileName: profile.name,
            profileDescription: profile.description,
            stockPct: profile.stockPct,
            bondPct: profile.bondPct,
          }),
        });
      } catch (err) {
        console.error('Profile API error:', err);
      }

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Populate result page
      populateResultPage(profile);
      goToStep(14);
    });

    // Clear errors on input
    [nameInput, dobInput, cityInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
        const errorEl = input.parentElement.querySelector('.input-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  // ===== SCORING ENGINE =====
  function computeScore(ans) {
    const durationMap = {
      '1 godina': 1, '2 godine': 2, '5 godina': 3,
      '10 godina': 4, '20 godina': 5, '25 godina': 5,
    };
    const incomeMap = {
      'Ispod 700,00 KM': 1, '700,00 – 1.500,00 KM': 2,
      '1.500,00 – 2.000,00 KM': 3, '2.000,00 – 3.000,00 KM': 4,
      'Iznad 3.000,00 KM': 5,
    };
    const creditMap = {
      'Nemam kreditne obveze': 5,
      'Mjesečna obveza je zanemariva u odnosu na primanja': 4,
      'Mjesečna obveza iznosi oko trećine primanja': 3,
      'Mjesečna obveza iznosi oko polovice primanja': 2,
      'Mjesečna obveza je veća od polovice primanja': 1,
    };
    const knowledgeMap = {
      'Izvrsno': 5, 'Vrlo dobro': 4, 'Dobro': 3, 'Površno': 2, 'Ne poznajem': 1,
    };
    const experienceMap = {
      'Svakodnevno': 5, 'Jednom mjesečno': 4, 'Nekoliko puta godišnje': 3,
      'Jednom godišnje ili rjeđe': 2, 'Nemam nikakvo iskustvo': 1,
    };
    const riskPctMap = {
      '80 – 100%': 5, '60 – 80%': 4, '40 – 60%': 3, '20 – 40%': 2, '0 – 20%': 1,
    };
    const dropMap = {
      'Do 40%': 5, 'Do 30%': 4, 'Do 20%': 3, 'Do 10%': 2, 'Do 5%': 1,
    };

    return (
      (durationMap[ans.duration] || 0) +
      (incomeMap[ans.monthly_income] || 0) +
      (creditMap[ans.credit_obligations] || 0) +
      (knowledgeMap[ans.investment_knowledge] || 0) +
      (experienceMap[ans.investment_experience] || 0) +
      (riskPctMap[ans.risk_percentage] || 0) +
      (dropMap[ans.acceptable_drop] || 0)
    );
  }

  function getProfile(score) {
    const profiles = {
      konzervativni: {
        name: 'Konzervativni ulagač',
        tagline: 'Sigurnost iznad svega',
        description: 'Preferirate sigurnost i stabilnost kapitala. Imate nizak apetit prema riziku i kratkoročne ili nepredvidive potrebe za sredstvima. Vaš portfolio je fokusiran na očuvanje vrijednosti uz skromne, ali stabilne prinose.',
        stockPct: 20,
        bondPct: 80,
      },
      'umjereno-konzervativni': {
        name: 'Umjereno konzervativni ulagač',
        tagline: 'Stabilnost s blagim rastom',
        description: 'Cijenite sigurnost, ali ste spremni prihvatiti umjereni rizik za nešto bolje prinose. Preferirate stabilnost, ali razumijete da određena izloženost dionicama može poboljšati dugoročne rezultate.',
        stockPct: 40,
        bondPct: 60,
      },
      uravnotezeni: {
        name: 'Uravnoteženi ulagač',
        tagline: 'Balans između rasta i sigurnosti',
        description: 'Tražite ravnotežu između rasta i zaštite kapitala. Prihvatate umjerene tržišne oscilacije i razumijete da kratkoročni padovi mogu biti dio dugoročnog rasta. Vaš horizont ulaganja vam daje prostor za oporavak.',
        stockPct: 50,
        bondPct: 50,
      },
      'umjereno-agresivni': {
        name: 'Umjereno agresivni ulagač',
        tagline: 'Rast kao prioritet',
        description: 'Fokusirani ste na dugoročni rast kapitala i spremni ste podnijeti značajnije tržišne oscilacije. Imate dobro razumijevanje tržišta i dovoljno dugačak vremenski horizont da prebrodite eventualne padove.',
        stockPct: 70,
        bondPct: 30,
      },
      agresivni: {
        name: 'Agresivni ulagač',
        tagline: 'Maksimalni rast, visoki rizik',
        description: 'Cilj vam je maksimizacija dugoročnog rasta kapitala. Imate visoku toleranciju na rizik, dobro poznajete tržište i prihvatate da vrijednost portfelja može privremeno značajno pasti. Investirate s jasnim dugoročnim fokusom.',
        stockPct: 90,
        bondPct: 10,
      },
    };

    let key;
    if (score <= 13) key = 'konzervativni';
    else if (score <= 19) key = 'umjereno-konzervativni';
    else if (score <= 25) key = 'uravnotezeni';
    else if (score <= 30) key = 'umjereno-agresivni';
    else key = 'agresivni';

    return profiles[key];
  }

  // ===== RESULT PAGE =====
  function populateResultPage(profile) {
    document.getElementById('resultProfileName').textContent = profile.name;
    document.getElementById('resultTagline').textContent = profile.tagline;
    document.getElementById('resultStockPct').textContent = `${profile.stockPct}%`;
    document.getElementById('resultBondPct').textContent = `${profile.bondPct}%`;
    document.getElementById('resultDescription').textContent = profile.description;

    drawDonutChart(profile.stockPct, profile.bondPct);
  }

  // ===== DONUT CHART (Canvas) =====
  function drawDonutChart(stockPct, bondPct) {
    const canvas = document.getElementById('donutChart');
    canvas.setAttribute('aria-label', `Alokacija portfelja: ${stockPct}% dionice, ${bondPct}% obveznice i fondovi`);
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // HiDPI support
    canvas.width = 200 * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = '200px';
    canvas.style.height = '200px';
    ctx.scale(dpr, dpr);

    const cx = 100;
    const cy = 100;
    const outerR = 90;
    const innerR = 60;
    const gap = 0.03; // small gap in radians between segments
    const startAngle = -Math.PI / 2;

    // Calculate angles
    const stockAngle = (stockPct / 100) * Math.PI * 2;
    const bondAngle = (bondPct / 100) * Math.PI * 2;

    // Draw stock segment (gold)
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle + gap / 2, startAngle + stockAngle - gap / 2);
    ctx.arc(cx, cy, innerR, startAngle + stockAngle - gap / 2, startAngle + gap / 2, true);
    ctx.closePath();
    ctx.fillStyle = '#EE7B2B';
    ctx.fill();

    // Draw bond segment (blue)
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle + stockAngle + gap / 2, startAngle + stockAngle + bondAngle - gap / 2);
    ctx.arc(cx, cy, innerR, startAngle + stockAngle + bondAngle - gap / 2, startAngle + stockAngle + gap / 2, true);
    ctx.closePath();
    ctx.fillStyle = '#3a7bd5';
    ctx.fill();

    // Center text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0e0e0e';
    ctx.font = `700 ${28}px Inter, sans-serif`;
    ctx.fillText(`${stockPct}/${bondPct}`, cx, cy);
  }

  // ===== CONTINUE BUTTONS =====
  function setupContinueButtons() {
    // Steps with simple continue (option-based)
    const optionSteps = [2, 4, 5, 6, 8, 9, 10, 11, 12];
    optionSteps.forEach((step) => {
      const btn = document.getElementById(`next-${step}`);
      if (btn) {
        btn.addEventListener('click', () => {
          goToStep(step + 1);
        });
      }
    });

    // Step 3 (amount — text input)
    const next3 = document.getElementById('next-3');
    if (next3) {
      next3.addEventListener('click', () => goToStep(4));
    }

    // Step 7 (halfway — always enabled)
    const next7 = document.getElementById('next-7');
    if (next7) {
      next7.addEventListener('click', () => goToStep(8));
    }
  }

  // ===== BACK BUTTONS =====
  function setupBackButtons() {
    const backMap = {
      2: 1, 3: 2, 4: 3, 5: 4, 6: 5,
      // no back on step 7
      8: 7, 9: 8, 10: 9, 11: 10, 12: 11, 13: 12,
    };

    Object.entries(backMap).forEach(([from, to]) => {
      const btn = document.getElementById(`back-${from}`);
      if (btn) {
        btn.addEventListener('click', () => {
          goToStep(parseInt(to));
        });
      }
    });
  }

  // ===== RE-SELECT STATE ON BACK =====
  // When going back, re-highlight previously selected options
  function restoreSelections() {
    Object.entries(answers).forEach(([key, value]) => {
      if (!value) return;
      const group = document.querySelector(`[data-question="${key}"]`);
      if (!group) return;
      const buttons = group.querySelectorAll('.option-btn, .option-pill, .icon-option');
      buttons.forEach((btn) => {
        if (btn.dataset.value === value) {
          btn.classList.add('selected');
          btn.setAttribute('aria-checked', 'true');
        }
      });
    });
  }

  // ===== INIT =====
  function init() {
    updateProgressBar();
    setupOptionGroups();
    setupEmailStep();
    setupAmountStep();
    setupContinueButtons();
    setupBackButtons();
    setupProfileForm();
    restoreSelections();
  }

  // Run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
