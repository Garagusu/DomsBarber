/* ========================================
   DOM'S BARBER LOUNGE — MAIN JS
   Version 1.0 | domsbarberlounge.ca
   ======================================== */

'use strict';

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ── COOKIE CONSENT ──
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => banner.remove(), 400);
  }
  // Init analytics after consent
  initAnalytics();
}

function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 400);
  }
}

function initAnalytics() {
  // Place GA4 or other analytics initialization here
  console.log('Analytics initialized');
}

// Init cookie banner
(function initCookieBanner() {
  const consent = localStorage.getItem('cookieConsent');
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (consent) {
    banner.remove();
    if (consent === 'accepted') initAnalytics();
  } else {
    banner.style.display = 'block';
  }
})();

// ── FAQ ACCORDION ──
function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      
      // Close all others
      questions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });
      
      // Toggle current
      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.hidden = expanded;
    });
  });
}

// ── AOS (Animate on Scroll) ──
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || '0');
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  elements.forEach(el => observer.observe(el));
}

// ── NEWSLETTER ──
function handleNewsletter(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="email"]');
  const email = input ? input.value.trim() : '';
  
  if (!email || !isValidEmail(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }
  
  // Simulate API call
  const btn = form.querySelector('button');
  const originalText = btn.textContent;
  btn.textContent = 'Subscribing...';
  btn.disabled = true;
  
  setTimeout(() => {
    showToast('Welcome to the Dom\'s family! 🎉 Check your email.', 'success');
    form.reset();
    btn.textContent = originalText;
    btn.disabled = false;
    localStorage.setItem('newsletterSignup', 'true');
  }, 1200);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── TOAST NOTIFICATIONS ──
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.style.cssText = `
    position:fixed;top:100px;right:24px;z-index:9999;
    background:${type === 'success' ? 'var(--gold)' : '#e74c3c'};
    color:${type === 'success' ? 'var(--black)' : 'white'};
    font-family:var(--font-heading);font-size:0.88rem;font-weight:600;
    letter-spacing:0.05em;padding:16px 24px;
    border-radius:var(--radius);box-shadow:var(--shadow);
    animation:slideUp 0.3s ease;max-width:320px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── EXIT INTENT POPUP ──
let exitShown = false;
function initExitIntent() {
  const popup = document.getElementById('exitPopup');
  if (!popup) return;
  if (localStorage.getItem('exitPopupShown')) return;
  
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !exitShown) {
      exitShown = true;
      popup.hidden = false;
      localStorage.setItem('exitPopupShown', 'true');
      document.body.style.overflow = 'hidden';
    }
  });
}

function closeExitPopup() {
  const popup = document.getElementById('exitPopup');
  if (popup) {
    popup.hidden = true;
    document.body.style.overflow = '';
  }
}

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeExitPopup();
    closeChatBox();
  }
});

// ── SOCIAL PROOF NOTIFICATIONS ──
const proofMessages = [
  { name: 'Marcus T.', action: 'booked a Skin Fade', time: '2 min ago' },
  { name: 'James P.', action: 'left a 5★ review', time: '5 min ago' },
  { name: 'Alex R.', action: 'booked a Beard Trim', time: '8 min ago' },
  { name: 'Daniel K.', action: 'booked a Cut + Combo', time: '12 min ago' },
  { name: 'Ryan S.', action: 'booked a Hot Towel Shave', time: '15 min ago' },
  { name: 'Tony M.', action: 'booked a Classic Cut', time: '20 min ago' },
];

function showSocialProof() {
  const el = document.getElementById('socialProof');
  if (!el) return;
  
  let index = 0;
  function show() {
    const proof = proofMessages[index % proofMessages.length];
    el.innerHTML = `
      <strong>📍 ${proof.name}</strong>
      ${proof.action} · ${proof.time}
    `;
    el.style.display = 'block';
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        el.style.display = 'none';
        el.style.opacity = '1';
        el.style.transition = '';
        index++;
      }, 500);
    }, 4000);
  }

  setTimeout(() => {
    show();
    setInterval(show, 10000);
  }, 5000);
}

// ── AI CHAT WIDGET ──
const chatResponses = {
  'services': `At Dom's Barber Lounge we offer:\n• Classic Haircut – from $30\n• Skin Fade – from $40\n• Beard Trim & Shape – from $25\n• Hot Towel Shave – from $45\n• Cut + Beard Combo – from $55\n• Kids Haircut – from $22\n\nWant to book one?`,
  'pricing': `Here's our current pricing:\n• Classic Haircut – from $30\n• Skin Fade – from $40\n• Beard Trim – from $25\n• Hot Towel Shave – from $45\n• Cut + Beard Combo – from $55\n• Kids Cut – from $22\n\nAll prices include consultation and styling.`,
  'book': `Booking is easy! You can:\n1. Book online: click the "Book Now" button above\n2. Call us: 613-725-2222\n3. Walk in — we accept walk-ins based on availability\n\nSame-day appointments are often available!`,
  'hours': `We're open:\n• Monday–Friday: 9:00 AM – 7:00 PM\n• Saturday: 9:00 AM – 5:00 PM\n• Sunday: 10:00 AM – 3:00 PM\n\nWe're located at 60 Lyndale Ave, Toronto (East York).`,
  'location': `Dom's Barber Lounge is at:\n📍 60 Lyndale Ave, Toronto, Ontario\n\nEasy street parking available. Accessible by TTC. Call 613-725-2222 for directions.`,
  'fade': `The Skin Fade is our signature service — a perfectly blended gradient that starts from zero at the sides and gradually builds to your desired length on top.\n\nPrice: from $40 · Duration: ~35 min\n\nTip: Bring a photo of your ideal style for best results!`,
  'beard': `Our Beard Trim & Shape service includes:\n• Consultation on your ideal beard shape\n• Precision trimming with clippers & scissors\n• Straight-razor edge cleanup\n• Hot towel finish\n\nPrice: from $25 · Add to a haircut for a combo!`,
  'hairstyle': `For hairstyle recommendations, tell me:\n1. Your face shape (oval, round, square, diamond, oblong)\n2. Your hair texture (straight, wavy, curly)\n3. How much maintenance you want (low/medium/high)\n\nI'll suggest the perfect style for you!`,
  'default': `Great question! At Dom's Barber Lounge we specialize in premium men's grooming — fades, cuts, beard work, and hot towel shaves.\n\nFor specific questions, call us at 613-725-2222 or book online. Want me to help you with something specific?`
};

function getChatResponse(message) {
  const m = message.toLowerCase();
  if (m.includes('service') || m.includes('offer')) return chatResponses.services;
  if (m.includes('price') || m.includes('cost') || m.includes('how much')) return chatResponses.pricing;
  if (m.includes('book') || m.includes('appointment') || m.includes('schedule')) return chatResponses.book;
  if (m.includes('hour') || m.includes('open') || m.includes('close') || m.includes('time')) return chatResponses.hours;
  if (m.includes('location') || m.includes('address') || m.includes('where') || m.includes('find')) return chatResponses.location;
  if (m.includes('fade') || m.includes('skin fade')) return chatResponses.fade;
  if (m.includes('beard')) return chatResponses.beard;
  if (m.includes('hairstyle') || m.includes('recommend') || m.includes('suggest') || m.includes('style')) return chatResponses.hairstyle;
  return chatResponses.default;
}

function initChat() {
  const toggle = document.getElementById('chatToggle');
  const box = document.getElementById('chatBox');
  const close = document.getElementById('chatClose');
  
  if (!toggle || !box) return;
  
  toggle.addEventListener('click', () => {
    const isHidden = box.hidden;
    box.hidden = !isHidden;
    toggle.setAttribute('aria-expanded', String(isHidden));
    if (isHidden) {
      const input = document.getElementById('chatInput');
      if (input) input.focus();
    }
  });
  
  if (close) {
    close.addEventListener('click', closeChatBox);
  }
}

function closeChatBox() {
  const box = document.getElementById('chatBox');
  const toggle = document.getElementById('chatToggle');
  if (box) box.hidden = true;
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;
  
  chatSend(message);
  input.value = '';
}

function chatSend(message) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  
  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<p>${escapeHtml(message)}</p>`;
  messages.appendChild(userMsg);
  
  // Loading dots
  const loading = document.createElement('div');
  loading.className = 'chat-msg bot';
  loading.innerHTML = `<div class="chat-loading"><span></span><span></span><span></span></div>`;
  messages.appendChild(loading);
  scrollChatDown(messages);
  
  // Simulate AI response
  setTimeout(() => {
    loading.remove();
    const response = getChatResponse(message);
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `<p>${response.replace(/\n/g, '<br>')}</p>`;
    messages.appendChild(botMsg);
    scrollChatDown(messages);
  }, 800 + Math.random() * 600);
  
  // Open chat box if closed
  const box = document.getElementById('chatBox');
  if (box) box.hidden = false;
}

function scrollChatDown(el) {
  if (el) el.scrollTop = el.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ── BOOKING SYSTEM ──
let selectedService = null;
let selectedDate = null;
let selectedTime = null;

function initBooking() {
  const serviceOptions = document.querySelectorAll('.service-option');
  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedService = opt.dataset.service;
      updateBookingSummary();
    });
  });
  
  const timeSlots = document.querySelectorAll('.time-slot:not(.booked)');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = slot.textContent.trim();
      updateBookingSummary();
    });
  });
  
  initCalendar();
}

function initCalendar() {
  const calGrid = document.getElementById('calendarGrid');
  if (!calGrid) return;
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  
  const calTitle = document.getElementById('calTitle');
  if (calTitle) calTitle.textContent = `${monthNames[month]} ${year}`;
  
  // Clear
  calGrid.innerHTML = '';
  
  // Headers
  days.forEach(d => {
    const h = document.createElement('div');
    h.className = 'cal-header';
    h.textContent = d;
    calGrid.appendChild(h);
  });
  
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    calGrid.appendChild(empty);
  }
  
  // Days
  for (let d = 1; d <= totalDays; d++) {
    const dayEl = document.createElement('button');
    dayEl.className = 'cal-day';
    dayEl.textContent = d;
    
    const date = new Date(year, month, d);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (date < today) {
      dayEl.classList.add('unavailable');
      dayEl.setAttribute('aria-disabled', 'true');
    } else if (date.toDateString() === today.toDateString()) {
      dayEl.classList.add('today');
    }
    
    dayEl.addEventListener('click', () => {
      if (dayEl.classList.contains('unavailable')) return;
      document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
      dayEl.classList.add('selected');
      selectedDate = `${monthNames[month]} ${d}, ${year}`;
      updateBookingSummary();
    });
    
    calGrid.appendChild(dayEl);
  }
}

function updateBookingSummary() {
  const serviceEl = document.getElementById('summaryService');
  const dateEl = document.getElementById('summaryDate');
  const timeEl = document.getElementById('summaryTime');
  
  if (serviceEl) serviceEl.textContent = selectedService || '—';
  if (dateEl) dateEl.textContent = selectedDate || '—';
  if (timeEl) timeEl.textContent = selectedTime || '—';
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const form = e.target;
  
  // Basic validation
  const name = form.querySelector('#bookName')?.value.trim();
  const phone = form.querySelector('#bookPhone')?.value.trim();
  const email = form.querySelector('#bookEmail')?.value.trim();
  
  if (!name) { showToast('Please enter your name.', 'error'); return; }
  if (!phone) { showToast('Please enter your phone number.', 'error'); return; }
  if (!email || !isValidEmail(email)) { showToast('Please enter a valid email.', 'error'); return; }
  if (!selectedService) { showToast('Please select a service.', 'error'); return; }
  if (!selectedDate) { showToast('Please select a date.', 'error'); return; }
  if (!selectedTime) { showToast('Please select a time slot.', 'error'); return; }
  
  const btn = form.querySelector('button[type="submit"]');
  const orig = btn ? btn.innerHTML : '';
  if (btn) { btn.innerHTML = 'Confirming...'; btn.disabled = true; }
  
  // Simulate booking API call
  setTimeout(() => {
    showBookingConfirmation({ name, email, service: selectedService, date: selectedDate, time: selectedTime });
    if (btn) { btn.innerHTML = orig; btn.disabled = false; }
  }, 1500);
}

function showBookingConfirmation(data) {
  const formWrap = document.querySelector('.booking-form-wrap');
  if (!formWrap) { showToast('Appointment confirmed! 🎉', 'success'); return; }
  
  formWrap.innerHTML = `
    <div style="text-align:center;padding:40px 20px;">
      <div style="width:70px;height:70px;background:var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:2rem;">✓</div>
      <h3 style="font-family:var(--font-heading);font-size:1.8rem;margin-bottom:12px;">Booking Confirmed!</h3>
      <p style="color:var(--white-dim);margin-bottom:24px;">Thanks, <strong>${escapeHtml(data.name)}</strong>! Your appointment has been booked.</p>
      <div style="background:var(--dark);border:1px solid var(--border);border-radius:var(--radius);padding:24px;text-align:left;margin-bottom:24px;">
        <p style="margin:8px 0;font-size:0.9rem;color:var(--white-dim);"><strong style="color:var(--white);">Service:</strong> ${escapeHtml(data.service)}</p>
        <p style="margin:8px 0;font-size:0.9rem;color:var(--white-dim);"><strong style="color:var(--white);">Date:</strong> ${escapeHtml(data.date)}</p>
        <p style="margin:8px 0;font-size:0.9rem;color:var(--white-dim);"><strong style="color:var(--white);">Time:</strong> ${escapeHtml(data.time)}</p>
        <p style="margin:8px 0;font-size:0.9rem;color:var(--white-dim);"><strong style="color:var(--white);">Location:</strong> 60 Lyndale Ave, Toronto</p>
      </div>
      <p style="font-size:0.85rem;color:var(--white-dim);margin-bottom:24px;">A confirmation has been sent to <strong>${escapeHtml(data.email)}</strong>. We'll also send a reminder 24 hours before your appointment.</p>
      <a href="index.html" class="btn-gold">Back to Home</a>
    </div>
  `;
}

// ── ACTIVE NAV LINK ──
function setActiveNavLink() {
  const path = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('index.html')))) {
      link.classList.add('active');
    }
  });
}

// ── SMOOTH ANCHOR SCROLL ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ── LAZY LOADING ──
function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  }
}

// ── INIT ALL ──
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initAOS();
  initChat();
  initSmoothScroll();
  initLazyLoad();
  setActiveNavLink();
  
  // Only run on booking page
  if (document.getElementById('calendarGrid')) initBooking();
  
  // Delayed non-critical features
  setTimeout(() => {
    initExitIntent();
    showSocialProof();
  }, 2000);
});

// Expose global functions
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.closeExitPopup = closeExitPopup;
window.chatSend = chatSend;
window.handleChatSubmit = handleChatSubmit;
window.handleNewsletter = handleNewsletter;
window.handleBookingSubmit = handleBookingSubmit;
