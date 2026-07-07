/* =========================================================
   ROSHAAN UMAR — PORTFOLIO SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 500);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => preloader && preloader.classList.add('hidden'), 3000);

  /* ---------- 2. Scroll progress bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 3. Sticky nav on scroll ---------- */
  const navbar = document.getElementById('navbar');
  function toggleNavShadow(){
    if(window.scrollY > 40){ navbar.classList.add('scrolled'); }
    else{ navbar.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', toggleNavShadow, { passive: true });
  toggleNavShadow();

  /* ---------- 4. Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinksEl = document.getElementById('nav-links');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  // Close mobile menu after clicking a link
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 5. Active nav link on scroll (IntersectionObserver) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- 6. Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 7. Animated skill bars ---------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const target = entry.target.dataset.level || 0;
        entry.target.style.width = target + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------- 8. Scroll-to-top button ---------- */
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 9. Hero typewriter ---------- */
  const roles = [
    'AI Engineer & Full Stack Developer',
    'Database-Driven Software Engineer',
    'Building with Python, C++ & SQL'
  ];
  const typeEl = document.getElementById('typed-role');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];
    if(!deleting){
      charIndex++;
      typeEl.textContent = current.slice(0, charIndex);
      if(charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typeEl.textContent = current.slice(0, charIndex);
      if(charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 55);
  }
  if(typeEl){ typeLoop(); }

  /* ---------- 10. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  /* ---------- 11. Contact form validation ---------- */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  function setFieldError(fieldEl, message){
    const wrapper = fieldEl.closest('.field');
    wrapper.classList.add('invalid');
    wrapper.querySelector('.error-msg').textContent = message;
  }
  function clearFieldError(fieldEl){
    const wrapper = fieldEl.closest('.field');
    wrapper.classList.remove('invalid');
  }

  function validateForm(){
    let valid = true;
    const nameEl = document.getElementById('cf-name');
    const emailEl = document.getElementById('cf-email');
    const subjectEl = document.getElementById('cf-subject');
    const messageEl = document.getElementById('cf-message');

    if(!nameEl.value.trim()){
      setFieldError(nameEl, 'Please enter your name.');
      valid = false;
    } else clearFieldError(nameEl);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailEl.value.trim() || !emailPattern.test(emailEl.value.trim())){
      setFieldError(emailEl, 'Please enter a valid email address.');
      valid = false;
    } else clearFieldError(emailEl);

    if(!subjectEl.value.trim()){
      setFieldError(subjectEl, 'Please add a subject.');
      valid = false;
    } else clearFieldError(subjectEl);

    if(!messageEl.value.trim() || messageEl.value.trim().length < 10){
      setFieldError(messageEl, 'Message should be at least 10 characters.');
      valid = false;
    } else clearFieldError(messageEl);

    return valid;
  }

  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.classList.remove('show', 'success');

      if(validateForm()){
        // Front-end only: no backend wired up yet.
        formStatus.textContent = 'Message ready — connect this form to an email service (e.g. Formspree, EmailJS) or your own backend to send it.';
        formStatus.classList.add('show', 'success');
        form.reset();
      }
    });

    // Clear error state as the user types
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => clearFieldError(el));
    });
  }

});
