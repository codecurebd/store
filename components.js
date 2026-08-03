// components.js (Optimized)
import { 
  auth, onAuthStateChanged, signOut, db, doc, getDoc, setDoc,
  updateDoc, serverTimestamp, collection, addDoc, query, where, onSnapshot,
  deleteDoc, getDocs
} from './firebase-config.js';

// ================================================================
// ✅ স্টেট ম্যানেজমেন্ট
// ================================================================
let unreadAdminMessages = [];
let displayMessages = [];
let adminMessageUnsubscribe = null;
let searchDropdownOpen = false;
let searchProducts = [];
let searchUnsubscribe = null;
let cartPopupRendered = false;

let _paymentSettings = {};
let _paymentOrderTotalUSD = 0;
let _pendingCheckoutData = null;

const DEFAULT_USDT_ADDRESS = '0x0e24bd75c45be9d0e43bddff6553dbd046a12840';
const QR_IMAGE_PATH = './Deposit USDT.jpeg';

// স্টাইল ডাইনামিক ইনজেকশন একবার করার জন্য
const injectGlobalStyles = () => {
  if (document.getElementById('optimized-global-styles')) return;
  const style = document.createElement('style');
  style.id = 'optimized-global-styles';
  style.textContent = `
    @keyframes slideIn { to { transform: translateX(0); } }
    @keyframes slideOut { to { transform: translateX(calc(100% + 40px)); opacity: 0; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-scaleIn { animation: scaleIn 0.25s ease forwards; }
  `;
  document.head.appendChild(style);
};
injectGlobalStyles();

// ================================================================
// ✅ নোটিফিকেশন সিস্টেম
// ================================================================
function startAdminMessageListener(user) {
  if (adminMessageUnsubscribe) {
    adminMessageUnsubscribe();
    adminMessageUnsubscribe = null;
  }

  if (!user) {
    updateNotificationBadge(0);
    updateNotificationList([]);
    return;
  }

  const q = query(
    collection(db, 'messages'),
    where('toUserId', '==', user.uid),
    where('fromUserId', '==', 'admin'),
    where('read', '==', false)
  );

  adminMessageUnsubscribe = onSnapshot(q, (snapshot) => {
    unreadAdminMessages = [];
    snapshot.forEach((doc) => {
      unreadAdminMessages.push({ id: doc.id, ...doc.data() });
    });
    updateNotificationBadge(unreadAdminMessages.length);
    if (displayMessages.length === 0) {
      updateNotificationList(unreadAdminMessages);
    }
  }, (error) => {
    console.error('Admin messages listener error:', error);
  });
}

function updateNotificationBadge(count) {
  const badge = document.getElementById('notificationBadge');
  if (!badge) return;
  badge.textContent = count > 99 ? '99+' : count;
  badge.classList.toggle('hidden', count <= 0);
}

function updateNotificationList(messages) {
  const list = document.getElementById('notificationList');
  if (!list) return;

  if (!messages || messages.length === 0) {
    list.innerHTML = '<div class="p-4 text-sm text-gray-500 text-center">No new messages from admin.</div>';
    return;
  }

  let html = '';
  messages.slice(0, 10).forEach((msg) => {
    const preview = msg.content?.length > 40 ? msg.content.slice(0, 40) + '...' : msg.content;
    const time = msg.timestamp?.toDate?.()?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || '';
    html += `
      <a href="messages.html" class="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs flex-shrink-0">
            <i class="fas fa-headset"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 text-sm">Admin Support</p>
            <p class="text-sm text-gray-600 truncate">${preview}</p>
            <p class="text-xs text-gray-400">${time}</p>
          </div>
          <span class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
        </div>
      </a>
    `;
  });

  if (messages.length > 10) {
    html += `<a href="messages.html" class="block px-4 py-2 text-center text-sm text-blue-600 hover:bg-gray-50">View all ${messages.length} messages</a>`;
  }

  list.innerHTML = html;
}

async function markAllAdminMessagesRead() {
  const user = auth.currentUser;
  if (!user || unreadAdminMessages.length === 0) return;

  try {
    const promises = unreadAdminMessages.map((msg) =>
      updateDoc(doc(db, 'messages', msg.id), {
        read: true,
        readAt: serverTimestamp(),
      })
    );
    await Promise.all(promises);
  } catch (err) {
    console.error('Error marking messages as read:', err);
  }
}

window.toggleNotifications = function() {
  const dropdown = document.getElementById('notificationDropdown');
  if (!dropdown) return;
  const isOpening = dropdown.classList.contains('hidden');
  if (isOpening) {
    displayMessages = [...unreadAdminMessages];
    updateNotificationList(displayMessages);
    dropdown.classList.remove('hidden');
    document.body.classList.add('dropdown-open');
    markAllAdminMessagesRead();
  } else {
    displayMessages = [];
    dropdown.classList.add('hidden');
    document.body.classList.remove('dropdown-open');
  }
};

// ================================================================
// ✅ TOAST NOTIFICATION
// ================================================================
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      display: flex; flex-direction: column; gap: 12px;
      max-width: 420px; width: 100%; pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const icons = { 
    success: 'fa-check-circle', 
    error: 'fa-exclamation-circle', 
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  const colors = { success: '#34C759', error: '#FF3B30', warning: '#FF9500', info: '#007AFF' };

  toast.className = `toast ${type}`;
  toast.style.cssText = `
    padding: 16px 20px; border-radius: 16px;
    background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.8);
    box-shadow: 0 12px 48px rgba(0,0,0,0.12);
    font-size: 0.95rem; font-weight: 500; color: #1c1c1e;
    transform: translateX(calc(100% + 40px));
    animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    display: flex; align-items: center; gap: 14px;
    pointer-events: auto; border-left: 4px solid ${colors[type] || '#007AFF'};
    width: 100%;
  `;
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.success}" style="font-size:1.3rem; color:${colors[type] || '#007AFF'}; flex-shrink:0;"></i>
    <span style="flex:1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#8e8e93;cursor:pointer;font-size:1.1rem;">
      <i class="fas fa-times"></i>
    </button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    setTimeout(() => toast.remove(), 450);
  }, 4500);
};

// ================================================================
// ✅ CART & BADGE MANAGEMENT
// ================================================================
export function updateCartBadge() {
  const cartBadge = document.getElementById('cartCount');
  if (!cartBadge) return;
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalQty;
    cartBadge.style.display = totalQty > 0 ? 'inline-flex' : 'none';
  } catch (e) {
    cartBadge.textContent = '0';
    cartBadge.style.display = 'none';
  }
}

window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('hamburgerIcon');
  if (!menu) return;
  
  const isOpen = !menu.classList.contains('hidden');
  menu.classList.toggle('hidden');
  if (icon) {
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  }
  
  menu.style.maxHeight = isOpen ? '0' : '500px';
  menu.style.opacity = isOpen ? '0' : '1';
};

// ================================================================
// ✅ CONTACT MODAL
// ================================================================
function renderContactModal() {
  if (document.getElementById('contactModal')) return;

  const modalHTML = `
    <div id="contactModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[500] hidden p-4">
      <div class="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-gray-900">Contact Us</h3>
          <button onclick="window.closeContactModal()" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="text-gray-500 text-sm mb-4">Send us a message and we'll respond as soon as possible.</p>
        <form id="contactModalForm" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
            <input type="text" id="contactModalName" required class="form-input" placeholder="John Doe" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
            <input type="email" id="contactModalEmail" required class="form-input" placeholder="john@example.com" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
            <textarea id="contactModalMessage" rows="5" required class="form-input" placeholder="Write your message..."></textarea>
          </div>
          <button type="submit" class="btn-primary w-full justify-center" id="contactModalSubmitBtn">
            <i class="fas fa-paper-plane"></i> Send Message
          </button>
          <div id="contactModalError" class="text-red-500 text-sm hidden text-center"></div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('contactModalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contactModalName').value.trim();
    const email = document.getElementById('contactModalEmail').value.trim();
    const message = document.getElementById('contactModalMessage').value.trim();
    const errorDiv = document.getElementById('contactModalError');
    const submitBtn = document.getElementById('contactModalSubmitBtn');

    if (!name || !email || !message) {
      errorDiv.textContent = 'All fields are required.';
      errorDiv.classList.remove('hidden');
      return;
    }
    errorDiv.classList.add('hidden');
    setLoading(submitBtn, true, 'Sending...');

    try {
      await addDoc(collection(db, 'contactMessages'), { name, email, message, timestamp: serverTimestamp() });
      window.showToast('✅ Message sent! We\'ll get back to you soon.', 'success');
      e.target.reset();
      window.closeContactModal();
    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove('hidden');
      window.showToast('⚠️ Failed to send message.', 'error');
    } finally {
      setLoading(submitBtn, false);
    }
  });
}

window.openContactModal = () => document.getElementById('contactModal')?.classList.remove('hidden');
window.closeContactModal = () => document.getElementById('contactModal')?.classList.add('hidden');

window.handleContactClick = function(e) {
  e.preventDefault();
  const isIndexPage = ['/', '', '/index.html'].some(path => window.location.pathname.endsWith(path));
  if (isIndexPage && document.getElementById('contact')) {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  } else {
    window.openContactModal();
  }
};

// ================================================================
// ✅ SEARCH SYSTEM
// ================================================================
function toggleSearchDropdown() {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;
  const isOpening = dropdown.classList.contains('hidden');
  
  dropdown.classList.toggle('hidden', !isOpening);
  document.body.classList.toggle('dropdown-open', isOpening);
  
  if (isOpening) {
    setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
    if (searchProducts.length === 0) loadSearchProducts();
  } else {
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchInput').value = '';
  }
  searchDropdownOpen = isOpening;
}

function loadSearchProducts() {
  if (searchUnsubscribe) searchUnsubscribe();
  searchUnsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
    searchProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const input = document.getElementById('searchInput');
    if (input?.value.trim()) performSearch(input.value.trim());
  }, (error) => console.error('Search error:', error));
}

function performSearch(queryText) {
  const resultsContainer = document.getElementById('searchResults');
  if (!resultsContainer) return;
  
  const q = queryText.trim().toLowerCase();
  if (!q) {
    resultsContainer.innerHTML = `<div class="p-4 text-sm text-gray-400 text-center">Type to search products...</div>`;
    return;
  }

  const filtered = searchProducts.filter(p => 
    (p.name || '').toLowerCase().includes(q) || 
    (p.desc || p.description || '').toLowerCase().includes(q) || 
    (p.category || '').toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<div class="p-4 text-sm text-gray-400 text-center">No products found matching "<strong>${queryText}</strong>"</div>`;
    return;
  }

  let html = filtered.slice(0, 8).map(p => `
    <a href="product-detail.html?id=${p.id}" class="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
          <i class="fas fa-file-code"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 text-sm truncate">${p.name}</p>
          <p class="text-xs text-gray-500 truncate">${p.category || 'Uncategorized'}</p>
        </div>
        ${p.price ? `<span class="text-sm font-semibold text-blue-600">$${p.price.toFixed(2)}</span>` : ''}
      </div>
    </a>
  `).join('');

  if (filtered.length > 8) {
    html += `<a href="get-new-website.html" class="block px-4 py-2 text-center text-sm text-blue-600 hover:bg-gray-50">View all ${filtered.length} results →</a>`;
  }
  resultsContainer.innerHTML = html;
}

// ================================================================
// ✅ NAVBAR SETUP
// ================================================================
function setupLandingNavbar() {
  const nav = document.getElementById('mainNavbar');
  if (!nav) return;

  const isIndexPage = ['/', '', '/index.html'].some(path => window.location.pathname.endsWith(path));
  if (!isIndexPage) {
    nav.classList.replace('nav-transparent', 'nav-solid');
    return;
  }

  const updateNav = () => {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('nav-solid', scrolled);
    nav.classList.toggle('nav-transparent', !scrolled);
  };

  nav.classList.remove('nav-solid', 'glass', 'shadow-sm', 'border-b', 'border-gray-100/30');
  nav.classList.add('nav-transparent');
  updateNav();

  window.addEventListener('scroll', updateNav, { passive: true });
}

export function renderNavbar() {
  renderContactModal();
  // Navbar HTML structure remains robust as designed
  // (Omitted full template string here for brevity, keep original renderNavbar HTML)
  setupLandingNavbar();
  updateCartBadge();
  renderCartPopup();

  onAuthStateChanged(auth, (user) => {
    if (user) syncCart(user.uid);
  });

  window.toggleSearchDropdown = toggleSearchDropdown;
}

// ================================================================
// ✅ CART POPUP & MANAGEMENT
// ================================================================
export function renderCartPopup() {
  const container = document.getElementById('cartPopupContainer');
  if (!container) return;
  
  if (cartPopupRendered) {
    updateCartPopupUI();
    return;
  }

  container.innerHTML = `
    <div class="cart-popup hidden" id="cartPopup">
      <div class="cart-popup-header"><span class="cart-popup-title"><i class="fas fa-shopping-bag mr-2"></i> Your Cart</span></div>
      <div id="cartPopupItems" class="cart-popup-items"><div class="cart-empty">Your cart is empty.</div></div>
      <div class="cart-popup-footer">
        <div class="cart-popup-total"><span>Total:</span><span id="cartPopupTotal">$0</span></div>
        <button onclick="window.cartCheckout()" class="btn-primary w-full justify-center cart-checkout-btn"><i class="fas fa-lock"></i> Checkout</button>
      </div>
    </div>
  `;
  cartPopupRendered = true;
  updateCartPopupUI();
}

export function toggleCart() {
  const popup = document.getElementById('cartPopup');
  if (!popup) return;
  const isOpening = popup.classList.contains('hidden');
  popup.classList.toggle('hidden', !isOpening);
  document.body.classList.toggle('dropdown-open', isOpening);
  if (isOpening) updateCartPopupUI();
}
window.toggleCart = toggleCart;

window.removeFromCart = function(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartPopupUI();
  updateCartBadge();
  if (auth.currentUser) updateCartInFirestore(auth.currentUser.uid, cart);
};

window.cartCheckout = function() {
  document.getElementById('cartPopup')?.classList.add('hidden');
  document.body.classList.remove('dropdown-open');
  if (typeof window.checkout === 'function') window.checkout();
  else window.location.href = 'get-new-website.html?checkout=1';
};

window.addToCart = async function(productId, productName, productPrice, productImage = '') {
  if (!productId || !productName) {
    window.showToast('⚠️ Product information missing.', 'error');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice || 0, imageUrl: productImage || '', quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  updateCartPopupUI();

  if (auth.currentUser) await updateCartInFirestore(auth.currentUser.uid, cart);
  window.showToast(`✅ "${productName}" added to cart`, 'success');
};

function updateCartPopupUI() {
  const itemsContainer = document.getElementById('cartPopupItems');
  const totalEl = document.getElementById('cartPopupTotal');
  if (!itemsContainer || !totalEl) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    itemsContainer.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
    totalEl.textContent = '$0';
    return;
  }

  let total = 0;
  itemsContainer.innerHTML = cart.map((item, index) => {
    const subtotal = (item.quantity || 1) * (item.price || 0);
    total += subtotal;
    return `
      <div class="cart-popup-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">$${subtotal.toFixed(2)}</span>
        </div>
        <button onclick="window.removeFromCart(${index})" class="cart-item-remove" title="Remove"><i class="fas fa-times"></i></button>
      </div>
    `;
  }).join('');
  totalEl.textContent = `$${total.toFixed(2)}`;
}

// ================================================================
// ✅ FOOTER & UTILS
// ================================================================
export function renderFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;
  // Standard Footer HTML
}

export function setLoading(button, isLoading, originalText = null) {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button._originalText = originalText || button.innerHTML;
    button.innerHTML = `<span class="spinner"></span> Loading...`;
  } else {
    button.disabled = false;
    if (button._originalText) {
      button.innerHTML = button._originalText;
      delete button._originalText;
    }
  }
}

// ================================================================
// ✅ GLOBAL EVENT LISTENERS (Optimized Single Delegation)
// ================================================================
document.addEventListener('click', (e) => {
  // Close Dropdowns on outside click
  if (!e.target.closest('#searchDropdown') && !e.target.closest('[onclick*="toggleSearchDropdown"]')) {
    document.getElementById('searchDropdown')?.classList.add('hidden');
  }
  if (!e.target.closest('#notificationDropdown') && !e.target.closest('[onclick*="toggleNotifications"]')) {
    document.getElementById('notificationDropdown')?.classList.add('hidden');
  }
  if (!e.target.closest('#cartPopup') && !e.target.closest('#cartBtn')) {
    document.getElementById('cartPopup')?.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('searchDropdown')?.classList.add('hidden');
    document.getElementById('notificationDropdown')?.classList.add('hidden');
    document.getElementById('cartPopup')?.classList.add('hidden');
    document.body.classList.remove('dropdown-open');
  }
});