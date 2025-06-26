document.addEventListener('DOMContentLoaded', () => {

    // --- YETI Animation Logic ---
    const yetiAvatar = document.getElementById('yeti-avatar');
    const formWrapper = document.querySelector('.form-wrapper');
    const passwordFields = document.querySelectorAll('.password-field');
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    
    const yetiStates = {
        default: 'img/yeti-default.png',
        lookLeft: 'img/yeti-look-left.png',
        lookRight: 'img/yeti-look-right.png',
        lookFarRight: 'img/yeti-look-far-right.png',
        covering: 'img/yeti-cover.png',
        peeking: 'img/yeti-peek.png'
    };
    
    // --- Eye Tracking Function ---
    function trackMouse(e) {
        const rect = formWrapper.getBoundingClientRect();
        const formCenterX = rect.left + rect.width / 2;
        const mouseX = e.clientX;
        const delta = mouseX - formCenterX;

        let newState;
        if (delta < -70) {
            newState = yetiStates.lookLeft;
        } else if (delta > 100) {
            newState = yetiStates.lookFarRight;
        } else if (delta > 50) {
            newState = yetiStates.lookRight;
        } else {
            newState = yetiStates.default;
        }
        
        if (yetiAvatar.src.includes(newState)) return; // Avoids flickering
        yetiAvatar.src = newState;
    }
    
    // By default, the yeti tracks the mouse
    document.addEventListener('mousemove', trackMouse);

    // --- Password Field Interactions (Covering Eyes) ---
    passwordFields.forEach(field => {
        field.addEventListener('focus', () => {
            // Stop eye-tracking and cover eyes
            document.removeEventListener('mousemove', trackMouse);
            yetiAvatar.src = yetiStates.covering;
            yetiAvatar.style.transform = 'scale(0.95)';
        });

        field.addEventListener('blur', () => {
            // Uncover eyes and resume eye-tracking
            yetiAvatar.src = yetiStates.default;
            yetiAvatar.style.transform = 'scale(1)';
            document.addEventListener('mousemove', trackMouse);
        });
    });

    // --- Password Visibility Toggle Interactions (Peeking) ---
    togglePasswordIcons.forEach(icon => {
        // When mouse is HELD DOWN, yeti peeks
        icon.addEventListener('mousedown', function (event) {
            event.preventDefault(); // Prevents losing focus from the input
            yetiAvatar.src = yetiStates.peeking;

            const input = this.previousElementSibling;
            input.setAttribute('type', 'text');
            this.classList.replace('fa-eye-slash', 'fa-eye');
        });

        // When mouse is RELEASED, yeti goes back to covering eyes
        icon.addEventListener('mouseup', function () {
            yetiAvatar.src = yetiStates.covering;
            const input = this.previousElementSibling;
            input.setAttribute('type', 'password');
            this.classList.replace('fa-eye', 'fa-eye-slash');
        });

        // If mouse leaves while held down, also stop peeking
         icon.addEventListener('mouseleave', function () {
             if(this.previousElementSibling.getAttribute('type') === 'text') {
                yetiAvatar.src = yetiStates.covering;
                this.previousElementSibling.setAttribute('type', 'password');
                this.classList.replace('fa-eye', 'fa-eye-slash');
             }
        });
    });

    // --- Live Password Strength Validation ---
    const newPasswordInput = document.getElementById('new-password');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthBars = strengthMeter.querySelectorAll('span');

    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updateStrengthMeter(strength);
    });

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length > 0) strength = 1;
        if (password.length >= 8) strength = 2;
        if (password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)) strength = 3;
        if (password.length >= 12 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength = 4;
        return strength;
    }

    function updateStrengthMeter(strength) {
        const strengthColors = [
            'var(--bar-default-color)', // 0
            'var(--bar-weak-color)',    // 1
            'var(--bar-medium-color)',   // 2
            'var(--bar-strong-color)',  // 3
            'var(--bar-strong-color)'   // 4
        ];
        
        strengthBars.forEach((bar, index) => {
            if (index < strength) {
                bar.style.backgroundColor = strengthColors[strength];
            } else {
                bar.style.backgroundColor = 'var(--bar-default-color)';
            }
        });
    }
});