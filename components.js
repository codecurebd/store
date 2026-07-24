// components.js
import { 
  auth, onAuthStateChanged, signOut, db, doc, getDoc, setDoc,
  updateDoc, serverTimestamp, collection, addDoc, query, where, onSnapshot,
  deleteDoc, getDocs
} from './firebase-config.js';

// ===== টোস্ট ফাংশন =====
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 400); }, 4500);
};

// ===== কার্ট ব্যাজ =====
export function updateCartBadge() {
  const cartBadge = document.getElementById('cartCount');
  if (!cartBadge) return;
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalQty;
    cartBadge.style.display = totalQty > 0 ? 'inline' : 'none';
  } catch (e) {
    cartBadge.textContent = '0';
    cartBadge.style.display = 'none';
  }
}

// ===== মোবাইল মেনু টগল =====
window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('hamburgerIcon');
  if (menu) {
    menu.classList.toggle('hidden');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  }
};

// ===== নোটিফিকেশন টগল (ডেমো) =====
window.toggleNotifications = function() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
};

// ===== নেভবার =====
export function renderNavbar() {
  const navbarHTML = `
    <nav class="fixed top-0 left-0 w-full glass z-50 h-16 md:h-20 flex items-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        <a href="index.html" class="text-xl md:text-2xl font-bold text-gray-900">
          SWD <span class="gradient-text">Store</span>
        </a>
        
        <!-- ডেস্কটপ মেনু -->
        <div class="hidden md:flex items-center gap-6">
          <a href="index.html" class="nav-link">Home</a>
          <a href="get-new-website.html" class="nav-link">Store</a>
          <a href="fix-website.html" class="nav-link">Fix</a>
        </div>

        <div class="flex items-center gap-3 md:gap-4">
          <div class="relative">
            <a href="#" onclick="window.toggleNotifications()" class="text-gray-700 hover:text-blue-500 text-xl relative">
              <i class="fas fa-bell"></i>
              <span id="notificationDot" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full hidden"></span>
            </a>
            <div id="notificationDropdown" class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 hidden max-h-80 overflow-y-auto z-50">
              <div class="p-3 font-semibold border-b">Notifications</div>
              <div id="notificationList" class="p-2 text-sm text-gray-600">No notifications</div>
            </div>
          </div>

          <a href="messages.html" class="text-gray-700 hover:text-blue-500 text-xl" title="Messages">
            <i class="fas fa-envelope"></i>
          </a>
          <a href="#" class="cart-toggle text-gray-700 hover:text-blue-500 text-xl relative" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span id="cartCount" class="cart-badge" style="display:none;">0</span>
          </a>
          
          <div id="auth-loading" class="flex items-center gap-3">
            <div class="w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="w-24 h-10 bg-gray-200 rounded-full animate-pulse hidden md:block"></div>
          </div>

          <div id="auth-buttons" class="hidden flex items-center gap-3">
            <a href="#" onclick="window.openAuthModal('signin')" class="nav-link text-sm">Sign In</a>
            <a href="#" onclick="window.openAuthModal('signup')" class="btn-primary text-sm py-2 px-4 md:px-5">Get Started</a>
          </div>

          <div id="profile-section" class="relative hidden">
            <div class="profile-avatar" id="profileAvatar">U</div>
            <div class="dropdown-menu" id="dropdownMenu">
              <a href="my-profile.html"><i class="fas fa-user mr-2"></i> My Profile</a>
              <a href="my-orders.html"><i class="fas fa-box mr-2"></i> My Orders</a>
              <a href="my-fix-requests.html"><i class="fas fa-tools mr-2"></i> My Fix Requests</a>
              <a href="settings.html"><i class="fas fa-cog mr-2"></i> Settings</a>
              <a href="admin-panel.html" id="adminPanelLink" class="hidden" style="display:none !important;"><i class="fas fa-shield-alt mr-2"></i> Admin Panel</a>
              <a href="#" onclick="window.handleLogout()"><i class="fas fa-sign-out-alt mr-2"></i> Logout</a>
            </div>
          </div>

          <button onclick="window.toggleMobileMenu()" class="md:hidden text-gray-700 text-2xl">
            <i class="fas fa-bars" id="hamburgerIcon"></i>
          </button>
        </div>
      </div>
    </nav>
    <div id="mobileMenu" class="fixed top-16 left-0 w-full bg-white shadow-lg z-40 hidden md:hidden">
      <div class="flex flex-col p-4 gap-3">
        <a href="index.html" class="nav-link py-2">Home</a>
        <a href="get-new-website.html" class="nav-link py-2">Store</a>
        <a href="fix-website.html" class="nav-link py-2">Fix</a>
      </div>
    </div>
  `;
  document.getElementById('navbar-placeholder').innerHTML = navbarHTML;

  const avatar = document.getElementById('profileAvatar');
  const dropdown = document.getElementById('dropdownMenu');
  if (avatar) {
    avatar.addEventListener('click', () => dropdown.classList.toggle('show'));
  }
  document.addEventListener('click', (e) => {
    if (avatar && !avatar.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  const cartToggle = document.querySelector('#navbar-placeholder .cart-toggle');
  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.toggleCart === 'function') window.toggleCart();
    });
  }

  updateCartBadge();
}

// ===== ✅ নেভবার অথ আপডেট – Admin Link দেখানোর লজিক শক্তিশালী =====
export function updateNavbarAuth(user, displayName, role = null) {
  const authBtns = document.getElementById('auth-buttons');
  const profileSection = document.getElementById('profile-section');
  const loadingEl = document.getElementById('auth-loading');
  const avatar = document.getElementById('profileAvatar');
  const adminLink = document.getElementById('adminPanelLink');

  if (loadingEl) loadingEl.style.display = 'none';

  if (user) {
    if (authBtns) authBtns.classList.add('hidden');
    if (profileSection) profileSection.classList.remove('hidden');
    if (avatar) avatar.textContent = (displayName || user.email).charAt(0).toUpperCase();
    
    // ✅ Admin Link – শুধুমাত্র role === 'admin' হলে দেখাবে
    if (adminLink) {
      if (role === 'admin') {
        adminLink.classList.remove('hidden');
        adminLink.style.display = ''; // override inline style
      } else {
        adminLink.classList.add('hidden');
        adminLink.style.display = 'none !important';
      }
    }
  } else {
    if (authBtns) authBtns.classList.remove('hidden');
    if (profileSection) profileSection.classList.add('hidden');
  }
}

// ===== ফুটার =====
export function renderFooter() {
  const footerHTML = `
    <footer class="glass border-t border-gray-200/30 py-8 px-6 sm:px-8 lg:px-12 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div class="font-medium text-gray-700">&copy; 2026 SWD Store all rights reserved </div>
        <div class="flex items-center gap-4">
          <a href="https://nopqrshov.github.io/portfolio/" target="_blank" class="text-blue-600 hover:underline font-medium">Portfolio</a>
          <a href="https://github.com/shovon337" target="_blank" class="social-icon" aria-label="GitHub"><i class="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/shovon-s-mind-67aa4b260/" target="_blank" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </footer>
  `;
  document.getElementById('footer-placeholder').innerHTML = footerHTML;
}

// ===== কার্ট সাইডবার =====
export function renderCartSidebar() {
  if (document.getElementById('cartSidebar')) return;
  const html = `
    <div class="cart-overlay" id="cartOverlay" onclick="window.toggleCart()"></div>
    <div class="cart-sidebar" id="cartSidebar">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Your Cart</h2>
        <button onclick="window.toggleCart()" class="text-gray-500"><i class="fas fa-times"></i></button>
      </div>
      <div id="cartItems" class="space-y-4"></div>
      <div class="mt-6 border-t pt-4">
        <div class="flex justify-between font-bold">
          <span>Total:</span>
          <span id="cartTotal">$0</span>
        </div>
        <button onclick="window.checkout()" class="btn-primary w-full mt-4 justify-center">Proceed to Checkout</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  updateCartUI();
}

export function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

export function updateCartUI() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container || !totalEl) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
    totalEl.textContent = '$0';
  } else {
    let total = 0;
    container.innerHTML = cart.map((item, idx) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const subtotal = qty * price;
      total += subtotal;
      return `
        <div class="flex items-center gap-3 border-b pb-3">
          <img src="${item.imageUrl || 'https://via.placeholder.com/50?text=No+Img'}" alt="${item.name}" class="w-12 h-12 object-cover rounded" />
          <div class="flex-1">
            <span class="font-medium block">${item.name}</span>
            <span class="text-sm text-gray-500 block">$${price} × ${qty} = $${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="window.updateQuantity(${idx}, -1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">−</button>
            <span class="w-6 text-center font-medium">${qty}</span>
            <button onclick="window.updateQuantity(${idx}, 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">+</button>
          </div>
          <button onclick="window.removeFromCart(${idx})" class="text-red-500 ml-1"><i class="fas fa-trash"></i></button>
        </div>
      `;
    }).join('');
    totalEl.textContent = `$${total.toFixed(2)}`;
  }
  updateCartBadge();
}

window.toggleCart = toggleCart;
window.updateCartUI = updateCartUI;

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

// ===== লোডিং =====
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

// ===== পেমেন্ট মডাল =====
export function renderPaymentModal() {
  if (document.getElementById('paymentModal')) return;

  const modalHTML = `
    <div id="paymentModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[400] hidden">
      <div class="bg-white rounded-2xl p-8 max-w-lg w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-gray-900">Complete Payment</h3>
          <button onclick="window.closePaymentModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>
        <div id="paymentDetails" class="space-y-3 text-sm bg-gray-50 p-4 rounded-xl">
          <p class="font-semibold text-gray-700">Send payment to any of these:</p>
          <div id="paymentNumbers" class="space-y-2"></div>
        </div>
        <form id="paymentForm" class="mt-4 space-y-4">
          <input type="hidden" id="paymentOrderId" />
          <div>
            <label class="block text-sm font-semibold text-gray-700">Transaction ID *</label>
            <input type="text" id="transactionId" placeholder="Enter your payment transaction ID" required class="form-input" />
          </div>
          <button type="submit" class="btn-primary w-full justify-center">
            <i class="fas fa-check"></i> Confirm Payment
          </button>
          <div id="paymentError" class="text-red-500 text-sm hidden"></div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const orderId = document.getElementById('paymentOrderId').value;
      const txnId = document.getElementById('transactionId').value.trim();
      const errorDiv = document.getElementById('paymentError');
      errorDiv.classList.add('hidden');

      if (!orderId) {
        errorDiv.textContent = '❌ Order not found. Please try again.';
        errorDiv.classList.remove('hidden');
        window.showToast('Order not found. Please refresh and try again.', 'error');
        return;
      }

      if (!txnId) {
        errorDiv.textContent = 'Please enter transaction ID.';
        errorDiv.classList.remove('hidden');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        errorDiv.textContent = 'You are not logged in.';
        errorDiv.classList.remove('hidden');
        return;
      }

      const btn = paymentForm.querySelector('button[type="submit"]');
      setLoading(btn, true, 'Confirm Payment');
      try {
        // ✅ এই `updateDoc` কলটি Rules-এর সাথে সামঞ্জস্যপূর্ণ
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
        console.error('Payment update error:', err);
        errorDiv.textContent = '⚠️ ' + err.message;
        errorDiv.classList.remove('hidden');
        window.showToast('⚠️ ' + err.message, 'error');
      } finally {
        setLoading(btn, false);
      }
    });
  }
}

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
  if (settings.bkash) html += `<p><i class="fas fa-mobile-alt text-blue-500"></i> BKash: <strong>${settings.bkash}</strong></p>`;
  if (settings.nagad) html += `<p><i class="fas fa-mobile-alt text-orange-500"></i> Nagad: <strong>${settings.nagad}</strong></p>`;
  if (settings.usdt) html += `<p><i class="fab fa-bitcoin text-yellow-500"></i> USDT (BEP20): <strong>${settings.usdt}</strong></p>`;
  if (settings.rocket) html += `<p><i class="fas fa-mobile-alt text-red-500"></i> Rocket: <strong>${settings.rocket}</strong></p>`;
  if (!html) html = '<p class="text-gray-500">Payment methods not set. Contact admin.</p>';
  
  numbersDiv.innerHTML = html;
  document.getElementById('paymentModal').classList.remove('hidden');
  document.getElementById('paymentError').classList.add('hidden');
  document.getElementById('transactionId').value = '';
};

window.closePaymentModal = function() {
  document.getElementById('paymentModal').classList.add('hidden');
};

// ===== চেকআউট =====
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