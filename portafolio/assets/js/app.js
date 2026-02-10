/**
 * Portafolio - MVC (Model-View-Controller) - Vanilla JavaScript
 * Sin jQuery. Rutas (#about, #resume, #portfolio, #contacts) sin cambios.
 */
(function () {
  'use strict';

  // ==================== MODEL ====================
  var Model = {
    sectionIds: ['#about', '#resume', '#portfolio', '#contacts'],
    currentSection: '',
    portfolioFilter: 'all',
    theme: { color: 'light-green', bg: 'cartografer' },
    animClasses: ['rotateInUpRight', 'fadeInRight', 'fadeInUp', 'rotateInUpLeft'],
    colorToBg: {
      'light-green': 'dark-wood', 'green': 'dark-wood', 'red': 'dark-wood',
      'cafe': 'cartografer', 'orange': 'cartografer', 'yellow': 'cartografer'
    },
    carouselIndex: 0,
    gallery: { images: [], index: 0 },

    getCurrentSection: function () { return this.currentSection; },
    setCurrentSection: function (id) { this.currentSection = id || '#about'; },

    getPortfolioFilter: function () { return this.portfolioFilter; },
    setPortfolioFilter: function (group) { this.portfolioFilter = group || 'all'; },

    getTheme: function () { return this.theme; },
    setThemeColor: function (color) { this.theme.color = color; },
    setThemeBg: function (bg) { this.theme.bg = bg; },

    getCarouselIndex: function () { return this.carouselIndex; },
    setCarouselIndex: function (i) { this.carouselIndex = i; },

    getRandomAnim: function () {
      return this.animClasses[Math.floor(Math.random() * this.animClasses.length)];
    },
    getBgForColor: function (color) { return this.colorToBg[color] || 'cartografer'; }
  };

  // ==================== VIEW ====================
  var View = {
    preload: null,
    pageSections: null,
    navButtons: null,
    grid: null,
    filterLinks: null,
    sColorLink: null,
    wrapMenuEl: null,
    clientCarousel: null,
    modalContainer: null,

    initRefs: function () {
      this.preload = document.querySelector('.preload');
      this.pageSections = document.querySelectorAll('.page-sctn');
      this.navButtons = document.querySelectorAll('.navbar-button');
      this.grid = document.getElementById('grid');
      this.filterLinks = document.querySelectorAll('#filter a');
      this.sColorLink = document.querySelector('link.s-color');
      this.wrapMenuEl = document.querySelector('.wrap-menu');
      this.clientCarousel = document.getElementById('clientCarousel');
    },

    hidePreloader: function () {
      if (!this.preload) return;
      this.preload.style.transition = 'opacity 0.5s';
      this.preload.style.opacity = '0';
      setTimeout(function () { this.preload.style.display = 'none'; }.bind(this), 500);
    },

    setWrapMenuWidth: function (w) {
      if (this.wrapMenuEl) this.wrapMenuEl.style.width = w + 'px';
    },

    renderSection: function (sectionId) {
      var target = sectionId ? document.querySelector(sectionId) : null;
      var animClass = Model.getRandomAnim();

      this.pageSections.forEach(function (s) {
        s.style.display = 'none';
        s.classList.remove('page', 'rotateInUpRight', 'fadeInRight', 'fadeInUp', 'rotateInUpLeft');
      });
      this.navButtons.forEach(function (b) { b.classList.remove('menu-active'); });

      if (target) {
        target.style.display = 'block';
        target.classList.add('page', animClass);
        var link = document.querySelector('a.navbar-button[href="' + sectionId + '"]');
        if (link) link.classList.add('menu-active');
      }
    },

    renderPortfolioFilter: function (group) {
      if (!this.grid) return;
      var items = this.grid.querySelectorAll('.item');
      items.forEach(function (item) {
        var groups = [];
        try {
          var data = item.getAttribute('data-groups');
          if (data) groups = JSON.parse(data.replace(/'/g, '"'));
        } catch (e) {}
        item.style.display = (group === 'all' || groups.indexOf(group) !== -1) ? '' : 'none';
      });
      this.filterLinks.forEach(function (a) {
        a.classList.toggle('active-filter', (a.getAttribute('data-group') || 'all') === group);
      });
    },

    renderTheme: function (color, bg) {
      if (this.sColorLink && color) {
        this.sColorLink.href = (color === 'light-green') ? 'assets/css/light-green-1.css' : 'assets/css/' + color + '.css';
      }
      document.body.classList.remove('cartografer', 'dark-wood', 'defolt-bg-light-green', 'defolt-bg-green');
      if (bg) document.body.classList.add(bg);
    },

    renderCarouselSlide: function (index) {
      if (!this.clientCarousel) return;
      var items = this.clientCarousel.querySelectorAll('.carousel-item');
      var total = items.length;
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      Model.setCarouselIndex(index);
      items.forEach(function (item, i) { item.classList.toggle('active', i === index); });
    },

    scrollToTop: function () { window.scrollTo(0, 0); },

    getGalleryModal: function () {
      if (this.modalContainer) return this.modalContainer;
      this.modalContainer = document.createElement('div');
      this.modalContainer.id = 'galleryModal';
      this.modalContainer.className = 'gallery-modal';
      this.modalContainer.innerHTML =
        '<div class="gallery-modal-backdrop"></div>' +
        '<div class="gallery-modal-content">' +
        '  <button type="button" class="gallery-modal-close" aria-label="Cerrar">&times;</button>' +
        '  <div class="gallery-modal-body">' +
        '    <button type="button" class="gallery-modal-prev" aria-label="Anterior">&lsaquo;</button>' +
        '    <div class="gallery-modal-slide"></div>' +
        '    <button type="button" class="gallery-modal-next" aria-label="Siguiente">&rsaquo;</button>' +
        '  </div>' +
        '  <div class="gallery-modal-counter"></div>' +
        '</div>';
      document.body.appendChild(this.modalContainer);
      return this.modalContainer;
    },

    renderGallerySlide: function (slideEl, counterEl, images, index) {
      if (!slideEl || !images || !images.length) return;
      slideEl.innerHTML = '';
      var src = images[index];
      if (src.endsWith('.mp4')) {
        var video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.className = 'gallery-media';
        slideEl.appendChild(video);
      } else {
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Imagen ' + (index + 1);
        img.className = 'gallery-media';
        slideEl.appendChild(img);
      }
      if (counterEl) counterEl.textContent = (index + 1) + ' / ' + images.length;
    },

    openGallery: function (images) {
      if (!images || !images.length) return;
      Model.gallery = { images: images, index: 0 };
      var modal = this.getGalleryModal();
      var slideEl = modal.querySelector('.gallery-modal-slide');
      var counterEl = modal.querySelector('.gallery-modal-counter');
      var self = this;

      function render() {
        self.renderGallerySlide(slideEl, counterEl, Model.gallery.images, Model.gallery.index);
      }
      function next() {
        Model.gallery.index = (Model.gallery.index + 1) % Model.gallery.images.length;
        render();
      }
      function prev() {
        Model.gallery.index = Model.gallery.index === 0 ? Model.gallery.images.length - 1 : Model.gallery.index - 1;
        render();
      }
      function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
      }

      modal.querySelector('.gallery-modal-prev').onclick = prev;
      modal.querySelector('.gallery-modal-next').onclick = next;
      if (modal.querySelector('.gallery-modal-backdrop')) modal.querySelector('.gallery-modal-backdrop').onclick = closeModal;
      if (modal.querySelector('.gallery-modal-close')) modal.querySelector('.gallery-modal-close').onclick = closeModal;

      function keyHandler(e) {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', keyHandler); }
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }
      document.addEventListener('keydown', keyHandler);

      render();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
    },

    renderTab: function (tabPaneId) {
      document.querySelectorAll('.nav-tabs .nav-link').forEach(function (t) {
        t.classList.toggle('active', (t.getAttribute('href') || '') === tabPaneId);
        t.setAttribute('aria-selected', t.classList.contains('active'));
      });
      document.querySelectorAll('.tab-pane').forEach(function (p) {
        p.classList.toggle('show', p.id === (tabPaneId || '').replace('#', ''));
        p.classList.toggle('active', p.id === (tabPaneId || '').replace('#', ''));
      });
    },

    toggleAccordion: function (targetId) {
      var el = document.querySelector(targetId);
      if (el) el.classList.toggle('show');
    }
  };

  // ==================== CONTROLLER ====================
  var Controller = {
    init: function () {
      View.initRefs();
      this._preloader();
      this._menu();
      this._sections();
      this._portfolio();
      this._theme();
      this._tabs();
      this._accordion();
      this._carousel();
      this._gallery();
      this._resize();
    },

    _preloader: function () {
      setTimeout(function () {
        View.hidePreloader();
      }, 1000);
    },

    _menu: function () {
      var iconBurger = document.getElementById('icon-burger-menu');
      var wrapMenu = document.querySelector('.wrap-menu');

      function closeMenu() {
        if (iconBurger) iconBurger.classList.remove('open');
        if (wrapMenu) wrapMenu.classList.remove('show-menu');
      }

      if (iconBurger) {
        iconBurger.addEventListener('click', function () {
          this.classList.toggle('open');
          if (wrapMenu) wrapMenu.classList.toggle('show-menu');
        });
      }
      View.navButtons.forEach(function (btn) { btn.addEventListener('click', closeMenu); });
      window.addEventListener('scroll', closeMenu);
    },

    _sections: function () {
      var self = this;

      function applySection(sectionId) {
        sectionId = sectionId || '#about';
        if (Model.sectionIds.indexOf(sectionId) === -1) sectionId = '#about';
        Model.setCurrentSection(sectionId);
        View.renderSection(sectionId);
        View.scrollToTop();
        if (sectionId === '#portfolio') {
          Model.setPortfolioFilter('all');
          View.renderPortfolioFilter('all');
        }
      }

      View.navButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          var href = this.getAttribute('href');
          if (href && href.indexOf('#') === 0) {
            e.preventDefault();
            applySection(href);
            window.history.pushState({}, '', href);
          }
        });
      });

      window.addEventListener('popstate', function () {
        var hash = window.location.hash || '#about';
        applySection(hash);
        if (hash === '#portfolio') View.renderPortfolioFilter(Model.getPortfolioFilter());
      });

      var hash = window.location.hash;
      if (hash && Model.sectionIds.indexOf(hash) !== -1 && document.querySelector(hash)) {
        applySection(hash);
        if (hash === '#portfolio') View.renderPortfolioFilter(Model.getPortfolioFilter());
      } else {
        applySection('#about');
        window.history.replaceState({}, '', '#about');
      }

      window.addEventListener('load', function () { View.scrollToTop(); });
    },

    _portfolio: function () {
      var self = this;
      View.filterLinks.forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var group = this.getAttribute('data-group') || 'all';
          Model.setPortfolioFilter(group);
          View.renderPortfolioFilter(group);
        });
      });
    },

    _theme: function () {
      var iconSwitch = document.querySelector('.icon-switch');
      var switchPanel = document.querySelector('.switch');

      if (iconSwitch && switchPanel) {
        iconSwitch.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          switchPanel.classList.toggle('switch-on');
        });
      }

      document.querySelectorAll('.color-change').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          var color = this.getAttribute('data-color');
          if (!color) return;
          Model.setThemeColor(color);
          var bg = Model.getBgForColor(color);
          Model.setThemeBg(bg);
          View.renderTheme(color, bg);
        });
      });

      document.querySelectorAll('.bg-change').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          var bg = this.getAttribute('data-bg');
          if (bg === 'cartografer' || bg === 'dark-wood') {
            Model.setThemeBg(bg);
            View.renderTheme(null, bg);
          }
        });
      });
    },

    _tabs: function () {
      document.querySelectorAll('.nav-tabs .nav-link').forEach(function (tab) {
        tab.addEventListener('click', function (e) {
          e.preventDefault();
          var targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') View.renderTab(targetId);
        });
      });
    },

    _accordion: function () {
      document.querySelectorAll('.btn-link[data-toggle="collapse"]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var targetId = this.getAttribute('href') || this.getAttribute('data-target');
          if (targetId) View.toggleAccordion(targetId);
        });
      });
    },

    _carousel: function () {
      if (!View.clientCarousel) return;
      var items = View.clientCarousel.querySelectorAll('.carousel-item');
      var prevBtn = View.clientCarousel.querySelector('[data-slide="prev"]');
      var nextBtn = View.clientCarousel.querySelector('[data-slide="next"]');

      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          e.preventDefault();
          View.renderCarouselSlide(Model.getCarouselIndex() - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
          e.preventDefault();
          View.renderCarouselSlide(Model.getCarouselIndex() + 1);
        });
      }
      View.renderCarouselSlide(0);
    },

    _gallery: function () {
      document.querySelectorAll('.project-gallery').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var data = this.getAttribute('data-images');
          if (!data) return;
          try {
            View.openGallery(JSON.parse(data));
          } catch (err) {
            View.openGallery([]);
          }
        });
      });
    },

    _resize: function () {
      function onResize() {
        View.setWrapMenuWidth(window.innerWidth);
      }
      onResize();
      window.addEventListener('resize', onResize);
    }
  };

  // Skillbars (solo vista: animación al entrar en viewport)
  function initSkillbars() {
    var skillbars = document.querySelectorAll('#skills .skillbar');
    skillbars.forEach(function (el) {
      var percent = el.getAttribute('data-percent') || '0%';
      var bar = el.querySelector('.skillbar-bar');
      if (!bar) return;
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              bar.style.width = percent;
              bar.style.transition = 'width 0.8s ease';
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
    });
  }
  setTimeout(initSkillbars, 500);

  // Arranque
  Controller.init();
})();
