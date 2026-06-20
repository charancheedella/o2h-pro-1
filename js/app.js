// TaskFlow Landing Page Functionality

document.addEventListener('DOMContentLoaded', () => {
  
  // Theme Toggle (Dark / Light Mode)
  const themeToggle = document.getElementById('theme-toggle');
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      if (colorSchemeMeta) colorSchemeMeta.content = 'dark';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      if (colorSchemeMeta) colorSchemeMeta.content = 'light';
    }
    localStorage.setItem('color-scheme', theme);
  }

  // Load user preference or default to system settings
  let currentTheme = localStorage.getItem('color-scheme');
  if (!currentTheme) {
    currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  // Watch for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('color-scheme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });


  // Mobile Navigation Drawer
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  }

  function closeMobileMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      closeMobileMenu();
    });
  });

  // Close navigation if clicking outside the menu
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });


  // API Article Fetching
  const articlesContainer = document.getElementById('articles-container');

  // XSS protection escape helper
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  async function fetchArticles() {
    // Skeleton loading templates
    articlesContainer.innerHTML = Array(3).fill(`
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    `).join('');

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) {
        throw new Error('API server returned status: ' + response.status);
      }
      
      const posts = await response.json();
      const latestArticles = posts.slice(0, 6);

      articlesContainer.innerHTML = latestArticles.map(article => `
        <article class="article-card">
          <div class="article-content-wrapper">
            <h3 class="article-title">${escapeHTML(article.title)}</h3>
            <p class="article-excerpt">${escapeHTML(article.body)}</p>
          </div>
          <a href="#articles" class="article-link" aria-label="Read more of article: ${escapeHTML(article.title)}">
            <span>Read More</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </article>
      `).join('');

    } catch (error) {
      console.error('TaskFlow Article Fetch Error:', error);
      articlesContainer.innerHTML = `
        <div class="api-error-container">
          <h3>Failed to Load Articles</h3>
          <p>We encountered an issue downloading the latest insights. Please check your connectivity and try again.</p>
          <button id="retry-articles-btn" class="btn btn-primary btn-sm">Retry Loading</button>
        </div>
      `;
      const retryBtn = document.getElementById('retry-articles-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', fetchArticles);
      }
    }
  }

  fetchArticles();


  // Contact Form Validation & Submission
  const contactForm = document.getElementById('contact-form');
  const successContainer = document.getElementById('form-success');
  const successUserName = document.getElementById('success-user-name');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  const inputs = {
    name: {
      el: document.getElementById('contact-name'),
      errEl: document.getElementById('name-error'),
      validate() {
        const val = this.el.value.trim();
        if (val === '') {
          return this.showError('Name is required.');
        }
        if (val.length < 2) {
          return this.showError('Name must be at least 2 characters.');
        }
        return this.clearError();
      }
    },
    email: {
      el: document.getElementById('contact-email'),
      errEl: document.getElementById('email-error'),
      validate() {
        const val = this.el.value.trim();
        if (val === '') {
          return this.showError('Email is required.');
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(val)) {
          return this.showError('Please provide a valid email address.');
        }
        return this.clearError();
      }
    },
    message: {
      el: document.getElementById('contact-message'),
      errEl: document.getElementById('message-error'),
      validate() {
        const val = this.el.value.trim();
        if (val === '') {
          return this.showError('Message is required.');
        }
        if (val.length < 10) {
          return this.showError('Message must be at least 10 characters.');
        }
        return this.clearError();
      }
    }
  };

  Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    
    input.showError = function(msg) {
      this.el.classList.add('is-invalid');
      this.el.setAttribute('aria-invalid', 'true');
      this.errEl.textContent = msg;
      this.errEl.style.display = 'block';
      return false;
    };

    input.clearError = function() {
      this.el.classList.remove('is-invalid');
      this.el.removeAttribute('aria-invalid');
      this.errEl.textContent = '';
      this.errEl.style.display = 'none';
      return true;
    };

    input.el.addEventListener('input', () => input.validate());
    input.el.addEventListener('blur', () => input.validate());
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    let firstInvalidInput = null;

    Object.keys(inputs).forEach(key => {
      const isValid = inputs[key].validate();
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = inputs[key].el;
        }
      }
    });

    if (isFormValid) {
      const userName = inputs.name.el.value.trim();
      successUserName.textContent = escapeHTML(userName);

      contactForm.style.display = 'none';
      successContainer.style.display = 'flex';
      successContainer.focus();
    } else if (firstInvalidInput) {
      firstInvalidInput.focus();
    }
  });

  closeSuccessBtn.addEventListener('click', () => {
    contactForm.reset();
    Object.keys(inputs).forEach(key => {
      inputs[key].clearError();
    });
    successContainer.style.display = 'none';
    contactForm.style.display = 'block';
  });
});
