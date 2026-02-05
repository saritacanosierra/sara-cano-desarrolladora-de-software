/**
 * Portafolio - Vanilla JavaScript (sin jQuery)
 * Funcionalidad: preloader, menú móvil, navegación por secciones, skillbars,
 * filtro portafolio, selector de tema/colores, carrusel clientes, lightbox galería,
 * pestañas (tabs) y acordeón.
 */
(function () {
  'use strict';

  // --- Preloader ---
  var preload = document.querySelector('.preload');
  if (preload) {
    preload.style.transition = 'opacity 0.5s';
    setTimeout(function () {
      preload.style.opacity = '0';
      setTimeout(function () {
        preload.style.display = 'none';
      }, 500);
    }, 1000);
  }

  // --- Menú burger (móvil) ---
  var iconBurger = document.getElementById('icon-burger-menu');
  var wrapMenu = document.querySelector('.wrap-menu');
  var navBar = document.querySelector('.nav-bar');
  var wrapMenuEl = document.querySelector('.wrap-menu');

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

  document.querySelectorAll('.navbar-button').forEach(function (btn) {
    btn.addEventListener('click', closeMenu);
  });

  window.addEventListener('scroll', closeMenu);

  // --- Barra móvil ancho completo ---
  function setWrapMenuWidth() {
    var w = window.innerWidth;
    if (wrapMenuEl) wrapMenuEl.style.width = w + 'px';
  }
  setWrapMenuWidth();
  window.addEventListener('resize', setWrapMenuWidth);

  // --- Skillbars (animar al entrar en viewport) ---
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

  // --- Filtro portafolio ---
  var grid = document.getElementById('grid');
  var filterLinks = document.querySelectorAll('#filter a');

  function filterPortfolio(group) {
    if (!grid) return;
    var items = grid.querySelectorAll('.item');
    items.forEach(function (item) {
      var groups = [];
      try {
        var data = item.getAttribute('data-groups');
        if (data) groups = JSON.parse(data.replace(/'/g, '"'));
      } catch (e) {}
      var show = group === 'all' || groups.indexOf(group) !== -1;
      item.style.display = show ? '' : 'none';
    });
  }

  if (filterLinks.length) {
    filterLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        filterLinks.forEach(function (x) { x.classList.remove('active-filter'); });
        this.classList.add('active-filter');
        var group = this.getAttribute('data-group') || 'all';
        filterPortfolio(group);
      });
    });
  }

  // --- Navegación por secciones (hash + history) ---
  var pageSections = document.querySelectorAll('.page-sctn');
  var navButtons = document.querySelectorAll('.navbar-button');
  var animClasses = ['rotateInUpRight', 'fadeInRight', 'fadeInUp', 'rotateInUpLeft'];

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function getRandomAnim() {
    return animClasses[Math.floor(Math.random() * animClasses.length)];
  }

  function showSection(sectionId) {
    var target = sectionId ? document.querySelector(sectionId) : null;

    // Ocultar todas las secciones y quitar clases de animación
    pageSections.forEach(function (s) {
      s.style.display = 'none';
      s.classList.remove('page');
      s.classList.remove('rotateInUpRight', 'fadeInRight', 'fadeInUp', 'rotateInUpLeft');
    });
    navButtons.forEach(function (b) { b.classList.remove('menu-active'); });

    // Mostrar solo la sección activa
    if (target) {
      target.style.display = 'block';
      target.classList.add('page', getRandomAnim());
      var link = document.querySelector('a.navbar-button[href="' + sectionId + '"]');
      if (link) link.classList.add('menu-active');
    }

    if (sectionId === '#portfolio') {
      var allFilter = document.querySelector('#filter a[data-group="all"]');
      if (allFilter) {
        filterLinks.forEach(function (x) { x.classList.remove('active-filter'); });
        allFilter.classList.add('active-filter');
        filterPortfolio('all');
      }
    }
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.indexOf('#') === 0) {
        e.preventDefault();
        closeMenu();
        showSection(href);
        window.history.pushState({}, '', href);
        scrollToTop();
      }
    });
  });

  window.addEventListener('popstate', function () {
    var hash = window.location.hash || '#about';
    showSection(hash);
    if (hash === '#portfolio') {
      var allFilter = document.querySelector('#filter a[data-group="all"]');
      if (allFilter) {
        filterLinks.forEach(function (x) { x.classList.remove('active-filter'); });
        allFilter.classList.add('active-filter');
        filterPortfolio('all');
      }
    }
  });

  // Inicial: mostrar una sección al cargar
  (function initSection() {
    var hash = window.location.hash;
    var validIds = ['#about', '#resume', '#portfolio', '#contacts'];
    if (hash && validIds.indexOf(hash) !== -1 && document.querySelector(hash)) {
      showSection(hash);
      var link = document.querySelector('a.navbar-button[href="' + hash + '"]');
      if (link) link.classList.add('menu-active');
    } else {
      showSection('#about');
      var aboutLink = document.querySelector('a.navbar-button[href="#about"]');
      if (aboutLink) aboutLink.classList.add('menu-active');
      window.history.replaceState({}, '', '#about');
    }
  })();

  window.addEventListener('load', scrollToTop);

  // --- Theme / colores y fondos ---
  var iconSwitch = document.querySelector('.icon-switch');
  var switchPanel = document.querySelector('.switch');
  var sColorLink = document.querySelector('link.s-color');

  function openSwitchPanel(e) {
    e.preventDefault();
    e.stopPropagation();
    if (switchPanel) switchPanel.classList.toggle('switch-on');
  }

  if (iconSwitch) {
    iconSwitch.addEventListener('click', openSwitchPanel);
  }

  // Quitar todas las clases de fondo del body
  function clearBodyBg() {
    document.body.classList.remove('cartografer', 'dark-wood', 'defolt-bg-light-green', 'defolt-bg-green');
  }

  document.querySelectorAll('.color-change').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var color = this.getAttribute('data-color');
      if (!color) return;
      // Cambiar la hoja de estilos de tema (colores de acento)
      if (sColorLink) {
        var href = (color === 'light-green') ? 'assets/css/light-green-1.css' : 'assets/css/' + color + '.css';
        sColorLink.href = href;
      }
      clearBodyBg();
      switch (color) {
        case 'light-green':
        case 'green':
        case 'red':
          document.body.classList.add('dark-wood');
          break;
        case 'cafe':
        case 'orange':
        case 'yellow':
          document.body.classList.add('cartografer');
          break;
      }
    });
  });

  document.querySelectorAll('.bg-change').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var bg = this.getAttribute('data-bg');
      clearBodyBg();
      if (bg === 'cartografer' || bg === 'dark-wood') {
        document.body.classList.add(bg);
      }
    });
  });

  // --- Tabs (Servicios) ---
  document.querySelectorAll('.nav-tabs .nav-link').forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      document.querySelectorAll('.nav-tabs .nav-link').forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-pane').forEach(function (p) {
        p.classList.remove('show', 'active');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      var pane = document.querySelector(targetId);
      if (pane) {
        pane.classList.add('show', 'active');
      }
    });
  });

  // --- Acordeón (móvil) ---
  document.querySelectorAll('.btn-link[data-toggle="collapse"]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href') || this.getAttribute('data-target');
      if (!targetId) return;
      var collapse = document.querySelector(targetId);
      if (collapse) {
        collapse.classList.toggle('show');
      }
    });
  });

  // --- Carrusel de clientes (vanilla) ---
  var clientCarousel = document.getElementById('clientCarousel');
  if (clientCarousel) {
    var items = clientCarousel.querySelectorAll('.carousel-item');
    var prevBtn = clientCarousel.querySelector('[data-slide="prev"]');
    var nextBtn = clientCarousel.querySelector('[data-slide="next"]');
    var total = items.length;
    var current = 0;

    function goToSlide(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      items.forEach(function (item, i) {
        item.classList.toggle('active', i === current);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToSlide(current - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToSlide(current + 1);
      });
    }
    goToSlide(0);
  }

  // --- Lightbox / galería de proyectos ---
  var projectGalleryLinks = document.querySelectorAll('.project-gallery');
  var modalContainer = null;

  function createModal() {
    if (modalContainer) return modalContainer;
    modalContainer = document.createElement('div');
    modalContainer.id = 'galleryModal';
    modalContainer.className = 'gallery-modal';
    modalContainer.innerHTML =
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
    document.body.appendChild(modalContainer);

    var backdrop = modalContainer.querySelector('.gallery-modal-backdrop');
    var closeBtn = modalContainer.querySelector('.gallery-modal-close');
    var prevBtn = modalContainer.querySelector('.gallery-modal-prev');
    var nextBtn = modalContainer.querySelector('.gallery-modal-next');

    function closeModal() {
      modalContainer.classList.remove('open');
      document.body.style.overflow = '';
      document.body.style.overflowX = '';
    }

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modalContainer._prevBtn = prevBtn;
    modalContainer._nextBtn = nextBtn;
    modalContainer._close = closeModal;
    return modalContainer;
  }

  function openGallery(images) {
    if (!images || !images.length) return;
    var modal = createModal();
    var slideEl = modal.querySelector('.gallery-modal-slide');
    var counterEl = modal.querySelector('.gallery-modal-counter');
    var prevBtn = modal._prevBtn;
    var nextBtn = modal._nextBtn;
    var close = modal._close;

    var index = 0;

    function renderSlide() {
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
    }

    function next() {
      index = (index + 1) % images.length;
      renderSlide();
    }
    function prev() {
      index = index === 0 ? images.length - 1 : index - 1;
      renderSlide();
    }

    prevBtn.onclick = prev;
    nextBtn.onclick = next;

    document.addEventListener('keydown', function keyHandler(e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', keyHandler);
      }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    index = 0;
    renderSlide();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.style.overflowX = 'hidden';
  }

  projectGalleryLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var data = this.getAttribute('data-images');
      if (!data) return;
      var images;
      try {
        images = JSON.parse(data);
      } catch (err) {
        images = [];
      }
      openGallery(images);
    });
  });
})();
