/**
 * JANNA — THE WORLD I MADE FOR YOU
 * Cinematic Interactive Engine, Living Quadruped Cat Rig & Plum Rain System
 */

(function () {
  'use strict';

  // ===================================================================
  // 1. WEB AUDIO API SYNTHESIZER
  // ===================================================================
  class CinemaAudioEngine {
    constructor() {
      this.ctx = null;
      this.isSynthPlaying = false;
      this.bgTimer = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playChime(freq = 523.25, type = 'sine') {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      } catch (e) {
        console.warn('Audio play error', e);
      }
    }

    playShatterSound() {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [1800, 2400, 3200, 4100].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + idx * 0.03 + 0.4);

          gain.gain.setValueAtTime(0.06, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.45);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + idx * 0.03 + 0.5);
        });
      } catch (e) {
        console.warn('Shatter audio error', e);
      }
    }

    playMeow() {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const startFreq = 340 + Math.random() * 50;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.linearRampToValueAtTime(startFreq * 1.6, now + 0.16);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.85, now + 0.46);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.13, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
      } catch (e) {
        console.warn('Meow audio error', e);
      }
    }

    playDramaticChord() {
      if (!this.ctx) return;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChime(freq, 'sine');
        }, idx * 110);
      });
    }

    startAmbientChords() {
      if (!this.ctx || this.isSynthPlaying) return;
      this.isSynthPlaying = true;
      const chords = [
        [261.63, 329.63, 392.00, 493.88],
        [220.00, 261.63, 329.63, 392.00],
        [174.61, 220.00, 261.63, 329.63],
        [196.00, 246.94, 293.66, 392.00]
      ];
      let step = 0;

      const playChord = () => {
        if (!this.isSynthPlaying) return;
        const chord = chords[step % chords.length];
        step++;
        const now = this.ctx.currentTime;

        chord.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.026, now + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 3.9);
        });

        this.bgTimer = setTimeout(playChord, 3800);
      };

      playChord();
    }

    stopAmbientChords() {
      this.isSynthPlaying = false;
      if (this.bgTimer) clearTimeout(this.bgTimer);
    }
  }

  const audio = new CinemaAudioEngine();

  // ===================================================================
  // 2. PLUM BLOSSOM RAIN & NEON COSMOS ENGINE (مطر أزهار البرقوق والنجوم)
  // ===================================================================
  const plumCanvas = document.getElementById('plumRainCanvas');
  const pCtx = plumCanvas.getContext('2d');
  let plumW, plumH;
  let plumBlossoms = [];
  const PLUM_COUNT = 45;

  class PlumBlossomParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * plumW;
      this.y = initial ? Math.random() * plumH : -30;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8 + 0.2;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.035;
      this.oscillation = Math.random() * Math.PI * 2;
      this.alpha = Math.random() * 0.6 + 0.35;
      this.isWholeFlower = Math.random() > 0.45;
    }

    update() {
      this.y += this.speedY;
      this.oscillation += 0.02;
      this.x += Math.sin(this.oscillation) * 0.8 + this.speedX;
      this.rot += this.rotSpeed;

      if (this.y > plumH + 40 || this.x > plumW + 40 || this.x < -40) {
        this.reset();
      }
    }

    draw() {
      pCtx.save();
      pCtx.translate(this.x, this.y);
      pCtx.rotate(this.rot);
      pCtx.globalAlpha = this.alpha;

      if (this.isWholeFlower) {
        // Draw 5-petal plum blossom
        pCtx.shadowBlur = 10;
        pCtx.shadowColor = '#ff2a51';
        for (let i = 0; i < 5; i++) {
          pCtx.save();
          pCtx.rotate((i * Math.PI * 2) / 5);
          pCtx.beginPath();
          pCtx.ellipse(0, -this.size * 0.55, this.size * 0.35, this.size * 0.55, 0, 0, Math.PI * 2);
          pCtx.fillStyle = '#ff7597';
          pCtx.fill();
          pCtx.restore();
        }
        // Core
        pCtx.beginPath();
        pCtx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
        pCtx.fillStyle = '#bd0f2d';
        pCtx.fill();
        pCtx.beginPath();
        pCtx.arc(0, 0, this.size * 0.1, 0, Math.PI * 2);
        pCtx.fillStyle = '#ffd166';
        pCtx.fill();
      } else {
        // Draw single delicate petal
        pCtx.shadowBlur = 8;
        pCtx.shadowColor = '#ff7597';
        pCtx.beginPath();
        pCtx.ellipse(0, 0, this.size * 0.4, this.size * 0.65, 0, 0, Math.PI * 2);
        pCtx.fillStyle = '#ff9ebb';
        pCtx.fill();
      }

      pCtx.restore();
    }
  }

  function resizePlumCanvas() {
    plumW = plumCanvas.width = window.innerWidth;
    plumH = plumCanvas.height = window.innerHeight;
  }

  function initPlumRain() {
    resizePlumCanvas();
    plumBlossoms = [];
    for (let i = 0; i < PLUM_COUNT; i++) {
      plumBlossoms.push(new PlumBlossomParticle());
    }
  }

  function renderPlumRain() {
    pCtx.clearRect(0, 0, plumW, plumH);
    for (let i = 0; i < plumBlossoms.length; i++) {
      plumBlossoms[i].update();
      plumBlossoms[i].draw();
    }
    requestAnimationFrame(renderPlumRain);
  }

  window.addEventListener('resize', resizePlumCanvas);
  initPlumRain();
  renderPlumRain();

  // ===================================================================
  // 3. BACKGROUND CANVAS PARTICLES & STARLIGHT SYSTEM
  // ===================================================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 45;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2 + 0.6;
      this.speedY = -(Math.random() * 0.4 + 0.12);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.color = Math.random() > 0.4 ? 'rgba(230, 25, 60, ' : 'rgba(255, 117, 151, ';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.005;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${Math.max(0.1, Math.min(0.85, this.alpha))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff2a51';
      ctx.fill();
      ctx.restore();
    }
  }

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initParticles() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(renderParticles);
  }

  window.addEventListener('resize', resizeCanvas);
  initParticles();
  renderParticles();

  function triggerParticleBurst(originX, originY) {
    for (let i = 0; i < 40; i++) {
      const p = new Particle();
      p.x = originX;
      p.y = originY;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      p.speedX = Math.cos(angle) * speed;
      p.speedY = Math.sin(angle) * speed;
      p.size = Math.random() * 3 + 1;
      particles.push(p);
    }
  }

  // ===================================================================
  // 4. GLASS SHATTER CANAVS ANIMATION
  // ===================================================================
  const shatterCanvas = document.getElementById('shatterCanvas');
  const sCtx = shatterCanvas.getContext('2d');

  function triggerGlassShatter(centerX, centerY) {
    shatterCanvas.width = window.innerWidth;
    shatterCanvas.height = window.innerHeight;
    const shards = [];
    const numShards = 70;

    for (let i = 0; i < numShards; i++) {
      const angle = (Math.PI * 2 / numShards) * i + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 12 + 6;
      shards.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 40 + 15,
        alpha: 0.95
      });
    }

    let frames = 0;
    function animateShatter() {
      frames++;
      sCtx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);

      shards.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.25;
        s.rot += s.vRot;
        s.alpha -= 0.015;

        if (s.alpha > 0) {
          sCtx.save();
          sCtx.translate(s.x, s.y);
          sCtx.rotate(s.rot);
          sCtx.beginPath();
          sCtx.moveTo(-s.size / 2, -s.size / 3);
          sCtx.lineTo(s.size / 2, -s.size / 4);
          sCtx.lineTo(0, s.size / 2);
          sCtx.closePath();
          sCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, s.alpha * 0.25)})`;
          sCtx.strokeStyle = `rgba(255, 117, 151, ${Math.max(0, s.alpha)})`;
          sCtx.lineWidth = 1.5;
          sCtx.fill();
          sCtx.stroke();
          sCtx.restore();
        }
      });

      if (frames < 75) {
        requestAnimationFrame(animateShatter);
      } else {
        sCtx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
      }
    }
    animateShatter();
  }

  // ===================================================================
  // 5. MUSIC PLAYER DOCK
  // ===================================================================
  const musicDock = document.getElementById('musicDock');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const bgAudio = document.getElementById('bgAudio');
  let isPlayingAudio = false;

  function toggleMusic() {
    audio.init();

    if (!isPlayingAudio) {
      bgAudio.play().then(() => {
        isPlayingAudio = true;
        musicToggleBtn.classList.add('playing');
      }).catch(() => {
        audio.startAmbientChords();
        isPlayingAudio = true;
        musicToggleBtn.classList.add('playing');
      });
    } else {
      bgAudio.pause();
      audio.stopAmbientChords();
      isPlayingAudio = false;
      musicToggleBtn.classList.remove('playing');
    }
  }

  musicToggleBtn.addEventListener('click', () => {
    audio.playChime(620);
    toggleMusic();
  });

  // ===================================================================
  // 6. INTRO SEQUENCER WITH BLOOMING PLUM BLOSSOM
  // ===================================================================
  const plumBlossom = document.getElementById('plumBlossom');
  const opLine1 = document.getElementById('opLine1');
  const opLine2 = document.getElementById('opLine2');
  const opLine3 = document.getElementById('opLine3');
  const opLine4 = document.getElementById('opLine4');
  const opLine5 = document.getElementById('opLine5');
  const opLine6 = document.getElementById('opLine6');
  const opLine7 = document.getElementById('opLine7');
  const openingAction = document.getElementById('openingAction');
  const enterWorldBtn = document.getElementById('enterWorldBtn');
  const screenOpening = document.getElementById('screenOpening');

  function startOpeningSequence() {
    setTimeout(() => {
      plumBlossom.classList.add('is-blooming');
      audio.init();
      audio.playChime(440);
    }, 1200);

    setTimeout(() => { opLine1.classList.add('show'); }, 2400);
    setTimeout(() => { opLine2.classList.add('show'); }, 4000);

    setTimeout(() => {
      opLine1.classList.add('fade-out');
      opLine2.classList.add('fade-out');
    }, 5800);

    setTimeout(() => {
      opLine1.style.display = 'none';
      opLine2.style.display = 'none';
      opLine3.classList.add('show');
    }, 6600);

    setTimeout(() => { opLine4.classList.add('show'); }, 8200);

    setTimeout(() => {
      opLine3.classList.add('fade-out');
      opLine4.classList.add('fade-out');
    }, 10000);

    setTimeout(() => {
      opLine3.style.display = 'none';
      opLine4.style.display = 'none';
      opLine5.classList.add('show');
    }, 10800);

    setTimeout(() => { opLine6.classList.add('show'); }, 12600);

    setTimeout(() => {
      opLine5.classList.add('fade-out');
      opLine6.classList.add('fade-out');
    }, 14400);

    setTimeout(() => {
      opLine5.style.display = 'none';
      opLine6.style.display = 'none';
      opLine7.classList.add('show');
      audio.playChime(660);
    }, 15200);

    setTimeout(() => {
      openingAction.classList.add('is-ready');
    }, 16400);
  }

  window.addEventListener('DOMContentLoaded', startOpeningSequence);

  enterWorldBtn.addEventListener('click', (e) => {
    audio.init();
    audio.playShatterSound();
    audio.playDramaticChord();

    toggleMusic();

    const rect = enterWorldBtn.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;

    triggerGlassShatter(cX, cY);
    triggerParticleBurst(cX, cY);

    screenOpening.classList.add('is-dismissed');
    document.body.classList.remove('is-locked');
    musicDock.classList.add('is-visible');

    setTimeout(() => {
      screenOpening.style.display = 'none';
      runYearCounter();
      startShelbyRoamerLoop();
    }, 1300);
  });

  // ===================================================================
  // 7. YEAR COUNTER (2011 -> 2026 => 16 YEARS)
  // ===================================================================
  const yearCounterEl = document.getElementById('yearCounter');
  let hasCountedYears = false;

  function runYearCounter() {
    if (hasCountedYears || !yearCounterEl) return;
    hasCountedYears = true;

    let currentYear = 2011;
    const targetYear = 2026;
    const interval = 85;

    const timer = setInterval(() => {
      currentYear++;
      yearCounterEl.textContent = currentYear;
      
      if (currentYear % 3 === 0) {
        audio.playChime(400 + (currentYear - 2011) * 30);
      }

      if (currentYear >= targetYear) {
        clearInterval(timer);
        yearCounterEl.style.color = '#ff7597';
        audio.playChime(880);
      }
    }, interval);
  }

  // ===================================================================
  // 8. TIMELINE STEPPER (خريطة جنّا التفاعلية)
  // ===================================================================
  const tNodes = document.querySelectorAll('.t-node');
  const timelineFill = document.getElementById('timelineFill');
  const tdYearBadge = document.getElementById('tdYearBadge');
  const tdTitle = document.getElementById('tdTitle');
  const tdText = document.getElementById('tdText');
  const timelineDisplay = document.getElementById('timelineDisplay');

  const nodePercentages = { '2011': 0, '2015': 25, '2019': 50, '2022': 75, '2026': 100 };

  tNodes.forEach(node => {
    node.addEventListener('click', () => {
      audio.init();
      audio.playChime(600);

      tNodes.forEach(n => n.classList.remove('is-active'));
      node.classList.add('is-active');

      const yr = node.getAttribute('data-year');
      const title = node.getAttribute('data-title');
      const text = node.getAttribute('data-text');

      if (timelineFill) {
        timelineFill.style.width = `${nodePercentages[yr] || 0}%`;
      }

      timelineDisplay.style.opacity = '0';
      timelineDisplay.style.transform = 'translateY(8px)';
      setTimeout(() => {
        tdYearBadge.textContent = yr;
        tdTitle.textContent = title;
        tdText.textContent = text;
        timelineDisplay.style.opacity = '1';
        timelineDisplay.style.transform = 'translateY(0)';
      }, 200);
    });
  });

  // ===================================================================
  // 9. SHELBY: REAL QUADRUPED CAT ENGINE (WALK, RUN, DOCK ON THRONE)
  // ===================================================================
  const shelbyRoamer = document.getElementById('shelbyRoamer');
  const roamerBubble = document.getElementById('roamerBubble');
  const roamerText = document.getElementById('roamerText');
  const shelbyGlobalClicks = document.getElementById('shelbyGlobalClicks');
  const callShelbyBtn = document.getElementById('callShelbyBtn');
  const throneCushion = document.getElementById('throneCushion');
  const cushionHint = document.getElementById('cushionHint');

  let totalShelbyClicks = 0;
  let pedestalVisits = 0;
  let isDockedOnThrone = false;
  let currentPosX = window.innerWidth - 180;
  let currentPosY = window.innerHeight - 150;
  let roamerTimer = null;

  // Complete 50+ Sassy, Loving, Funny White Cat Quotes
  const shelbyMasterQuotes = [
    "مياو يا شني.. كل سنة وإنتي طيبة يا أجمل واحدة بتدوس عليا.",
    "عيد ميلاد سعيد يا كتكوته.. بس متفتكريش إني هديكِ هدية أنا فقيرة ومحتاجة تونة.",
    "يا جنّا إنتي كبرتي وبقيتي 16 سنة وأنا لسه بيضاء وأشيك منكِ.",
    "مياووو.. ربنا يخليكي لأخوكي عشان يفضل يجيبلي أكل ويدلعنا.",
    "كل سنة وإنتي زي القمر.. بس أنا بيضاء ومضيئة أكتر.",
    "يا شني بطلي تدوسي عليا كده.. أنا مش زرار في الكيبورد!",
    "عيد ميلادكِ يعني إيه؟ يعني هتتجنني أكتر وتخترعي أكل زيادة؟",
    "مياو.. إنتي النهاردة حلوة زيادة عن اللزوم، خلي بالكِ من نفسكِ.",
    "كل سنة وإنتي بخير يا اللي بتاخدي حاجتي ومبتستأذنيش.",
    "يا جنّا أنا بحبكِ أوي.. بس متقوليش لأخوكي عشان هيغير ويموت من الغيرة.",
    "عيد ميلاد سعيد.. ويا ريت السنة دي متزعقليش كتير لما أكسر حاجة.",
    "مياو يا شني.. إنتي أغلى عندي من علبة التونة اللي باكل منها.",
    "كبرتي وبقيتي 16 وخلاص بقيتي مسؤولة عني كأني بنتك بجد؟",
    "كل سنة وإنتي طيبة يا أجمل بنت في البيت بعدي أنا طبعاً 👑",
    "يا جنّا لو ضغطتي تاني هعتبرها حضن منكِ وهلزق فيكي.",
    "مياووو.. سنة جديدة وإنتي لسه بتضحكي على هزار أخوكي الغبي 😂",
    "عيد ميلادكِ يعني هتجيبيلي تونة فاخرة بدل البيض المسلوق؟",
    "يا شني أنا مش هقول بحبكِ تاني.. خلاص قلته مرة والملكات مبيكرروش كلامهم.",
    "كل سنة وإنتي أجمل كتكوته وسرنجة قلب في الدنيا.. بعدي طبعاً.",
    "مياو.. إنتي عارفة إني بستناكِ كل يوم ترجعي وتدوسي عليا؟",
    "عيد ميلاد سعيد يا جنّا.. وربنا يخليكي ضحكة البيت وسر الروقان.",
    "يا شني بطلي تفتكري إني ديكور.. أنا الشخصية الرئيسية هنا!",
    "كل سنة وإنتي بخير.. وأنا بخير طالما إنتي موجودة جنبي.",
    "مياو يا شنشونه.. إنتي النهاردة ملكة وأنا الحارس الشخصي الأبيض.",
    "عيد ميلاد سعيد.. ويا ريتكِ تفضلي تدوسي عليا وتلعبي معايا طول السنة.",
    "مياو.. إنتي لسه بتدوسي عليا؟ أنا الملكة البيضاء المتوجة هنا 🐾",
    "شلبي مش في المود دلوقتي.. جربي بعد دقيقتين أكون نمت.",
    "يا جنّا.. لو ضغطتي تاني هعضك عضة حب خفيفة!",
    "أنا جعانة.. مش فاضية لألعابكِ دلوقتي هاتي أكل الأول.",
    "مين قالكِ تلمسي الملكة من غير إذن يا كتكوته؟",
    "ضغطة كمان وهنزعل كلنا وهروح أستخبى ورا الكنبة!",
    "إنتي عارفة إني أشيك من أخوكي صح؟ وبتاخدي لبسه وتغيظيه؟ 😂",
    "مياو مياو.. عيد ميلاد سعيد يا أشطر لعيبة ببجي في مصر.",
    "أنا الوحيدة اللي بحبكِ من غير ما أزعقلكِ في البيت.",
    "سيبي أخوكي يتكلم براحته.. أنا أهم فرد في العيلة دي.",
    "لو عايزة أحضنكِ قولي عدل.. مش بالضغط على الشاشة!",
    "شلبي شايفة إنكِ تستاهلي أحلى وأعظم سنة في حياتك.",
    "اضغطي براحتك.. أنا أصلاً قطة كيوت وبتحمل كتير.",
    "مياووو.. إنتي ليه حلوة أوي كده النهاردة وعاملة جلو أب يجنن؟",
    "أنا مش مجرد قطة.. أنا الحارس الشخصي لجنا وسرنجة قلبها.",
    "لو أخوكي زعقلكِ قولي لشلبي وأنا أروح أخربشه في رجله!",
    "جربي تضغطي على أخوكي كده زي ما بتدوسي عليا وشوفي هيعمل إيه 😂",
    "أنا بحب المكان اللي إنتي قاعدة فيه بس يا شني.",
    "مياو.. 16 سنة وانتي أجمل وأحن قلب شوفته.",
    "خلاص بقى يا شنشونه.. هدي أعصابك شوية وبطلي عصبية!",
    "إنتي عارفة إني بتابعكم وأنتو بتتخانقو من بعيد وبضحك صح؟",
    "شلبي بتقولك: إنتي أهم من أي حاجة في الكوكب.",
    "ضغطتي عليا عشان عايزة حضن وطبطبة؟ تعالي في حضني 🤍",
    "أنا مش هقول بحبكِ.. بس إنتي عارفة إنك بنتي وأمي وصاحبتي.",
    "مياو.. ربنا يخليكي لأخوكي وليّا وتفضلي منورة دنيتنا دايمًا 🌸"
  ];

  function speakShelby(text) {
    roamerText.textContent = text;
    roamerBubble.classList.add('is-active');
    setTimeout(() => {
      roamerBubble.classList.remove('is-active');
    }, 4500);
  }

  function setCatMode(mode) {
    shelbyRoamer.classList.remove('shelby-mode-walk', 'shelby-mode-idle', 'shelby-mode-docked', 'shelby-mode-roll');
    shelbyRoamer.classList.add(mode);
  }

  // Gentle, Natural Quadruped Step Movement
  function walkCatTo(targetX, targetY, isRun = false, callback) {
    if (isDockedOnThrone) return;

    const deltaX = targetX - currentPosX;
    const isFacingLeft = deltaX < 0;

    // Flip ONLY inner cat art so the speech cloud is NEVER mirrored!
    const catArt = document.getElementById('shelbyCatArt');
    if (catArt) {
      catArt.style.transform = isFacingLeft ? 'scaleX(-1)' : 'scaleX(1)';
    }
    shelbyRoamer.style.transform = 'none';

    // Paws move ONLY during walk!
    setCatMode('shelby-mode-walk');

    // Gentle, natural walking duration (3 to 3.8 seconds)
    const duration = isRun ? 2200 : 3600;
    shelbyRoamer.style.transition = `left ${duration}ms cubic-bezier(0.25, 1, 0.4, 1), top ${duration}ms cubic-bezier(0.25, 1, 0.4, 1)`;

    shelbyRoamer.style.position = 'fixed';
    shelbyRoamer.style.left = `${targetX}px`;
    shelbyRoamer.style.top = `${targetY}px`;
    shelbyRoamer.style.right = 'auto';
    shelbyRoamer.style.bottom = 'auto';

    currentPosX = targetX;
    currentPosY = targetY;

    setTimeout(() => {
      // Paws STOP completely when stationary!
      setCatMode('shelby-mode-idle');

      // Random playful cute roll / sit on stop
      if (!isDockedOnThrone && Math.random() > 0.65) {
        setCatMode('shelby-mode-roll');
        setTimeout(() => {
          setCatMode('shelby-mode-idle');
        }, 1200);
      }

      if (callback) callback();
    }, duration);
  }

  // Roam periodically across screen slowly and gently
  function roamRandomly() {
    if (isDockedOnThrone) return;

    const randX = 30 + Math.random() * (window.innerWidth - 220);
    const randY = window.innerHeight - (130 + Math.random() * 80);

    walkCatTo(randX, randY, false, () => {
      if (Math.random() > 0.65) {
        speakShelby("مياو! بتفرج على الموقع معاكي يا شني 🐾");
      }
    });
  }

  function startShelbyRoamerLoop() {
    if (roamerTimer) clearInterval(roamerTimer);
    roamerTimer = setInterval(roamRandomly, 12000);
  }

  // DOCK SHELBY DIRECTLY ON HER THRONE IN SECTION 07
  function dockShelbyOnThrone() {
    if (isDockedOnThrone) return;
    isDockedOnThrone = true;

    pedestalVisits++;

    // Calculate cushion center position
    const cushionRect = throneCushion.getBoundingClientRect();
    const targetX = cushionRect.left + (cushionRect.width / 2) - 75;
    const targetY = cushionRect.top + (cushionRect.height / 2) - 65;

    // Walk gently onto cushion
    walkCatTo(targetX, targetY, false, () => {
      throneCushion.appendChild(shelbyRoamer);
      shelbyRoamer.classList.add('is-docked');
      shelbyRoamer.style.position = 'relative';
      shelbyRoamer.style.left = 'auto';
      shelbyRoamer.style.top = 'auto';
      shelbyRoamer.style.transform = 'scale(1.15)';
      
      const catArt = document.getElementById('shelbyCatArt');
      if (catArt) catArt.style.transform = 'scaleX(1)';

      // Paws completely still when on throne
      setCatMode('shelby-mode-docked');

      if (cushionHint) cushionHint.style.display = 'none';

      if (pedestalVisits >= 3) {
        shelbyRoamer.classList.add('shelby-tired');
        speakShelby("حرام عليكي هبطتيني من الجري رايح جاي يا شني! ارحمي قطتك شوية! 😂🐾");
        audio.playMeow();
      } else {
        shelbyRoamer.classList.remove('shelby-tired');
        speakShelby("وصلت لعرشي الملكي يا جنّا! نورتي مملكتي 👑🤍");
      }
    });
  }

  function undockShelbyFromThrone() {
    if (!isDockedOnThrone) return;
    isDockedOnThrone = false;

    document.body.appendChild(shelbyRoamer);
    shelbyRoamer.classList.remove('is-docked', 'shelby-tired');
    if (cushionHint) cushionHint.style.display = 'block';

    currentPosX = window.innerWidth - 200;
    currentPosY = window.innerHeight - 150;
    shelbyRoamer.style.position = 'fixed';
    shelbyRoamer.style.left = `${currentPosX}px`;
    shelbyRoamer.style.top = `${currentPosY}px`;
    shelbyRoamer.style.transform = 'none';

    setCatMode('shelby-mode-idle');
  }

  // Observer for Section 07
  const secShelbie = document.getElementById('secShelbie');
  if (secShelbie) {
    const secObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          dockShelbyOnThrone();
        } else {
          undockShelbyFromThrone();
        }
      });
    }, { threshold: 0.35 });
    secObserver.observe(secShelbie);
  }

  if (callShelbyBtn) {
    callShelbyBtn.addEventListener('click', () => {
      audio.init();
      audio.playMeow();
      dockShelbyOnThrone();
      speakShelby("أنا جيت جري أهو في نص العرش عشان خاطرك يا كتكوته! 🐾💨");
    });
  }

  shelbyRoamer.addEventListener('click', () => {
    audio.init();
    audio.playMeow();

    totalShelbyClicks++;
    if (shelbyGlobalClicks) shelbyGlobalClicks.textContent = totalShelbyClicks;

    shelbyRoamer.classList.remove('shelby-jump');
    void shelbyRoamer.offsetWidth;
    shelbyRoamer.classList.add('shelby-jump');

    const quote = shelbyMasterQuotes[totalShelbyClicks % shelbyMasterQuotes.length];
    speakShelby(quote);

    const rect = shelbyRoamer.getBoundingClientRect();
    triggerParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  // ===================================================================
  // 10. QUICK SIBLING LOVE NOTES
  // ===================================================================
  const noteBoxes = document.querySelectorAll('.note-box');
  const noteModal = document.getElementById('noteModal');
  const noteContentText = document.getElementById('noteContentText');
  const closeNoteBtn = document.getElementById('closeNoteBtn');

  const brotherQuickNotes = [
    "روقي كدا وفكي التكشيرة.. العيون دي معمولة عشان تضحك وتفرح بس، ومفيش أي حاجة في الكوكب تسوى لحظة زعل ليكي يا قمر عيني 🌸",
    "أنا جاي أطبطب على قلبك وأفكرك إنك أعظم إنجاز في حياتي.. لو الدنيا كلها ضاقت بيكي، كتفي دايمًا جاهز تستندي عليه 🐣🤍",
    "كل سنة وإنتي المزة اللي بمسح بيكي الأرض وتمسحي بيا البلاط ونرجع نتصالح في ثانيتين كأن محصلش حاجة 😂❤️",
    "شايفك وإنتي لابسة البالطو الأبيض ومعلقة السماعة وبتنقذي الناس بقلبك السمح.. هتبقي أشطر نيرس في الدنيا يا سرنجة قلبي 🩺✨",
    "فخور بيكي وبصبرك وبقوتك وبكل حاجة بتعمليها.. رفعتي راسي ولسه هترفعيها أكتر قدام الدنيا كلها 👑",
    "متخافيش من بكرة ولا تشيلي هم.. طول ما فيا نفس في الدنيا دي، أنتي في أمان ومحدش يقدر يمس شعرة منك 💖"
  ];

  noteBoxes.forEach(box => {
    box.addEventListener('click', () => {
      audio.init();
      audio.playChime(680);

      const idx = parseInt(box.getAttribute('data-idx')) || 0;
      noteContentText.textContent = brotherQuickNotes[idx];
      noteModal.classList.add('is-open');
    });
  });

  if (closeNoteBtn) {
    closeNoteBtn.addEventListener('click', () => {
      noteModal.classList.remove('is-open');
    });
  }

  // ===================================================================
  // 11. SECTION 08 — MOOD SELECTORS & NEON SISTER CARDS
  // ===================================================================
  const moodButtons = document.querySelectorAll('.mood-btn');
  const responseText = document.getElementById('responseText');
  const responseCard = document.getElementById('responseCard');

  const moodResponses = {
    joy: "اضحكي وفكيها يا كتكوته.. ضحكتك دي والله بالدنيا ومفيش أي حاجة في الكوكب مستاهلة تزعلك.. ارمي كل دوشة ورا ضهرك وافتكري إنك أحلى وأروش شني في الكون، واللي جاي كله دلع وخروجات واختراعات أكل تكسر الدنيا ❤️🐣",
    calm: "هدي بالك يا قمر عيني.. كل الدوشة والتفكير اللي قلقاكي دي مجرد فترة وهتعدي وهتفتكريها وتضحكي.. متفكريش بزيادة وبلاش شيل هم، ربنا شايلك عوض جميل أوي فوق ما تتخيلي.. خدي نفس عميق وروقي كدا 🌙🌸",
    comfort: "أنا جاي أطبطب على قلبك وأفكرك إنك مش لوحدك أبداً.. مهما الدنيا قفلت في وشك أو حسيتي بتقل، افتكري دايماً إن في أخ واقف في ضهرك سند وجاهز يسمعك ويشيل عنك في أي لحظة من غير ما تطلبي حتى 🫂🤍",
    hope: "العوض دايماً بيبقى على قد الصبر وزيااادة.. لو شفتي أيام صعبة فدا مش معناه إن حظك قليل، دا معناه إن الفرحة اللي مستنياكي هتبقى أد الصبر ده ألف مرة.. بكرا هتبقي أشطر نيرس في الدنيا وكل اللي حلمتي بيه هيبقى بين إيديكي ✨🩺"
  };

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.init();
      audio.playChime(650);

      moodButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const mood = btn.getAttribute('data-mood');
      const text = moodResponses[mood] || moodResponses.joy;

      responseText.style.opacity = '0';
      responseCard.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        responseText.textContent = text;
        responseText.style.opacity = '1';
        responseCard.style.transform = 'scale(1)';
      }, 250);
    });
  });

  const miniCardsGrid = document.getElementById('miniCardsGrid');
  const sweetSisterMessages = [
    {
      tag: "دلع & فرحة",
      icon: "🌸",
      content: "مساء الروقان ع الجميل.. متخليش أي زعل يدخل العيون الحلوة دي، الملامح دي معمولة للضحك بس يا قمر عيني."
    },
    {
      tag: "طبطبة ع القلب",
      icon: "🐣",
      content: "يا أشطر كتكوته.. بطلي تقلقي من اللي جاي، ربنا كريم أوي وهيراضيكي بفرحة تخليكي تعيطي من كتر جمالها."
    },
    {
      tag: "فخر واعتزاز",
      icon: "✨",
      content: "أنا فخور بيكي بجد وبقوتك وطيبة قلبك.. كل خطوة بتخطيها بتخليني رافع راسي بيكي يا أغلى أخت."
    },
    {
      tag: "سند وظهر",
      icon: "🫂",
      content: "لو كل الدنيا اتخلت عنك أو حسيتي بالغربة.. افتكري إن ليكي أخ وراكي بمليون ضهر، متخافيش من حاجة طول ما أنا عايش."
    },
    {
      tag: "ضحك وهزار",
      icon: "😂",
      content: "كل سنة وإنتي المزة اللي بنمسح ببعض البلاط ونرجع نتصالح على شوكولاتة وضحكة هبلة في ثواني!"
    },
    {
      tag: "شيف العيلة",
      icon: "🍳",
      content: "مستني اختراع الأكلة الجاية اللي هتجربيها.. بس بلاش تحرقي المطبخ بس يا شني المرة دي عشان متبهدلش معاكي!"
    },
    {
      tag: "سرنجة قلبي",
      icon: "🩺",
      content: "شايفك وإنتي لابسة البالطو ومعلقة السماعة وبتنقذي الناس بقلبك الأبيض.. هتبقي أجدع ممرضة قد الدنيا."
    },
    {
      tag: "معجزة الـ 16",
      icon: "🎂",
      content: "تميتي 16 سنة رسمي.. كبرتي وبقيتي زي القمر، عقبال ما أشوفك أسعد وأنجح بنت في المجرة كلها يا جنّا."
    }
  ];

  if (miniCardsGrid) {
    sweetSisterMessages.forEach(item => {
      const card = document.createElement('div');
      card.className = 'mini-card';
      card.innerHTML = `
        <div class="mini-card-header">
          <span class="mini-card-tag">${item.tag}</span>
          <span class="mini-card-icon">${item.icon}</span>
        </div>
        <p class="mini-card-content">${item.content}</p>
      `;
      miniCardsGrid.appendChild(card);
    });
  }

  // ===================================================================
  // 12. SECTION 10 — THE GRAND WOW MOMENT & EMOTIONAL LETTER
  // ===================================================================
  const wowOpenBtn = document.getElementById('wowOpenBtn');
  const wowTriggerBox = document.getElementById('wowTriggerBox');
  const wowStage = document.getElementById('wowStage');
  const wordVortex = document.getElementById('wordVortex');
  const coreTrinity = document.getElementById('coreTrinity');
  const grandLetterWrapper = document.getElementById('grandLetterWrapper');

  const vortexKeywords = [
    "ضحكتك", "عنادك", "أكلك", "شلبي 🐈‍⬛", "ميراكولوس 🐞", "ببجي 🎮", "الورد 🌸",
    "تمريض 🩺", "سرنجة قلبي", "خناقاتنا", "هزارنا", "جنّا", "كتكوته 🐣", "شني", 
    "قمر عيني", "أختي", "حبيبتي", "16 سنة", "أحلى جلو أب"
  ];

  if (wowOpenBtn) {
    wowOpenBtn.addEventListener('click', () => {
      audio.init();
      audio.playDramaticChord();

      const rect = wowOpenBtn.getBoundingClientRect();
      triggerParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

      wowTriggerBox.style.display = 'none';
      wowStage.classList.add('is-active');

      vortexKeywords.forEach((word, index) => {
        setTimeout(() => {
          const span = document.createElement('span');
          span.className = 'vortex-word';
          span.textContent = word;
          
          const posX = 15 + Math.random() * 70;
          const posY = 15 + Math.random() * 70;
          const vx = (Math.random() - 0.5) * 400 + 'px';
          const vy = (Math.random() - 0.5) * 400 + 'px';

          span.style.left = `${posX}%`;
          span.style.top = `${posY}%`;
          span.style.setProperty('--vx', vx);
          span.style.setProperty('--vy', vy);
          span.style.fontSize = `${1.3 + Math.random() * 1.5}rem`;

          wordVortex.appendChild(span);
        }, index * 100);
      });

      setTimeout(() => {
        coreTrinity.classList.add('is-shown');
        const words = coreTrinity.querySelectorAll('.trinity-word');
        words.forEach((w, i) => {
          setTimeout(() => {
            w.classList.add('show');
            audio.playChime(500 + i * 150);
          }, i * 650);
        });
      }, 2300);

      setTimeout(() => {
        wowStage.classList.remove('is-active');
        grandLetterWrapper.classList.add('is-revealed');
        grandLetterWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const paras = document.querySelectorAll('.letter-body .msg-para');
        paras.forEach((p, idx) => {
          setTimeout(() => {
            p.style.color = '#ffffff';
          }, idx * 170);
        });
      }, 5400);
    });
  }

  // ===================================================================
  // 13. SECTION 11 — FUTURE YEARS COUNTER & REPLAY
  // ===================================================================
  const futureYearVal = document.getElementById('futureYearVal');
  const replayBtn = document.getElementById('replayBtn');
  let hasFutureTicked = false;

  const futureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasFutureTicked && futureYearVal) {
        hasFutureTicked = true;
        let y = 16;
        const futureTimer = setInterval(() => {
          y++;
          futureYearVal.textContent = y;
          if (y >= 25) {
            clearInterval(futureTimer);
            futureYearVal.textContent = '25+ ♾️';
          }
        }, 130);
      }
    });
  }, { threshold: 0.3 });

  if (futureYearVal) {
    futureObserver.observe(futureYearVal);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      audio.init();
      audio.playChime(750);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // General Reveal Items & Progress Bar
  const revealItems = document.querySelectorAll('.reveal-item');
  const progressBar = document.getElementById('storyProgressBar');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach(el => revealObserver.observe(el));

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  });

})();
