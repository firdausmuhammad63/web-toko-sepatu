// js/gallery.js
// Advanced gallery + filter integration
class Gallery {
  constructor(selector) {
    this.gallery = document.querySelector(selector);
    this.allElements = [];
    this.items = []; // currently visible items (data used in modal)
    this.currentIndex = 0;
    this.modal = null;

    if (this.gallery) {
      this.init();
    } else {
      console.warn("Gallery: selector not found:", selector);
    }
  }

  init() {
    // collect all item elements (regardless of current filter)
    this.allElements = Array.from(this.gallery.querySelectorAll('[data-gallery-item]'));
    this.createModal();
    this.bindEvents();
    this.setupKeyboardNavigation();
    this.setupTouchNavigation();

    // build visible items initially
    this.rebuildItems();
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'gallery-modal fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 hidden';
    this.modal.innerHTML = `
      <div class="relative max-w-7xl max-h-full p-4">
        <img class="gallery-modal-image max-w-full max-h-full object-contain rounded-lg" src="" alt="">
        <button class="gallery-close absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10">
          <i class="fas fa-times"></i>
        </button>
        <button class="gallery-prev absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 z-10">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="gallery-next absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 z-10">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="gallery-info absolute bottom-4 left-4 right-4 text-white text-center">
          <div class="gallery-title text-lg font-semibold mb-2"></div>
          <div class="gallery-counter text-sm opacity-75"></div>
        </div>
        <div class="gallery-loading absolute inset-0 flex items-center justify-center" style="display:none">
          <i class="fas fa-spinner fa-spin text-white text-3xl"></i>
        </div>
      </div>
    `;
    document.body.appendChild(this.modal);

    this.modalImage = this.modal.querySelector('.gallery-modal-image');
    this.modalTitle = this.modal.querySelector('.gallery-title');
    this.modalCounter = this.modal.querySelector('.gallery-counter');
    this.modalLoading = this.modal.querySelector('.gallery-loading');
    this.closeButton = this.modal.querySelector('.gallery-close');
    this.prevButton = this.modal.querySelector('.gallery-prev');
    this.nextButton = this.modal.querySelector('.gallery-next');

    // image load handler
    this.modalImage.addEventListener('load', () => {
      this.modalLoading.style.display = 'none';
    });
  }

  bindEvents() {
    // click handlers: open modal for the clicked element (use allElements)
    this.allElements.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModalByElement(el);
      });
    });

    // modal controls
    if (this.closeButton) this.closeButton.addEventListener('click', () => this.closeModal());
    if (this.prevButton) this.prevButton.addEventListener('click', () => this.prevImage());
    if (this.nextButton) this.nextButton.addEventListener('click', () => this.nextImage());

    // backdrop click closes
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  rebuildItems() {
    // build items array from currently visible elements
    this.items = this.allElements.filter(el => {
      // visible if not display: none and in DOM flow
      return el.offsetParent !== null && window.getComputedStyle(el).display !== 'none';
    }).map((item, idx) => {
      const img = item.querySelector('img');
      const title = item.dataset.galleryTitle || item.querySelector('p')?.textContent?.trim() || img?.alt || `Image ${idx+1}`;
      return {
        element: item,
        src: img?.src || '',
        largeSrc: img?.dataset.largeSrc || img?.getAttribute('data-large-src') || (img?.src?.replace('w=400','w=1200')) || img?.src || '',
        title
      };
    });

    // ensure currentIndex in range
    if (this.currentIndex >= this.items.length) {
      this.currentIndex = 0;
    }
  }

  openModalByElement(el) {
    // rebuild items then find index of clicked element among visible items
    this.rebuildItems();
    const idx = this.items.findIndex(it => it.element === el);
    if (idx !== -1) {
      this.openModal(idx);
    }
  }

  openModal(index) {
    if (!this.items.length) return;
    this.currentIndex = index;
    this.showImage();
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // fade in
    this.modal.style.opacity = '0';
    setTimeout(() => {
      this.modal.style.transition = 'opacity 0.25s ease';
      this.modal.style.opacity = '1';
    }, 10);
  }

  closeModal() {
    this.modal.style.opacity = '0';
    setTimeout(() => {
      this.modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 250);
  }

  showImage() {
    if (!this.items.length) return;
    const item = this.items[this.currentIndex];
    this.modalLoading.style.display = 'flex';
    this.modalImage.src = ''; // reset to force load
    // small delay to ensure loading spinner visible on slow connections
    setTimeout(() => {
      this.modalImage.src = item.largeSrc || item.src;
    }, 10);
    this.modalTitle.textContent = item.title || '';
    this.modalCounter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;

    // update nav visibility
    if (this.items.length > 1) {
      this.prevButton.style.display = 'block';
      this.nextButton.style.display = 'block';
    } else {
      this.prevButton.style.display = 'none';
      this.nextButton.style.display = 'none';
    }
  }

  nextImage() {
    if (!this.items.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.showImage();
  }

  prevImage() {
    if (!this.items.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.showImage();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (this.modal.classList.contains('hidden')) return;
      if (e.key === 'Escape') this.closeModal();
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    });
  }

  setupTouchNavigation() {
    let startX = 0;
    let startY = 0;
    this.modalImage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    this.modalImage.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) this.nextImage(); else this.prevImage();
      }
    });
  }
}

// Init + filter wiring
document.addEventListener('DOMContentLoaded', () => {
  console.log("gallery.js loaded");
  const gallery = new Gallery('#main-gallery');

  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const countEl = document.getElementById('gallery-count');

  // helper
  function setActiveFilterButton(activeBtn) {
    filterButtons.forEach(b => {
      b.classList.remove('bg-red-600','text-white');
      b.classList.add('bg-gray-200','text-gray-700');
    });
    if (activeBtn) {
      activeBtn.classList.add('bg-red-600','text-white');
      activeBtn.classList.remove('bg-gray-200','text-gray-700');
    }
  }

  function isVisible(el) {
    return el.offsetParent !== null && window.getComputedStyle(el).display !== 'none';
  }

  function updateCount() {
    const total = gallery.allElements.length;
    const visible = gallery.allElements.filter(isVisible).length;
    if (countEl) countEl.textContent = `Menampilkan ${visible} dari ${total}`;
  }

  // initial state
  updateCount();

  // wire filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      // toggle items
      gallery.allElements.forEach(el => {
        const cat = el.dataset.category || '';
        if (filter === 'all' || cat === filter) {
          el.style.display = ''; // show (let CSS handle grid item)
        } else {
          el.style.display = 'none';
        }
      });

      // after toggling, rebuild internal items and update count
      gallery.rebuildItems();
      updateCount();

      // update active class
      setActiveFilterButton(btn);
    });
  });

  // ensure gallery rebuild if layout changes (optional)
  window.addEventListener('resize', () => {
    gallery.rebuildItems();
    updateCount();
  });
});
