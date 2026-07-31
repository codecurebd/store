<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cart Popup Demo</title>
    <!-- Font Awesome & Google Fonts (matching your project) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz@14..32&display=swap" rel="stylesheet" />
    <style>
        /* ── Reset & Base ── */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            min-height: 100vh;
            padding-top: 80px;
        }

        /* ── Glass Navbar (matching your existing style) ── */
        .glass {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }

        /* ── Utility ── */
        .hidden {
            display: none !important;
        }

        /* ── Buttons ── */
        .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #fff;
            font-weight: 600;
            font-size: 0.9rem;
            padding: 10px 22px;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            transition: all 0.25s ease;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
        }
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        /* ── Form Inputs ── */
        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            font-size: 0.95rem;
            transition: border 0.2s, box-shadow 0.2s;
            background: #fff;
            color: #1e293b;
        }
        .form-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        .form-input.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        /* ── Cart Dropdown ── */
        .cart-dropdown {
            position: absolute;
            right: 0;
            top: calc(100% + 8px);
            width: 360px;
            max-width: 92vw;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
            z-index: 60;
            overflow: hidden;
            transform-origin: top right;
            animation: dropdownFade 0.2s ease;
        }
        .cart-dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #f1f5f9;
            font-weight: 600;
            color: #0f172a;
        }
        .cart-dropdown-header .cart-count {
            font-size: 0.8rem;
            font-weight: 400;
            color: #94a3b8;
        }
        .cart-dropdown-items {
            max-height: 320px;
            overflow-y: auto;
            padding: 4px 0;
        }
        .cart-dropdown-items::-webkit-scrollbar {
            width: 4px;
        }
        .cart-dropdown-items::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }

        .cart-item {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 20px;
            transition: background 0.15s;
            border-bottom: 1px solid #f8fafc;
        }
        .cart-item:hover {
            background: #f8fafc;
        }
        .cart-item img {
            width: 48px;
            height: 48px;
            object-fit: cover;
            border-radius: 10px;
            flex-shrink: 0;
            background: #f1f5f9;
        }
        .cart-item-info {
            flex: 1;
            min-width: 0;
        }
        .cart-item-info .name {
            font-weight: 500;
            color: #0f172a;
            font-size: 0.9rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .cart-item-info .price {
            font-size: 0.85rem;
            color: #475569;
            font-weight: 500;
        }
        .cart-item .remove-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: #94a3b8;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .cart-item .remove-btn:hover {
            background: #fee2e2;
            color: #ef4444;
        }

        .cart-dropdown-footer {
            padding: 16px 20px 20px;
            border-top: 1px solid #f1f5f9;
        }
        .cart-total-row {
            display: flex;
            justify-content: space-between;
            font-weight: 700;
            font-size: 1.05rem;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .cart-total-row .total-amount {
            color: #2563eb;
        }
        .cart-dropdown-footer .btn-primary {
            width: 100%;
            justify-content: center;
            padding: 12px;
            font-size: 0.95rem;
        }
        .cart-empty {
            padding: 36px 20px;
            text-align: center;
            color: #94a3b8;
        }
        .cart-empty i {
            font-size: 2.4rem;
            opacity: 0.3;
            margin-bottom: 8px;
            display: block;
        }

        /* ── Animations ── */
        @keyframes dropdownFade {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(-6px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        /* ── Cart Badge ── */
        .cart-badge {
            position: absolute;
            top: -2px;
            right: -4px;
            background: #ef4444;
            color: #fff;
            font-size: 0.65rem;
            font-weight: 700;
            min-width: 18px;
            height: 18px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 5px;
            box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
        }

        /* ── Toast Container ── */
        #toast-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 420px;
            width: 100%;
            pointer-events: none;
        }
        .toast {
            padding: 16px 20px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
            font-size: 0.95rem;
            font-weight: 500;
            color: #1c1c1e;
            transform: translateX(calc(100% + 40px));
            animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            display: flex;
            align-items: center;
            gap: 14px;
            pointer-events: auto;
            border-left: 4px solid #007aff;
            width: 100%;
        }
        .toast.success {
            border-left-color: #34c759;
        }
        .toast.error {
            border-left-color: #ff3b30;
        }
        .toast.warning {
            border-left-color: #ff9500;
        }

        @keyframes slideIn {
            to {
                transform: translateX(0);
            }
        }
        @keyframes slideOut {
            to {
                transform: translateX(calc(100% + 40px));
                opacity: 0;
            }
        }

        /* ── Demo page content ── */
        .demo-content {
            max-width: 800px;
            margin: 40px auto;
            padding: 0 24px;
            text-align: center;
        }
        .demo-content h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .demo-content p {
            color: #475569;
            max-width: 500px;
            margin: 0 auto 32px;
        }
        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .demo-card {
            background: #fff;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            border: 1px solid #f1f5f9;
        }
        .demo-card img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 10px;
            background: #f1f5f9;
            margin-bottom: 10px;
        }
        .demo-card h4 {
            color: #0f172a;
            font-size: 1rem;
        }
        .demo-card .price-tag {
            color: #2563eb;
            font-weight: 700;
            font-size: 1.1rem;
            margin: 4px 0 10px;
        }
        .demo-card .btn-primary {
            font-size: 0.8rem;
            padding: 8px 16px;
        }

        /* ── Navbar placeholder ── */
        #navbar-placeholder {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 50;
        }

        /* ── Responsive tweaks ── */
        @media (max-width: 480px) {
            .cart-dropdown {
                width: 92vw;
                right: 4vw;
                top: calc(100% + 6px);
            }
            .cart-item {
                padding: 10px 14px;
            }
            .cart-item img {
                width: 40px;
                height: 40px;
            }
        }
    </style>
</head>
<body>

    <!-- ─── Navbar placeholder (injected by JS) ─── -->
    <div id="navbar-placeholder"></div>

    <!-- ─── Demo content ─── -->
    <div class="demo-content">
        <h1>🛍️ Cart Popup Demo</h1>
        <p>Click the cart icon <i class="fas fa-shopping-cart"></i> in the navbar to see the new popup cart.</p>
        <div class="demo-grid" id="productGrid">
            <!-- filled by JS -->
        </div>
    </div>

    <!-- ─── Footer placeholder ─── -->
    <div id="footer-placeholder"></div>

    <!-- ─── Firebase & Auth mocks (for demo) ─── -->
    <script>
        // ── Minimal Firebase mock so the cart runs standalone ──
        const auth = {
            currentUser: { uid: 'demo-user', email: 'demo@example.com', displayName: 'Demo' },
            onAuthStateChanged: (cb) => { cb(auth.currentUser); return () => {}; }
        };
        const db = {
            collection: () => ({ doc: () => ({}) }),
            doc: () => ({}),
            getDoc: () => Promise.resolve({ exists: () => false, data: () => ({}) }),
            setDoc: () => Promise.resolve(),
            addDoc: () => Promise.resolve({ id: 'mock-order-id' }),
            updateDoc: () => Promise.resolve(),
            deleteDoc: () => Promise.resolve(),
            getDocs: () => Promise.resolve({ docs: [] }),
            query: () => ({}),
            where: () => ({}),
            onSnapshot: () => () => {},
        };
        const serverTimestamp = () => new Date().toISOString();
        const doc = (db, path, id) => ({ id, path });
        const collection = (db, name) => ({ name });
        const getDoc = db.getDoc;
        const setDoc = db.setDoc;
        const updateDoc = db.updateDoc;
        const addDoc = db.addDoc;
        const deleteDoc = db.deleteDoc;
        const getDocs = db.getDocs;
        const query = db.query;
        const where = db.where;
        const onSnapshot = db.onSnapshot;
        const signOut = () => Promise.resolve();

        // ── Load the actual components ──
        // (In a real project you'd use ES modules; here we inline the updated cart system)
    </script>

    <!-- ─── Inline the updated components.js ─── -->
    <script type="module">
        // ──────────────────────────────────────────────────────────────
        //  UPDATED CART SYSTEM — Popup dropdown, no sidebar, no quantity
        // ──────────────────────────────────────────────────────────────

        // ── Imports (mocked for demo) ──
        const {
            auth: authMock,
            onAuthStateChanged,
            signOut,
            db,
            doc,
            getDoc,
            setDoc,
            updateDoc,
            serverTimestamp,
            collection,
            addDoc,
            query,
            where,
            onSnapshot,
            deleteDoc,
            getDocs
        } = window;

        // ──────────────────────────────────────────────────────────────
        //  NOTIFICATION SYSTEM (unchanged, just referenced)
        // ──────────────────────────────────────────────────────────────
        let unreadAdminMessages = [];
        let displayMessages = [];
        let adminMessageUnsubscribe = null;

        function startAdminMessageListener(user) {
            if (adminMessageUnsubscribe) { adminMessageUnsubscribe();
                adminMessageUnsubscribe = null; }
            if (!user) { updateNotificationBadge(0);
                updateNotificationList([]); return; }
            const q = query(collection(db, 'messages'), where('toUserId', '==', user.uid), where('fromUserId', '==',
                'admin'), where('read', '==', false));
            adminMessageUnsubscribe = onSnapshot(q, (snapshot) => {
                unreadAdminMessages = [];
                snapshot.forEach((doc) => { unreadAdminMessages.push({ id: doc.id, ...doc.data() }); });
                updateNotificationBadge(unreadAdminMessages.length);
                if (displayMessages.length === 0) updateNotificationList(unreadAdminMessages);
            }, (error) => console.error('Admin messages listener error:', error));
        }

        function updateNotificationBadge(count) {
            const badge = document.getElementById('notificationBadge');
            if (!badge) return;
            if (count > 0) { badge.textContent = count > 99 ? '99+' : count;
                badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); }
        }

        function updateNotificationList(messages) {
            const list = document.getElementById('notificationList');
            if (!list) return;
            if (!messages || messages.length === 0) {
                list.innerHTML =
                '<div class="p-4 text-sm text-gray-500 text-center">No new messages from admin.</div>';
                return;
            }
            let html = '';
            messages.slice(0, 10).forEach((msg) => {
                const preview = msg.content?.length > 40 ? msg.content.slice(0, 40) + '...' : msg.content;
                const time = msg.timestamp?.toDate?.()?.toLocaleTimeString('en-US', { hour: '2-digit',
                    minute: '2-digit' }) || '';
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
                html +=
                    `<a href="messages.html" class="block px-4 py-2 text-center text-sm text-blue-600 hover:bg-gray-50">View all ${messages.length} messages</a>`;
            }
            list.innerHTML = html;
        }

        async function markAllAdminMessagesRead() {
            const user = authMock.currentUser;
            if (!user || unreadAdminMessages.length === 0) return;
            try {
                const promises = unreadAdminMessages.map((msg) =>
                    updateDoc(doc(db, 'messages', msg.id), { read: true, readAt: serverTimestamp() })
                );
                await Promise.all(promises);
            } catch (err) { console.error('Error marking messages as read:', err); }
        }

        window.toggleNotifications = function() {
            const dropdown = document.getElementById('notificationDropdown');
            if (!dropdown) return;
            const isOpening = dropdown.classList.contains('hidden');
            if (isOpening) {
                displayMessages = [...unreadAdminMessages];
                updateNotificationList(displayMessages);
                dropdown.classList.remove('hidden');
                dropdown.style.animation = 'dropdownFade 0.2s ease';
                markAllAdminMessagesRead();
            } else {
                displayMessages = [];
                dropdown.classList.add('hidden');
            }
        };

        // ──────────────────────────────────────────────────────────────
        //  TOAST (unchanged)
        // ──────────────────────────────────────────────────────────────
        window.showToast = function(message, type = 'success') {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.cssText =
                    `position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:12px;max-width:420px;width:100%;pointer-events:none;`;
                document.body.appendChild(container);
            }
            const toast = document.createElement('div');
            const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle' };
            const colors = { success: '#34C759', error: '#FF3B30', warning: '#FF9500', info: '#007AFF' };
            toast.className = `toast ${type}`;
            toast.style.cssText = `
            padding:16px 20px;border-radius:16px;
            background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);
            border:1px solid rgba(255,255,255,0.8);
            box-shadow:0 12px 48px rgba(0,0,0,0.12);
            font-size:0.95rem;font-weight:500;color:#1c1c1e;
            transform:translateX(calc(100% + 40px));
            animation:slideIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
            display:flex;align-items:center;gap:14px;
            pointer-events:auto;border-left:4px solid ${colors[type] || '#007AFF'};
            width:100%;
          `;
            toast.innerHTML = `
            <i class="fas ${icons[type] || icons.success}" style="font-size:1.3rem;color:${colors[type] || '#007AFF'};flex-shrink:0;"></i>
            <span style="flex:1;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#8e8e93;cursor:pointer;font-size:1.1rem;">
              <i class="fas fa-times"></i>
            </button>
          `;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards';
                setTimeout(() => toast.remove(), 450);
            }, 4500);
        };

        // ──────────────────────────────────────────────────────────────
        //  CART BADGE
        // ──────────────────────────────────────────────────────────────
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

        // ──────────────────────────────────────────────────────────────
        //  MOBILE MENU TOGGLE (unchanged)
        // ──────────────────────────────────────────────────────────────
        window.toggleMobileMenu = function() {
            const menu = document.getElementById('mobileMenu');
            const icon = document.getElementById('hamburgerIcon');
            if (menu) {
                const isOpen = !menu.classList.contains('hidden');
                menu.classList.toggle('hidden');
                if (icon) { icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times'); }
                if (!isOpen) {
                    menu.style.maxHeight = '0';
                    menu.style.opacity = '0';
                    setTimeout(() => { menu.style.maxHeight = '500px';
                        menu.style.opacity = '1'; }, 10);
                } else {
                    menu.style.maxHeight = '0';
                    menu.style.opacity = '0';
                }
            }
        };

        // ──────────────────────────────────────────────────────────────
        //  CONTACT MODAL (unchanged)
        // ──────────────────────────────────────────────────────────────
        function renderContactModal() {
            if (document.getElementById('contactModal')) return;
            const modalHTML = `
            <div id="contactModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[500] hidden p-4">
              <div class="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-2xl font-bold text-gray-900">Contact Us</h3>
                  <button onclick="window.closeContactModal()" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors"><i class="fas fa-times"></i></button>
                </div>
                <p class="text-gray-500 text-sm mb-4">Send us a message and we'll respond as soon as possible.</p>
                <form id="contactModalForm" class="space-y-4">
                  <div><label class="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label><input type="text" id="contactModalName" required class="form-input" placeholder="John Doe" /></div>
                  <div><label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label><input type="email" id="contactModalEmail" required class="form-input" placeholder="john@example.com" /></div>
                  <div><label class="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label><textarea id="contactModalMessage" rows="5" required class="form-input" placeholder="Write your message..."></textarea></div>
                  <button type="submit" class="btn-primary w-full justify-center" id="contactModalSubmitBtn"><i class="fas fa-paper-plane"></i> Send Message</button>
                  <div id="contactModalError" class="text-red-500 text-sm hidden text-center"></div>
                </form>
              </div>
            </div>
          `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const form = document.getElementById('contactModalForm');
            const submitBtn = document.getElementById('contactModalSubmitBtn');
            const errorDiv = document.getElementById('contactModalError');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('contactModalName').value.trim();
                const email = document.getElementById('contactModalEmail').value.trim();
                const message = document.getElementById('contactModalMessage').value.trim();
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
                    form.reset();
                    window.closeContactModal();
                } catch (err) {
                    errorDiv.textContent = err.message;
                    errorDiv.classList.remove('hidden');
                    window.showToast('⚠️ Failed to send message. Please try again.', 'error');
                } finally { setLoading(submitBtn, false); }
            });
            document.getElementById('contactModal').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) window.closeContactModal();
            });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.closeContactModal(); });
        }

        window.openContactModal = function() {
            const modal = document.getElementById('contactModal');
            if (modal) { modal.classList.remove('hidden');
                document.getElementById('contactModalName').focus(); }
        };
        window.closeContactModal = function() {
            const modal = document.getElementById('contactModal');
            if (modal) modal.classList.add('hidden');
        };
        window.handleContactClick = function(e) {
            e.preventDefault();
            const isIndexPage = window.location.pathname.endsWith('index.html') ||
                window.location.pathname === '/' ||
                window.location.pathname.endsWith('/');
            if (isIndexPage) {
                const contactSection = document.getElementById('contact');
                if (contactSection) { contactSection.scrollIntoView({ behavior: 'smooth' }); } else { window
                        .openContactModal(); }
            } else { window.openContactModal(); }
        };

        // ──────────────────────────────────────────────────────────────
        //  LOADING BUTTON HELPER
        // ──────────────────────────────────────────────────────────────
        export function setLoading(button, isLoading, originalText = null) {
            if (!button) return;
            if (isLoading) {
                button.disabled = true;
                button._originalText = originalText || button.innerHTML;
                button.innerHTML = `<span class="spinner"></span> Loading...`;
            } else {
                button.disabled = false;
                if (button._originalText) { button.innerHTML = button._originalText;
                    delete button._originalText; }
            }
        }

        // ──────────────────────────────────────────────────────────────
        //  ✨ NEW CART DROPDOWN — replaces sidebar
        // ──────────────────────────────────────────────────────────────

        let cartDropdownOpen = false;

        /** Render the cart dropdown (attached to the cart button) */
        function renderCartDropdown() {
            if (document.getElementById('cartDropdown')) return;

            const dropdownHTML = `
            <div id="cartDropdown" class="cart-dropdown hidden">
              <div class="cart-dropdown-header">
                <span><i class="fas fa-shopping-bag mr-2 text-blue-500"></i>Your Cart</span>
                <span class="cart-count" id="cartCountLabel">0 items</span>
              </div>
              <div id="cartItems" class="cart-dropdown-items">
                <div class="cart-empty">
                  <i class="fas fa-shopping-bag"></i>
                  <p>Your cart is empty.</p>
                </div>
              </div>
              <div class="cart-dropdown-footer">
                <div class="cart-total-row">
                  <span>Total</span>
                  <span class="total-amount" id="cartTotal">$0.00</span>
                </div>
                <button onclick="window.checkout()" class="btn-primary" id="cartCheckoutBtn">
                  <i class="fas fa-lock"></i> Checkout
                </button>
              </div>
            </div>
          `;
            document.body.insertAdjacentHTML('beforeend', dropdownHTML);

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                const dropdown = document.getElementById('cartDropdown');
                const cartBtn = document.querySelector('[data-cart-toggle]');
                if (!dropdown || dropdown.classList.contains('hidden')) return;
                if (!cartBtn?.contains(e.target) && !dropdown.contains(e.target)) {
                    closeCartDropdown();
                }
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeCartDropdown();
            });
        }

        function openCartDropdown() {
            const dropdown = document.getElementById('cartDropdown');
            if (!dropdown) return;
            updateCartUI(); // refresh content
            dropdown.classList.remove('hidden');
            dropdown.style.animation = 'dropdownFade 0.2s ease';
            cartDropdownOpen = true;
        }

        function closeCartDropdown() {
            const dropdown = document.getElementById('cartDropdown');
            if (!dropdown) return;
            dropdown.classList.add('hidden');
            cartDropdownOpen = false;
        }

        function toggleCartDropdown() {
            if (cartDropdownOpen) {
                closeCartDropdown();
            } else {
                openCartDropdown();
            }
        }
        window.toggleCart = toggleCartDropdown; // expose for navbar onclick

        /** Update cart UI inside the dropdown */
        export function updateCartUI() {
            const container = document.getElementById('cartItems');
            const totalEl = document.getElementById('cartTotal');
            const countLabel = document.getElementById('cartCountLabel');
            const checkoutBtn = document.getElementById('cartCheckoutBtn');
            if (!container || !totalEl) return;

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

            if (countLabel) {
                countLabel.textContent = totalItems === 1 ? '1 item' : `${totalItems} items`;
            }

            if (cart.length === 0) {
                container.innerHTML = `
              <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty.</p>
              </div>
            `;
                totalEl.textContent = '$0.00';
                if (checkoutBtn) checkoutBtn.disabled = true;
                updateCartBadge();
                return;
            }

            if (checkoutBtn) checkoutBtn.disabled = false;

            container.innerHTML = cart.map((item, idx) => {
                const price = item.price || 0;
                const qty = item.quantity || 1;
                const subtotal = price * qty;
                const img = item.imageUrl || 'https://via.placeholder.com/48?text=No+Img';
                return `
              <div class="cart-item" data-index="${idx}">
                <img src="${img}" alt="${item.name || 'Product'}" loading="lazy" />
                <div class="cart-item-info">
                  <div class="name">${item.name || 'Unnamed'}</div>
                  <div class="price">$${subtotal.toFixed(2)}</div>
                </div>
                <button class="remove-btn" onclick="window.removeFromCart(${idx})" aria-label="Remove item">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            `;
            }).join('');

            totalEl.textContent = `$${totalPrice.toFixed(2)}`;
            updateCartBadge();

            // Sync with Firestore if user is logged in
            const user = authMock.currentUser;
            if (user) {
                const cartData = JSON.parse(localStorage.getItem('cart')) || [];
                updateCartInFirestore(user.uid, cartData);
            }
        }
        window.updateCartUI = updateCartUI;

        /** Remove item from cart by index */
        window.removeFromCart = function(index) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (index < 0 || index >= cart.length) return;
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            // If dropdown is open, keep it open; if cart becomes empty, show empty state
        };

        /** Add item to cart (used by demo buttons) */
        window.addToCart = function(product) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Check if item already exists (by id) — if so, just increment quantity
            const existing = cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            window.showToast(`✅ Added "${product.name}" to cart`, 'success');
            // If dropdown is open, refresh it
            if (cartDropdownOpen) {
                // updateCartUI already called
            }
        };

        // ──────────────────────────────────────────────────────────────
        //  CHECKOUT — closes dropdown, opens payment modal
        // ──────────────────────────────────────────────────────────────

        // Payment modal globals (re-used from original)
        let _paymentSettings = {};
        let _paymentOrderTotalUSD = 0;
        let _pendingCheckoutData = null;

        /** Render payment modal (unchanged from original, but we keep it) */
        export function renderPaymentModal() {
            const existing = document.getElementById('paymentModal');
            if (existing) {
                if (existing.dataset.version === 'v2') return;
                existing.remove();
                const oldForm = document.getElementById('paymentForm');
                if (oldForm) oldForm.dataset.bound = '';
            }

            const modalHTML = `
            <div id="paymentModal" data-version="v2" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[400] hidden p-4">
              <div class="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-2xl font-bold text-gray-900">Complete Payment</h3>
                  <button type="button" onclick="window.closePaymentModal()" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors"><i class="fas fa-times"></i></button>
                </div>
                <div id="paymentOrderSummary" class="mb-4 p-3 bg-blue-50 rounded-xl text-sm text-gray-700">
                  <div class="flex justify-between"><span>Order total</span><strong id="paymentTotalUSD">$0.00</strong></div>
                  <div id="paymentTotalBDTRow" class="flex justify-between mt-1 hidden"><span>Pay in BDT</span><strong id="paymentTotalBDT" class="text-green-700">৳0</strong></div>
                  <p id="paymentRateNote" class="text-xs text-gray-400 mt-1 hidden"></p>
                </div>
                <form id="paymentForm" class="space-y-4">
                  <input type="hidden" id="paymentOrderId" />
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Payment Method *</label>
                    <select id="paymentMethodSelect" required class="form-input">
                      <option value="">Select method</option>
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="USDT">USDT (BEP20)</option>
                    </select>
                  </div>
                  <div id="paymentMethodDetails" class="hidden space-y-4">
                    <div id="paymentAddressBox" class="text-sm bg-gray-50 p-4 rounded-xl border border-gray-100"></div>
                    <div id="paymentHowToBox" class="text-sm bg-amber-50 p-4 rounded-xl border border-amber-100"></div>
                    <div id="paymentFieldsBox" class="space-y-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5" id="paymentSenderLabel">Sender Number *</label>
                        <input type="text" id="paymentSenderNumber" placeholder="Number you paid from" class="form-input" />
                        <p class="text-xs text-gray-400 mt-1" id="paymentSenderHint">Your bKash/Nagad personal number</p>
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Transaction ID *</label>
                        <input type="text" id="transactionId" placeholder="Enter transaction ID from the app" class="form-input" />
                      </div>
                      <button type="submit" id="paymentSubmitBtn" class="btn-primary w-full justify-center"><i class="fas fa-check"></i> Confirm Payment</button>
                    </div>
                  </div>
                  <div id="paymentError" class="text-red-500 text-sm hidden text-center p-3 bg-red-50 rounded-xl border border-red-200"></div>
                </form>
              </div>
            </div>
          `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            if (!document.getElementById('paymentModalStyle')) {
                const style = document.createElement('style');
                style.id = 'paymentModalStyle';
                style.textContent = `
              @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
              .animate-scaleIn { animation: scaleIn 0.25s ease forwards; }
            `;
                document.head.appendChild(style);
            }

            const methodSelect = document.getElementById('paymentMethodSelect');
            if (methodSelect && !methodSelect.dataset.bound) {
                methodSelect.dataset.bound = '1';
                methodSelect.addEventListener('change', () => window.updatePaymentMethodUI());
            }

            const paymentForm = document.getElementById('paymentForm');
            if (paymentForm && !paymentForm.dataset.bound) {
                paymentForm.dataset.bound = '1';
                paymentForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const pending = window._pendingCheckoutData;
                    if (!pending) { showToast('Checkout data missing. Please try again.', 'error'); return; }

                    const method = document.getElementById('paymentMethodSelect').value;
                    const txnId = document.getElementById('transactionId').value.trim();
                    const senderNumber = document.getElementById('paymentSenderNumber').value.trim();
                    const errorDiv = document.getElementById('paymentError');
                    errorDiv.classList.add('hidden');
                    document.querySelectorAll('#paymentForm .form-input').forEach(el => el.classList.remove('error'));

                    if (!method) {
                        errorDiv.textContent = '⚠️ Please select a payment method.';
                        errorDiv.classList.remove('hidden');
                        methodSelect.classList.add('error');
                        return;
                    }
                    if (method === 'USDT') {
                        errorDiv.textContent = '⚠️ USDT payment is coming soon. Please use bKash or Nagad.';
                        errorDiv.classList.remove('hidden');
                        return;
                    }
                    if (!senderNumber) {
                        errorDiv.textContent = '⚠️ Please enter the number you paid from.';
                        errorDiv.classList.remove('hidden');
                        document.getElementById('paymentSenderNumber').classList.add('error');
                        return;
                    }
                    if (!txnId) {
                        errorDiv.textContent = '⚠️ Please enter transaction ID.';
                        errorDiv.classList.remove('hidden');
                        document.getElementById('transactionId').classList.add('error');
                        return;
                    }
                    if (!authMock.currentUser) {
                        errorDiv.textContent = '⚠️ You are not logged in.';
                        errorDiv.classList.remove('hidden');
                        return;
                    }

                    const rate = Number(_paymentSettings.usdRate) > 0 ? Number(_paymentSettings.usdRate) : 125;
                    const totalUSD = Number(_paymentOrderTotalUSD) || 0;
                    const totalBDT = Math.round(totalUSD * rate);

                    const btn = document.getElementById('paymentSubmitBtn');
                    setLoading(btn, true, 'Confirm Payment');

                    try {
                        const orderData = {
                            userId: pending.user.uid,
                            userEmail: pending.user.email,
                            items: pending.cart.map(item => ({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                quantity: item.quantity || 1,
                                imageUrl: item.imageUrl || ''
                            })),
                            total: pending.total,
                            status: 'pending',
                            paymentMethod: method,
                            transactionId: txnId,
                            senderNumber: senderNumber,
                            amountUSD: totalUSD,
                            amountBDT: totalBDT,
                            usdRate: rate,
                            createdAt: serverTimestamp()
                        };
                        const docRef = await addDoc(collection(db, 'orders'), orderData);
                        showToast('✅ Payment confirmed! Order placed. Admin will verify soon.', 'success');
                        window.closePaymentModal();
                        localStorage.removeItem('cart');
                        window.updateCartUI();
                        closeCartDropdown();
                        window._pendingCheckoutData = null;
                        setTimeout(() => { window.location.href = 'my-orders.html'; }, 1500);
                    } catch (err) {
                        console.error('Payment/Order error:', err);
                        errorDiv.textContent = '⚠️ ' + err.message;
                        errorDiv.classList.remove('hidden');
                        showToast('⚠️ ' + err.message, 'error');
                    } finally { setLoading(btn, false); }
                });
            }
        }

        window.openPaymentModal = function(data) {
            if (!document.getElementById('paymentModal')) {
                showToast('Payment system not ready. Please refresh.', 'error');
                return;
            }
            window._pendingCheckoutData = data;
            _paymentSettings = data.settings || {};
            _paymentOrderTotalUSD = Number(data.total) || 0;
            if (!(_paymentSettings.usdRate > 0)) _paymentSettings.usdRate = 125;

            document.getElementById('paymentOrderId').value = '';
            document.getElementById('paymentTotalUSD').textContent = '$' + _paymentOrderTotalUSD.toFixed(2);
            document.getElementById('paymentTotalBDTRow').classList.add('hidden');
            document.getElementById('paymentRateNote').classList.add('hidden');
            document.getElementById('paymentMethodDetails').classList.add('hidden');
            document.getElementById('paymentError').classList.add('hidden');

            const methodSelect = document.getElementById('paymentMethodSelect');
            methodSelect.value = '';
            methodSelect.classList.remove('error');
            document.getElementById('paymentSenderNumber').value = '';
            document.getElementById('transactionId').value = '';

            document.getElementById('paymentModal').classList.remove('hidden');
        };

        window.closePaymentModal = function() {
            const el = document.getElementById('paymentModal');
            if (el) el.classList.add('hidden');
        };

        window.updatePaymentMethodUI = function() {
            const method = document.getElementById('paymentMethodSelect')?.value || '';
            const details = document.getElementById('paymentMethodDetails');
            const addressBox = document.getElementById('paymentAddressBox');
            const howToBox = document.getElementById('paymentHowToBox');
            const fieldsBox = document.getElementById('paymentFieldsBox');
            const bdtRow = document.getElementById('paymentTotalBDTRow');
            const rateNote = document.getElementById('paymentRateNote');
            const errorDiv = document.getElementById('paymentError');
            if (errorDiv) errorDiv.classList.add('hidden');

            if (!method) { details.classList.add('hidden');
                bdtRow.classList.add('hidden');
                rateNote.classList.add('hidden'); return; }

            details.classList.remove('hidden');
            const rate = Number(_paymentSettings.usdRate) > 0 ? Number(_paymentSettings.usdRate) : 125;
            const totalUSD = Number(_paymentOrderTotalUSD) || 0;
            const totalBDT = Math.round(totalUSD * rate);

            if (method === 'bKash' || method === 'Nagad') {
                bdtRow.classList.remove('hidden');
                document.getElementById('paymentTotalBDT').textContent = '৳' + totalBDT.toLocaleString('en-BD');
                rateNote.classList.remove('hidden');
                rateNote.textContent = `Rate: 1 USD = ৳${rate} · Send exactly ৳${totalBDT.toLocaleString('en-BD')}`;

                const number = method === 'bKash' ? (_paymentSettings.bkash || '') : (_paymentSettings.nagad || '');
                const color = method === 'bKash' ? 'text-pink-600' : 'text-orange-600';
                addressBox.innerHTML = number ?
                    `<p class="font-semibold text-gray-800 mb-1">Send money to this ${method} number:</p>
                 <p class="text-xl font-bold ${color} tracking-wide select-all">${number}</p>
                 <p class="text-xs text-gray-400 mt-1">Amount: <strong>৳${totalBDT.toLocaleString('en-BD')}</strong></p>` :
                    `<p class="text-red-500">${method} number not set. Contact admin.</p>`;

                const appName = method === 'bKash' ? 'bKash' : 'Nagad';
                const dialCode = method === 'bKash' ? '*247#' : '*167#';
                const dialSendOption = method === 'bKash' ? '1' : '2';
                const user = authMock.currentUser;
                const username = (user?.displayName || (user?.email ? user.email.split('@')[0] : '') || 'your username');
                const numDisplay = number || '—';
                const amountDisplay = '৳' + totalBDT.toLocaleString('en-BD');

                howToBox.innerHTML = `
              <p class="font-semibold text-gray-800 mb-2"><i class="fas fa-mobile-alt mr-1"></i> How to pay — ${appName} App</p>
              <ol class="list-decimal list-inside space-y-1 text-gray-600 text-sm mb-4">
                <li>Open the <strong>${appName}</strong> app and log in</li>
                <li>Go to <strong>Send Money</strong></li>
                <li>Enter number: <strong class="select-all">${numDisplay}</strong></li>
                <li>Enter amount: <strong>${amountDisplay}</strong></li>
                <li>In <strong>Reference</strong>, enter your username: <strong class="select-all">${username}</strong></li>
                <li>Enter your PIN and <strong>Confirm</strong></li>
                <li>Copy the <strong>Transaction ID</strong> and paste it below</li>
              </ol>
              <p class="font-semibold text-gray-800 mb-2"><i class="fas fa-phone-alt mr-1"></i> How to pay — Dial (USSD)</p>
              <ol class="list-decimal list-inside space-y-1 text-gray-600 text-sm">
                <li>Dial <strong class="select-all">${dialCode}</strong></li>
                <li>Select option <strong>${dialSendOption}. Send Money</strong></li>
                <li>Enter number: <strong class="select-all">${numDisplay}</strong></li>
                <li>Enter amount: <strong>${amountDisplay}</strong></li>
                <li>Enter username in reference: <strong class="select-all">${username}</strong></li>
                <li>Enter PIN and confirm</li>
                <li>Copy the <strong>Transaction ID</strong> and paste it below</li>
              </ol>`;

                fieldsBox.classList.remove('hidden');
                document.getElementById('paymentSenderLabel').textContent = `Your ${method} Number *`;
                document.getElementById('paymentSenderNumber').placeholder = `Number you sent money from`;
                document.getElementById('paymentSenderHint').textContent = `Your personal ${method} number (sender)`;
                document.getElementById('paymentSubmitBtn').disabled = !number;
            } else if (method === 'USDT') {
                bdtRow.classList.add('hidden');
                rateNote.classList.remove('hidden');
                rateNote.textContent = `Order total: $${totalUSD.toFixed(2)} USD (same as USDT amount when available)`;
                addressBox.innerHTML = `
              <p class="font-semibold text-gray-800 mb-1"><i class="fab fa-bitcoin text-yellow-500 mr-1"></i> USDT (BEP20)</p>
              <p class="text-lg font-bold text-amber-600">Coming soon</p>
              <p class="text-sm text-gray-500 mt-2">USDT payments are not available yet. Please pay with <strong>bKash</strong> or <strong>Nagad</strong>.</p>`;
                howToBox.innerHTML =
                    `<p class="font-semibold text-gray-800 mb-1">How to pay</p><p class="text-sm text-gray-500">USDT instructions will appear here once this method is enabled.</p>`;
                fieldsBox.classList.add('hidden');
            }
        };

        // ──────────────────────────────────────────────────────────────
        //  CHECKOUT — closes dropdown, opens payment modal
        // ──────────────────────────────────────────────────────────────

        window.checkout = async function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                window.showToast('🛒 Your cart is empty', 'warning');
                return;
            }

            const user = authMock.currentUser;
            if (!user) {
                window.showToast('⚠️ Please sign in to checkout', 'error');
                if (typeof window.openAuthModal === 'function') window.openAuthModal('signin');
                return;
            }

            // Close cart dropdown immediately
            closeCartDropdown();

            const checkoutBtn = document.getElementById('cartCheckoutBtn');
            if (checkoutBtn) setLoading(checkoutBtn, true, 'Processing...');

            try {
                const settingsSnap = await getDoc(doc(db, 'settings', 'payment'));
                const settings = settingsSnap.exists() ? settingsSnap.data() : {};
                if (!settings.usdRate || Number(settings.usdRate) <= 0) settings.usdRate = 125;
                if (!settings.bkash && !settings.nagad) {
                    window.showToast('⚠️ Payment methods not set. Contact admin.', 'error');
                    if (checkoutBtn) setLoading(checkoutBtn, false);
                    return;
                }

                const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
                const data = { cart, total, settings, user };

                // Open payment modal
                window.openPaymentModal(data);
                if (checkoutBtn) setLoading(checkoutBtn, false);
            } catch (err) {
                window.showToast('⚠️ ' + err.message, 'error');
                if (checkoutBtn) setLoading(checkoutBtn, false);
            }
        };

        // ──────────────────────────────────────────────────────────────
        //  SYNC CART & FIRESTORE
        // ──────────────────────────────────────────────────────────────
        export async function syncCart(userId) {
            if (!userId) return;
            const cartRef = doc(db, 'carts', userId);
            try {
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                const docSnap = await getDoc(cartRef);
                let serverCart = [];
                if (docSnap.exists()) { serverCart = docSnap.data().items || []; }
                if (localCart.length > 0) {
                    await setDoc(cartRef, { items: localCart, updatedAt: new Date().toISOString() });
                } else if (serverCart.length > 0) {
                    localStorage.setItem('cart', JSON.stringify(serverCart));
                    updateCartBadge();
                }
            } catch (err) { console.error('Cart sync error:', err); }
        }

        export async function updateCartInFirestore(userId, cart) {
            if (!userId) return;
            const cartRef = doc(db, 'carts', userId);
            try {
                await setDoc(cartRef, { items: cart, updatedAt: new Date().toISOString() });
            } catch (err) { console.error('Firestore cart update error:', err); }
        }

        // ──────────────────────────────────────────────────────────────
        //  NAVBAR — includes cart dropdown trigger
        // ──────────────────────────────────────────────────────────────

        export function renderNavbar() {
            renderContactModal();
            renderCartDropdown();
            renderPaymentModal();

            const navbarHTML = `
            <nav class="fixed top-0 left-0 w-full glass z-50 h-[72px] md:h-[80px] flex items-center px-4 sm:px-8 lg:px-12 shadow-sm border-b border-gray-100/30">
              <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
                <!-- Logo -->
                <a href="index.html" class="flex items-center gap-2.5 text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">
                  <img src="https://res.cloudinary.com/zmoyykj7/image/upload/v1785180242/a6xbhrnjvb33c5ic6yyr.png" alt="CodeCureBD Logo" class="logo-img h-8 w-auto" />
                  <span class="logo-text tracking-tight">CodeCure<span class="gradient-text">BD</span></span>
                </a>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center gap-1 lg:gap-2">
                  <a href="index.html" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50">Home</a>
                  <a href="get-new-website.html" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50">Store</a>
                  <a href="fix-website.html" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50">Fix</a>
                  <a href="#" onclick="window.handleContactClick(event)" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50">Contact</a>
                </div>

                <!-- Right Actions -->
                <div class="flex items-center gap-2 md:gap-3">

                  <!-- ===== CART (always visible, with dropdown) ===== -->
                  <button data-cart-toggle onclick="window.toggleCart()" class="w-10 h-10 rounded-full hover:bg-gray-100/60 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors text-lg relative" title="Cart">
                    <i class="fas fa-shopping-cart"></i>
                    <span id="cartCount" class="cart-badge" style="display:none;">0</span>
                  </button>

                  <!-- ===== NOTIFICATIONS (only when signed in) ===== -->
                  <div id="authRequiredActions" class="flex items-center gap-2 md:gap-3" style="display:none;">
                    <div class="relative">
                      <button onclick="window.toggleNotifications()" class="w-10 h-10 rounded-full hover:bg-gray-100/60 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors text-lg relative" aria-label="Notifications">
                        <i class="fas fa-bell"></i>
                        <span id="notificationBadge" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 hidden">0</span>
                      </button>
                      <div id="notificationDropdown" class="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-gray-100 hidden max-h-[70vh] overflow-y-auto z-50">
                        <div class="p-4 font-semibold border-b text-gray-900 flex items-center justify-between">
                          <span><i class="fas fa-bell mr-2 text-blue-500"></i>Notifications</span>
                          <span class="text-xs font-normal text-gray-400" id="notifCountLabel">0 new</span>
                        </div>
                        <div id="notificationList" class="divide-y divide-gray-50">
                          <div class="p-4 text-sm text-gray-500 text-center">Loading...</div>
                        </div>
                        <div class="p-2 border-t">
                          <a href="messages.html" class="block text-center text-sm text-blue-600 hover:bg-gray-50 py-2 rounded-lg transition-colors">View all messages</a>
                        </div>
                      </div>
                    </div>
                  </div>

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
                      <a href="messages.html" class="hover:bg-blue-50/50"><i class="fas fa-comment-dots mr-3 text-gray-400"></i> Support Chat</a>
                      <a href="settings.html" class="hover:bg-blue-50/50"><i class="fas fa-cog mr-3 text-gray-400"></i> Settings</a>
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

            <!-- Mobile Menu -->
            <div id="mobileMenu" class="fixed top-[72px] md:top-[80px] left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg z-40 hidden md:hidden overflow-hidden transition-all duration-300 border-b border-gray-100/30" style="max-height:0; opacity:0;">
              <div class="flex flex-col p-4 gap-1">
                <a href="index.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors">Home</a>
                <a href="get-new-website.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors">Store</a>
                <a href="fix-website.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors">Fix</a>
                <a href="#" onclick="window.handleContactClick(event)" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors">Contact</a>
                <hr class="my-2 border-gray-100" />
                <a href="my-profile.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors"><i class="fas fa-user mr-3"></i> Profile</a>
                <a href="my-orders.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors"><i class="fas fa-box mr-3"></i> Orders</a>
                <a href="my-fix-requests.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors"><i class="fas fa-tools mr-3"></i> Fix Requests</a>
                <a href="messages.html" class="nav-link py-3 px-4 rounded-xl hover:bg-blue-50/50 font-medium text-gray-700 transition-colors"><i class="fas fa-comment-dots mr-3"></i> Support Chat</a>
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

            // Notification dropdown close on outside click
            const notifBtn = document.querySelector('[onclick="window.toggleNotifications()"]');
            const notifDropdown = document.getElementById('notificationDropdown');
            if (notifBtn && notifDropdown) {
                document.addEventListener('click', (e) => {
                    if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
                        if (!notifDropdown.classList.contains('hidden')) {
                            notifDropdown.classList.add('hidden');
                            displayMessages = [];
                        }
                    }
                });
            }

            // Cart dropdown: also close when clicking outside (handled inside renderCartDropdown)
            // But we also need to close when clicking the cart button again (toggle)

            updateCartBadge();

            // Cart sync on auth change
            onAuthStateChanged(authMock, (user) => {
                if (user) { syncCart(user.uid); }
            });
        }

        // ──────────────────────────────────────────────────────────────
        //  FOOTER (unchanged)
        // ──────────────────────────────────────────────────────────────
        export function renderFooter() {
            const footerHTML = `
            <footer class="glass border-t border-gray-200/30 py-10 px-6 sm:px-8 lg:px-12 mt-auto">
              <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                <div class="space-y-1 text-center sm:text-left">
                  <div class="font-medium text-gray-700">&copy; 2026 CodeCureBD. All rights reserved.</div>
                  <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
                    <a href="mailto:nopqrshov337@gmail.com" class="hover:text-blue-600 transition-colors"><i class="fas fa-envelope mr-1"></i> nopqrshov337@gmail.com</a>
                    <a href="tel:+8801350141762" class="hover:text-blue-600 transition-colors"><i class="fas fa-phone mr-1"></i> +880 1350-141762</a>
                    <a href="messages.html" class="hover:text-blue-600 transition-colors"><i class="fas fa-comment-dots mr-1"></i> Support Chat</a>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <a href="https://codecurebd.github.io/portfolio/" target="_blank" class="text-blue-600 hover:underline font-medium transition-colors">Portfolio</a>
                  <a href="https://github.com/shovon337" target="_blank" class="social-icon" aria-label="GitHub"><i class="fab fa-github"></i></a>
                  <a href="https://www.linkedin.com/in/shovon-s-mind-67aa4b260/" target="_blank" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                </div>
              </div>
            </footer>
          `;
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) { placeholder.innerHTML = footerHTML; }
        }

        // ──────────────────────────────────────────────────────────────
        //  AUTH UPDATE (unchanged)
        // ──────────────────────────────────────────────────────────────
        export function updateNavbarAuth(user, displayName, role = null) {
            const authBtns = document.getElementById('auth-buttons');
            const profileSection = document.getElementById('profile-section');
            const loadingEl = document.getElementById('auth-loading');
            const avatar = document.getElementById('profileAvatar');
            const adminLink = document.getElementById('adminPanelLink');
            const mobileAdminLink = document.getElementById('mobileAdminPanelLink');
            const authRequiredActions = document.getElementById('authRequiredActions');

            if (loadingEl) loadingEl.style.display = 'none';

            if (user) {
                if (authBtns) authBtns.classList.add('hidden');
                if (profileSection) profileSection.classList.remove('hidden');
                if (avatar) avatar.textContent = (displayName || user.email).charAt(0).toUpperCase();
                if (authRequiredActions) authRequiredActions.style.display = 'flex';

                const isAdmin = (role === 'admin');
                if (adminLink) { adminLink.style.display = isAdmin ? '' : 'none';
                    adminLink.classList.toggle('hidden', !isAdmin); }
                if (mobileAdminLink) { mobileAdminLink.style.display = isAdmin ? '' : 'none';
                    mobileAdminLink.classList.toggle('hidden', !isAdmin); }

                if (!isAdmin) { startAdminMessageListener(user); } else {
                    if (adminMessageUnsubscribe) { adminMessageUnsubscribe();
                        adminMessageUnsubscribe = null; }
                    updateNotificationBadge(0);
                    updateNotificationList([]);
                }
            } else {
                if (authBtns) authBtns.classList.remove('hidden');
                if (profileSection) profileSection.classList.add('hidden');
                if (adminLink) { adminLink.style.display = 'none';
                    adminLink.classList.add('hidden'); }
                if (mobileAdminLink) { mobileAdminLink.style.display = 'none';
                    mobileAdminLink.classList.add('hidden'); }
                if (adminMessageUnsubscribe) { adminMessageUnsubscribe();
                    adminMessageUnsubscribe = null; }
                updateNotificationBadge(0);
                updateNotificationList([]);
                if (authRequiredActions) authRequiredActions.style.display = 'none';
            }
        }

        // ──────────────────────────────────────────────────────────────
        //  CLOUDINARY UPLOAD (unchanged)
        // ──────────────────────────────────────────────────────────────
        const CLOUDINARY_CLOUD_NAME = 'zmoyykj7';
        const CLOUDINARY_UPLOAD_PRESET = 'codecurebd';

        export async function uploadImage(file) {
            if (!file) throw new Error('No file selected.');
            if (file.size > 10 * 1024 * 1024) throw new Error('Image must be less than 10MB.');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST',
                        body: formData }
                );
                const data = await response.json();
                if (data.error) throw new Error(data.error.message || 'Upload failed.');
                return data.secure_url;
            } catch (err) { console.error('❌ Cloudinary Upload Error:', err);
                throw err; }
        }

        // ──────────────────────────────────────────────────────────────
        //  INIT
        // ──────────────────────────────────────────────────────────────
        renderNavbar();
        renderFooter();
        updateCartUI();

        // Demo products
        const products = [{
            id: 'p1',
            name: 'Business Website Pro',
            price: 299,
            imageUrl: 'https://picsum.photos/seed/biz/200/140'
        }, {
            id: 'p2',
            name: 'E-Commerce Starter',
            price: 499,
            imageUrl: 'https://picsum.photos/seed/ecom/200/140'
        }, {
            id: 'p3',
            name: 'Portfolio Premium',
            price: 149,
            imageUrl: 'https://picsum.photos/seed/port/200/140'
        }, {
            id: 'p4',
            name: 'Fix & Repair Service',
            price: 99,
            imageUrl: 'https://picsum.photos/seed/fix/200/140'
        }];

        const grid = document.getElementById('productGrid');
        if (grid) {
            grid.innerHTML = products.map(p => `
            <div class="demo-card">
              <img src="${p.imageUrl}" alt="${p.name}" />
              <h4>${p.name}</h4>
              <div class="price-tag">$${p.price}</div>
              <button class="btn-primary" onclick="window.addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          `).join('');
        }

        // Simulate a logged-in user for demo
        setTimeout(() => {
            updateNavbarAuth(authMock.currentUser, 'Demo User', 'user');
        }, 300);

        console.log('✅ Cart system updated — popup dropdown, no sidebar, no quantity controls.');
    </script>
</body>
</html>