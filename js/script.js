/* =========================================================
   杨舒晴 · 个人简历交互脚本
   功能：滚动进度条 / 导航显隐 / 元素滚动淡入 / 返回顶部
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. 滚动进度条 ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  /* ---------- 2. 顶部导航：滚动超过 Hero 后显示 ---------- */
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');
  function updateNav() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    nav.classList.toggle('visible', heroBottom < 0);
  }

  /* ---------- 3. 返回顶部按钮 ---------- */
  const toTop = document.getElementById('toTop');
  function updateToTop() {
    toTop.classList.toggle('visible', window.scrollY > 600);
  }
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* 统一滚动事件（节流处理，避免频繁触发） */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        updateToTop();
        ticking = false;
      });
      ticking = true;
    }
  });
  updateProgress();
  updateNav();
  updateToTop();

  /* ---------- 4. 滚动淡入动画（IntersectionObserver） ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => observer.observe(el));

  /* ---------- 5. 导航平滑滚动（锚点跳转补偿固定导航高度） ---------- */
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

});
