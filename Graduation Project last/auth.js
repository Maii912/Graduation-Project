// --- NEW: Global function to update the cart count in the navbar ---
// Made global by attaching to the window object so other scripts can call it.
window.updateCartIcon = () => {
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    // Calculates the total number of items, not just unique entries
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = totalQuantity;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // === AUTH & PROFILE MODAL ELEMENTS ===
    const profileBtn = document.getElementById('profile-icon-btn');
    const authModal = document.getElementById('authModal');
    const profileModal = document.getElementById('userProfileModal');
    
    // Auth Modal Specific
    const authBox = document.getElementById('auth-box');
    const signUpBtn = document.getElementById('signUpBtnModal');
    const signInBtn = document.getElementById('signInBtnModal');

    // Auth Form Elements
    const signUpNameInput = document.getElementById('signUpName');
    const signUpEmailInput = document.getElementById('signUpEmail');
    const signUpPasswordInput = document.getElementById('signUpPassword');
    const signUpActionBtn = document.getElementById('signUpActionBtn');
    const signInEmailInput = document.getElementById('signInEmail');
    const signInPasswordInput = document.getElementById('signInPassword');
    const signInActionBtn = document.getElementById('signInActionBtn');

    // Profile Modal elements
    const closeProfileBtn = document.querySelector('.profile-modal-close-btn');
    const userProfileForm = document.getElementById('userProfileForm');
    const logoutBtn = document.getElementById('profile-logout-btn');
    const profileFirstNameInput = document.getElementById('profile-firstname');
    const profileLastNameInput = document.getElementById('profile-lastname');
    const profileEmailInput = document.getElementById('profile-email');
    const profilePhoneInput = document.getElementById('profile-phone');
    const profileLocationInput = document.getElementById('profile-location');
    const profileCardNumberInput = document.getElementById('profile-cardnumber');
    const displayNameEl = document.getElementById('profile-display-name');
    const displayLocationEl = document.getElementById('profile-display-location');
    const avatarUploadInput = document.getElementById('avatarUpload');
    const profileAvatarImg = document.getElementById('profile-avatar-img');
    const navProfileImg = document.getElementById('nav-profile-img');

    // Success Prompt Modal Elements
    const successModal = document.getElementById('successPromptModal');
    const successModalTitle = document.getElementById('successModalTitle');
    const successModalMessage = document.getElementById('successModalMessage');
    const successModalBtn = document.getElementById('successModalBtn');


    // Data & State Management
    const getUsersDB = () => JSON.parse(localStorage.getItem('usersDB')) || {};
    const saveUsersDB = (db) => localStorage.setItem('usersDB', JSON.stringify(db));
    const getCurrentUserEmail = () => localStorage.getItem('currentUserEmail');
    const setCurrentUserEmail = (email) => localStorage.setItem('currentUserEmail', email);
    const logoutCurrentUser = () => localStorage.removeItem('currentUserEmail');
    const isLoggedIn = () => getCurrentUserEmail() !== null;

    // Function to show the success modal
    const showSuccessModal = (title, message) => {
        if (!successModal) return;
        successModalTitle.textContent = title;
        successModalMessage.textContent = message;
        successModal.style.display = 'flex';
        setTimeout(() => successModal.classList.add('show'), 10);
        
        setTimeout(() => {
            window.location.reload();
        }, 2500);
    };
    
    if (successModalBtn) {
        successModalBtn.addEventListener('click', () => window.location.reload());
    }

    const loadProfileData = () => {
        if (!isLoggedIn() || !profileModal) return;
        const userProfile = getUsersDB()[getCurrentUserEmail()];
        if (!userProfile) {
            logoutCurrentUser();
            return;
        }
        if (profileFirstNameInput) profileFirstNameInput.value = userProfile.firstname || '';
        if (profileLastNameInput) profileLastNameInput.value = userProfile.lastname || '';
        if (profileEmailInput) {
            profileEmailInput.value = userProfile.email || '';
            profileEmailInput.disabled = true;
        }
        if (profilePhoneInput) profilePhoneInput.value = userProfile.phone || '';
        if (profileLocationInput) profileLocationInput.value = userProfile.location || '';
        if (profileCardNumberInput) profileCardNumberInput.value = userProfile.cardnumber || '';
        const fullName = `${userProfile.firstname || ''} ${userProfile.lastname || ''}`.trim();
        if (displayNameEl) displayNameEl.textContent = fullName || 'Your Name';
        if (displayLocationEl) displayLocationEl.textContent = userProfile.location || 'Your Location';
        const avatarSrc = userProfile.avatarUrl || 'Icons/user.png';
        if (profileAvatarImg) profileAvatarImg.src = avatarSrc;
        updateNavIcon();
    };
    
    const updateNavIcon = () => {
        if (!navProfileImg) return;
        if (isLoggedIn()) {
            const currentUser = getUsersDB()[getCurrentUserEmail()];
            if (currentUser) {
                navProfileImg.src = currentUser.avatarUrl || 'Icons/user.png';
                navProfileImg.style.borderRadius = '50%';
            }
        } else {
            navProfileImg.src = 'Icons/user.png';
        }
    };

    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isLoggedIn()) {
                if (profileModal) {
                    loadProfileData();
                    profileModal.style.display = 'flex';
                }
            } else {
                if (authModal) authModal.style.display = 'flex';
            }
        });
    }

    if (signUpBtn && signInBtn && authBox) {
        signUpBtn.addEventListener('click', () => { authBox.classList.add("right-panel-active"); });
        signInBtn.addEventListener('click', () => { authBox.classList.remove("right-panel-active"); });
    }

    if (authModal) authModal.addEventListener('click', e => (e.target === authModal) && (authModal.style.display = 'none'));
    if (profileModal) profileModal.addEventListener('click', e => (e.target === profileModal) && (profileModal.style.display = 'none'));
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => profileModal.style.display = 'none');

    if (signUpActionBtn) {
        signUpActionBtn.addEventListener('click', () => {
            const name = signUpNameInput.value.trim();
            const email = signUpEmailInput.value.trim().toLowerCase();
            const password = signUpPasswordInput.value;
            if (!name || !email || !password) return alert('Please fill in all fields.');
            if (!/\S+@\S+\.\S+/.test(email)) return alert('Please enter a valid email address.');
            const db = getUsersDB();
            if (db[email]) return alert('An account with this email already exists.');
            db[email] = { firstname: name, lastname: '', email: email, password: password, phone: '', location: '', cardnumber: '', avatarUrl: 'Icons/user.png' };
            saveUsersDB(db);
            setCurrentUserEmail(email);
            if (authModal) authModal.style.display = 'none';
            showSuccessModal('Account Created!', 'Welcome to FashioNear. You are now signed in.');
        });
    }

    if (signInActionBtn) {
        signInActionBtn.addEventListener('click', () => {
            const email = signInEmailInput.value.trim().toLowerCase();
            const password = signInPasswordInput.value;
            if (!email || !password) return alert('Please enter both email and password.');
            const user = getUsersDB()[email];
            if (!user || user.password !== password) return alert('Incorrect email or password.');
            setCurrentUserEmail(email);
            if (authModal) authModal.style.display = 'none';
            showSuccessModal('Sign In Successful!', 'Welcome back! Redirecting you now.');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutCurrentUser();
            if (profileModal) profileModal.style.display = 'none';
            showSuccessModal('Logged Out', 'You have been successfully logged out.');
        });
    }

    if (userProfileForm) {
        userProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!isLoggedIn()) return;
            const db = getUsersDB();
            const email = getCurrentUserEmail();
            db[email].firstname = profileFirstNameInput.value.trim();
            db[email].lastname = profileLastNameInput.value.trim();
            db[email].phone = profilePhoneInput.value.trim();
            db[email].location = profileLocationInput.value.trim();
            db[email].cardnumber = profileCardNumberInput.value.trim();
            saveUsersDB(db);
            updateNavIcon();
            if (profileModal) profileModal.style.display = 'none';
            showSuccessModal('Profile Saved', 'Your information has been updated successfully.');
        });
    }
    
    if (avatarUploadInput) {
        avatarUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && isLoggedIn()) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const avatarUrl = event.target.result;
                    const db = getUsersDB();
                    const email = getCurrentUserEmail();
                    db[email].avatarUrl = avatarUrl;
                    saveUsersDB(db);
                    loadProfileData();
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // --- INITIALIZATION ---
    updateNavIcon();
    window.updateCartIcon(); // Call the new function on every page load
});