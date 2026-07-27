// components.js
import { 
  auth, onAuthStateChanged, signOut, db, doc, getDoc, setDoc,
  updateDoc, serverTimestamp, collection, addDoc, query, where, onSnapshot,
  deleteDoc, getDocs
} from './firebase-config.js';

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
  const colors = {
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF'
  };

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

const toastStyles = document.createElement('style');
toastStyles.textContent = `
  @keyframes slideIn {
    to { transform: translateX(0); }
  }
  @keyframes slideOut {
    to { transform: translateX(calc(100% + 40px)); opacity: 0; }
  }
`;
document.head.appendChild(toastStyles);

// ================================================================
// ✅ CART BADGE
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

// ================================================================
// ✅ MOBILE MENU TOGGLE
// ================================================================
window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('hamburgerIcon');
  if (menu) {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
    if (!isOpen) {
      menu.style.maxHeight = '0';
      menu.style.opacity = '0';
      setTimeout(() => {
        menu.style.maxHeight = '500px';
        menu.style.opacity = '1';
      }, 10);
    } else {
      menu.style.maxHeight = '0';
      menu.style.opacity = '0';
    }
  }
};

// ================================================================
// ✅ NOTIFICATION TOGGLE
// ================================================================
window.toggleNotifications = function() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
    if (!dropdown.classList.contains('hidden')) {
      dropdown.style.animation = 'dropdownFade 0.2s ease';
    }
  }
};

// ================================================================
// ✅ NAVBAR (Professional – উইশলিস্ট বাদ)
// ================================================================
export function renderNavbar() {
  const navbarHTML = `
    <nav class="fixed top-0 left-0 w-full glass z-50 h-[72px] md:h-[80px] flex items-center px-4 sm:px-8 lg:px-12 shadow-sm border-b border-gray-100/30">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        <!-- Logo -->
        <a href="index.html" class="flex items-center gap-2.5 text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">
          <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <i class="fas fa-store text-sm"></i>
          </span>
          <span class="tracking-tight">SWD <span class="gradient-text">Store</span></span>
        </a>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-1 lg:gap-2">
          <a href="index.html" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50">Home</a>
          <a href="get-new-website.html" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50">Store</a>
          <a href="fix-website.html" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50">Fix</a>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 md:gap-3">
          <!-- Notifications -->
          <div class="relative">
            <button onclick="window.toggleNotifications()" class="w-10 h-10 rounded-full hover:bg-gray-100/60 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors text-lg relative">
              <i class="fas fa-bell"></i>
              <span id="notificationDot" class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full hidden"></span>
            </button>
            <div id="notificationDropdown" class="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 hidden max-h-80 overflow-y-auto z-50">
              <div class="p-4 font-semibold border-b text-gray-900">Notifications</div>
              <div id="notificationList" class="p-4 text-sm text-gray-500">No notifications</div>
            </div>
          </div>

          <!-- Messages -->
          <a href="messages.html" class="w-10 h-10 rounded-full hover:bg-gray-100/60 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors text-lg" title="Messages">
            <i class="fas fa-envelope"></i>
          </a>

          <!-- Cart -->
          <button onclick="window.toggleCart()" class="w-10 h-10 rounded-full hover:bg-gray-100/60 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors text-lg relative" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span id="cartCount" class="cart-badge" style="display:none;">0</span>
          </button>
          
          <!-- Auth Loading -->
          <div id="auth-loading" class="flex items-center gap-2">
            <div class="w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="w-24 h-10 bg-gray-200 rounded-full animate-pulse hidden md:block"></div>
          </div>

          <!-- Auth Buttons -->
          <div id="auth-buttons" class="hidden flex items-center gap-2">
            <button onclick="window.openAuthModal('signin')" class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50/50">Sign In</button>
            <button onclick="window.openAuthModal('signup')" class="btn-primary text-sm py-2.5 px-5 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30">
              <i class="fas fa-rocket text-xs"></i> Get Started
            </button>
          </div>

          <!-- Profile -->
          <div id="profile-section" class="relative hidden">
            <button class="profile-avatar w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center hover:scale-105 transition-transform shadow-md shadow-blue-500/20" id="profileAvatar">U</button>
            <div class="dropdown-menu" id="dropdownMenu">
              <a href="my-profile.html" class="hover:bg-blue-50/50"><i class="fas fa-user mr-3 text-gray-400"></i> My Profile</a>
              <a href="my-orders.html" class="hover:bg-blue-50/50"><i class="fas fa-box mr-3 text-gray-400"></i> My Orders</a>
              <a href="my-fix-requests.html" class="hover:bg-blue-50/50"><i class="fas fa-tools mr-3 text-gray-400"></i> Fix Requests</a>
              <a href="settings.html" class="hover:bg-blue-50/50"><i class="fas fa-cog mr-3 text-gray-400"></i> Settings</a>
              <!-- Admin Panel – only visible to admin -->
              <a href="admin-panel.html" id="adminPanelLink" class="hidden hover:bg-blue-50/50"><i class="fas fa-shield-alt mr-3 text-blue-500"></i> Admin Panel</a>
              <hr class="my-1 border-gray-100" />
              <a href="#" onclick="window.handleLogout()" class="text-red-500 hover:bg-red-50/50"><i class="fas fa-sign-out-alt mr-3 text-red-400"></i> Logout</a>
            </div>
          </div>

          <!-- Hamburger -->
          <button onclick="window.toggleMobileMenu()" class="md:hidden w-10 h-10 rounded-full hover:bg-gray-100/60 flex items-center justify-center text-gray-700 text-2xl transition-colors" aria-label="Toggle menu">
            <i class="fas fa-bars" id="hamburgerIcon"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu (উইশলিস্ট বাদ) -->
    <div id="mobileMenu" class="fixed top-[72px] md:top-[80px] left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg z-40 hidden md:hidden overflow-hidden transition-all duration-300 border-b border-gray-100/30" style="max-height:0; opacity:0;">
      <div class="flex flex-col p-4 gap-1">
        <a href="index.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors">Home</a>
        <a href="get-new-website.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors">Store</a>
        <a href="fix-website.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors">Fix</a>
        <hr class="my-2 border-gray-100" />
        <a href="my-profile.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors"><i class="fas fa-user mr-3"></i> Profile</a>
        <a href="my-orders.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors"><i class="fas fa-box mr-3"></i> Orders</a>
        <a href="messages.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors"><i class="fas fa-envelope mr-3"></i> Messages</a>
        <!-- Admin Panel in mobile menu – only visible to admin -->
        <a href="admin-panel.html" id="mobileAdminPanelLink" class="hidden nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-blue-600 transition-colors"><i class="fas fa-shield-alt mr-3"></i> Admin Panel</a>
        <a href="#" onclick="window.handleLogout()" class="nav-link py-3 px-4 rounded-xl hover:bg-red-50/50 font-medium text-red-500 transition-colors"><i class="fas fa-sign-out-alt mr-3"></i> Logout</a>
      </div>
    </div>
  `;
  
  const placeholder = document.getElementById('navbar-placeholder');
  if (placeholder) {
    placeholder.innerHTML = navbarHTML;
  } else {
    console.error('❌ navbar-placeholder not found!');
  }

  // Profile dropdown toggle
  const avatar = document.getElementById('profileAvatar');
  const dropdown = document.getElementById('dropdownMenu');
  if (avatar) {
    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
  }
  document.addEventListener('click', (e) => {
    if (avatar && !avatar.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  updateCartBadge();

  // ===== কার্ট সিঙ্ক: Auth state listener =====
  onAuthStateChanged(auth, (user) => {
    if (user) {
      syncCart(user.uid);
    }
  });
}

// ================================================================
// ✅ কার্ট সিঙ্ক ফাংশন
// ================================================================
export async function syncCart(userId) {
  if (!userId) return;
  const cartRef = doc(db, 'carts', userId);
  try {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    const docSnap = await getDoc(cartRef);
    let serverCart = [];
    if (docSnap.exists()) {
      serverCart = docSnap.data().items || [];
    }
    // মার্জ: যদি localCart খালি না হয় তাহলে Firestore আপডেট করি, অন্যথায় Firestore থেকে local-এ আনা
    if (localCart.length > 0) {
      await setDoc(cartRef, { items: localCart, updatedAt: new Date().toISOString() });
    } else if (serverCart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(serverCart));
      updateCartBadge();
    }
  } catch (err) {
    console.error('Cart sync error:', err);
  }
}

export async function updateCartInFirestore(userId, cart) {
  if (!userId) return;
  const cartRef = doc(db, 'carts', userId);
  try {
    await setDoc(cartRef, { items: cart, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Firestore cart update error:', err);
  }
}

// ================================================================
// ✅ NAVBAR AUTH UPDATE – Admin Link only
// ================================================================
export function updateNavbarAuth(user, displayName, role = null) {
  const authBtns = document.getElementById('auth-buttons');
  const profileSection = document.getElementById('profile-section');
  const loadingEl = document.getElementById('auth-loading');
  const avatar = document.getElementById('profileAvatar');
  const adminLink = document.getElementById('adminPanelLink');
  const mobileAdminLink = document.getElementById('mobileAdminPanelLink');

  if (loadingEl) loadingEl.style.display = 'none';

  if (user) {
    if (authBtns) authBtns.classList.add('hidden');
    if (profileSection) profileSection.classList.remove('hidden');
    if (avatar) avatar.textContent = (displayName || user.email).charAt(0).toUpperCase();
    
    // Admin Link visibility
    const isAdmin = (role === 'admin');
    if (adminLink) {
      adminLink.style.display = isAdmin ? '' : 'none';
      adminLink.classList.toggle('hidden', !isAdmin);
    }
    if (mobileAdminLink) {
      mobileAdminLink.style.display = isAdmin ? '' : 'none';
      mobileAdminLink.classList.toggle('hidden', !isAdmin);
    }
  } else {
    if (authBtns) authBtns.classList.remove('hidden');
    if (profileSection) profileSection.classList.add('hidden');
    if (adminLink) { adminLink.style.display = 'none'; adminLink.classList.add('hidden'); }
    if (mobileAdminLink) { mobileAdminLink.style.display = 'none'; mobileAdminLink.classList.add('hidden'); }
  }
}

// ================================================================
// ✅ FOOTER
// ================================================================
export function renderFooter() {
  const footerHTML = `
    <footer class="glass border-t border-gray-200/30 py-10 px-6 sm:px-8 lg:px-12 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div class="font-medium text-gray-700">&copy; 2026 SWD Store. All rights reserved.</div>
        <div class="flex items-center gap-4">
          <a href="https://nopqrshov.github.io/portfolio/" target="_blank" class="text-blue-600 hover:underline font-medium transition-colors">Portfolio</a>
          <a href="https://github.com/shovon337" target="_blank" class="social-icon" aria-label="GitHub"><i class="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/shovon-s-mind-67aa4b260/" target="_blank" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </footer>
  `;
  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    placeholder.innerHTML = footerHTML;
  }
}

// ================================================================
// ✅ CART SIDEBAR
// ================================================================
export function renderCartSidebar() {
  if (document.getElementById('cartSidebar')) return;

  const html = `
    <div class="cart-overlay" id="cartOverlay" onclick="window.toggleCart()"></div>
    <div class="cart-sidebar" id="cartSidebar">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900">Your Cart</h2>
        <button onclick="window.toggleCart()" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors" aria-label="Close cart">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div id="cartItems" class="space-y-4 flex-1 overflow-y-auto"></div>
      <div class="mt-6 border-t pt-4">
        <div class="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span id="cartTotal" class="text-blue-600">$0</span>
        </div>
        <button onclick="window.checkout()" class="btn-primary w-full mt-4 justify-center">
          <i class="fas fa-lock"></i> Proceed to Checkout
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  updateCartUI();
}

// ================================================================
// ✅ CART TOGGLE
// ================================================================
export function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) {
    sidebar.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }
  if (overlay) overlay.classList.toggle('open');
}
window.toggleCart = toggleCart;

// ================================================================
// ✅ UPDATE CART UI (Firestore-এ সিঙ্ক সহ)
// ================================================================
export function updateCartUI() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container || !totalEl) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-400">
        <i class="fas fa-shopping-bag text-4xl mb-3 opacity-30"></i>
        <p>Your cart is empty.</p>
      </div>
    `;
    totalEl.textContent = '$0';
  } else {
    let total = 0;
    container.innerHTML = cart.map((item, idx) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const subtotal = qty * price;
      total += subtotal;
      return `
        <div class="flex items-center gap-3 border-b border-gray-100 pb-3 animate-fadeIn">
          <img src="${item.imageUrl || 'https://via.placeholder.com/50?text=No+Img'}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg" loading="lazy" />
          <div class="flex-1 min-w-0">
            <span class="font-medium block text-gray-900 truncate">${item.name}</span>
            <span class="text-sm text-gray-500 block">$${price} × ${qty} = $${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="window.updateQuantity(${idx}, -1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">−</button>
            <span class="w-6 text-center font-medium">${qty}</span>
            <button onclick="window.updateQuantity(${idx}, 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">+</button>
          </div>
          <button onclick="window.removeFromCart(${idx})" class="text-red-400 hover:text-red-600 transition-colors ml-1" aria-label="Remove item">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    }).join('');
    totalEl.textContent = `$${total.toFixed(2)}`;
  }
  updateCartBadge();

  // Firestore-এ সিঙ্ক (যদি ইউজার লগইন থাকে)
  const user = auth.currentUser;
  if (user) {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartInFirestore(user.uid, cartData);
  }
}
window.updateCartUI = updateCartUI;

// ================================================================
// ✅ CART QUANTITY UPDATE
// ================================================================
window.updateQuantity = function(index, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index]) return;
  cart[index].quantity = (cart[index].quantity || 1) + delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
};

window.removeFromCart = function(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
};

// ================================================================
// ✅ LOADING BUTTON
// ================================================================
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
// ✅ PAYMENT MODAL
// ================================================================
export function renderPaymentModal() {
  if (document.getElementById('paymentModal')) return;

  const modalHTML = `
    <div id="paymentModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[400] hidden p-4">
      <div class="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-gray-900">Complete Payment</h3>
          <button onclick="window.closePaymentModal()" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div id="paymentDetails" class="space-y-3 text-sm bg-gray-50 p-4 rounded-xl">
          <p class="font-semibold text-gray-700">Send payment to any of these:</p>
          <div id="paymentNumbers" class="space-y-2"></div>
        </div>
        <form id="paymentForm" class="mt-4 space-y-4">
          <input type="hidden" id="paymentOrderId" />
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Transaction ID *</label>
            <input type="text" id="transactionId" placeholder="Enter your payment transaction ID" required class="form-input" />
          </div>
          <button type="submit" class="btn-primary w-full justify-center">
            <i class="fas fa-check"></i> Confirm Payment
          </button>
          <div id="paymentError" class="text-red-500 text-sm hidden text-center p-3 bg-red-50 rounded-xl border border-red-200"></div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scaleIn { animation: scaleIn 0.25s ease forwards; }
  `;
  document.head.appendChild(style);

  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const orderId = document.getElementById('paymentOrderId').value;
      const txnId = document.getElementById('transactionId').value.trim();
      const errorDiv = document.getElementById('paymentError');
      errorDiv.classList.add('hidden');

      if (!orderId) {
        errorDiv.textContent = '❌ Order not found. Please refresh and try again.';
        errorDiv.classList.remove('hidden');
        window.showToast('Order not found. Please refresh.', 'error');
        return;
      }

      if (!txnId) {
        errorDiv.textContent = '⚠️ Please enter transaction ID.';
        errorDiv.classList.remove('hidden');
        document.getElementById('transactionId').classList.add('error');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        errorDiv.textContent = '⚠️ You are not logged in.';
        errorDiv.classList.remove('hidden');
        return;
      }

      const btn = paymentForm.querySelector('button[type="submit"]');
      setLoading(btn, true, 'Confirm Payment');

      try {
        await updateDoc(doc(db, 'orders', orderId), {
          transactionId: txnId,
          paymentMethod: 'Manual'
        });
        window.showToast('✅ Payment confirmed! Admin will verify soon.', 'success');
        window.closePaymentModal();
        localStorage.removeItem('cart');
        window.updateCartUI();
        if (typeof window.toggleCart === 'function') window.toggleCart();
      } catch (err) {
        console.error('Payment error:', err);
        errorDiv.textContent = '⚠️ ' + err.message;
        errorDiv.classList.remove('hidden');
        window.showToast('⚠️ ' + err.message, 'error');
      } finally {
        setLoading(btn, false);
      }
    });
  }
}

// ================================================================
// ✅ OPEN PAYMENT MODAL
// ================================================================
window.openPaymentModal = function(orderId, settings) {
  const numbersDiv = document.getElementById('paymentNumbers');
  const orderInput = document.getElementById('paymentOrderId');
  if (!numbersDiv || !orderInput) {
    console.error('Payment modal not found.');
    window.showToast('Payment system not ready. Please refresh.', 'error');
    return;
  }
  orderInput.value = orderId;

  let html = '';
  if (settings.bkash) html += `<p class="flex items-center gap-2"><i class="fas fa-mobile-alt text-blue-500 text-lg"></i> BKash: <strong>${settings.bkash}</strong></p>`;
  if (settings.nagad) html += `<p class="flex items-center gap-2"><i class="fas fa-mobile-alt text-orange-500 text-lg"></i> Nagad: <strong>${settings.nagad}</strong></p>`;
  if (settings.usdt) html += `<p class="flex items-center gap-2"><i class="fab fa-bitcoin text-yellow-500 text-lg"></i> USDT (BEP20): <strong>${settings.usdt}</strong></p>`;
  if (settings.rocket) html += `<p class="flex items-center gap-2"><i class="fas fa-mobile-alt text-red-500 text-lg"></i> Rocket: <strong>${settings.rocket}</strong></p>`;
  if (!html) html = '<p class="text-gray-500">Payment methods not set. Contact admin.</p>';
  
  numbersDiv.innerHTML = html;
  document.getElementById('paymentModal').classList.remove('hidden');
  document.getElementById('paymentError').classList.add('hidden');
  document.getElementById('transactionId').value = '';
  document.getElementById('transactionId').classList.remove('error');
};

window.closePaymentModal = function() {
  document.getElementById('paymentModal').classList.add('hidden');
};

// ================================================================
// ✅ CHECKOUT
// ================================================================
window.checkout = async function() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    window.showToast('🛒 Your cart is empty', 'warning');
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    window.showToast('⚠️ Please sign in to checkout', 'error');
    if (typeof window.openAuthModal === 'function') window.openAuthModal('signin');
    return;
  }

  const checkoutBtn = document.querySelector('#cartSidebar .btn-primary');
  if (checkoutBtn) setLoading(checkoutBtn, true, 'Proceed to Checkout');

  try {
    const settingsSnap = await getDoc(doc(db, 'settings', 'payment'));
    const settings = settingsSnap.exists() ? settingsSnap.data() : {};
    if (!settings.bkash && !settings.nagad && !settings.usdt) {
      window.showToast('⚠️ Payment methods not set. Contact admin.', 'error');
      if (checkoutBtn) setLoading(checkoutBtn, false);
      return;
    }

    const orderData = {
      userId: user.uid,
      userEmail: user.email,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        imageUrl: item.imageUrl || ''
      })),
      total: cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
      status: 'pending',
      paymentMethod: '',
      transactionId: '',
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    
    window.openPaymentModal(docRef.id, settings);
    if (checkoutBtn) setLoading(checkoutBtn, false);
  } catch (err) {
    window.showToast('⚠️ ' + err.message, 'error');
    if (checkoutBtn) setLoading(checkoutBtn, false);
  }
};