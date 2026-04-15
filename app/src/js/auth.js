const Auth = {
    // Check if user is logged in
    checkAuth: function() {
        const user = localStorage.getItem('organDonationUser');
        const isAuthPage = window.location.pathname.includes('login.html');
        
        if (!user && !isAuthPage) {
            window.location.href = 'login.html';
        } else if (user && isAuthPage) {
            window.location.href = 'index.html';
        }
    },

    // Toggle between Login and Signup forms
    toggleForm: function() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const message = document.getElementById('authMessage');
        
        message.style.display = 'none';
        
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    },

    // Handle Signup
    signup: function() {
        const name = document.getElementById('signupName').value;
        const username = document.getElementById('signupUsername').value;
        const pass = document.getElementById('signupPassword').value;
        const message = document.getElementById('authMessage');

        if (!name || !username || !pass) {
            this.showMessage('All fields are required!', 'danger');
            return;
        }

        let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        if (users.find(u => u.username === username)) {
            this.showMessage('Username already exists!', 'danger');
            return;
        }

        users.push({ name, username, pass });
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        this.showMessage('Signup successful! Please login.', 'success');
        setTimeout(() => this.toggleForm(), 1500);
    },

    // Handle Login
    login: function() {
        const username = document.getElementById('loginUsername').value;
        const pass = document.getElementById('loginPassword').value;
        
        if (!username || !pass) {
            this.showMessage('Please enter both username and password!', 'danger');
            return;
        }

        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = users.find(u => u.username === username && u.pass === pass);

        if (user) {
            localStorage.setItem('organDonationUser', JSON.stringify({
                name: user.name,
                username: user.username
            }));
            window.location.href = 'index.html';
        } else {
            this.showMessage('Invalid username or password!', 'danger');
        }
    },

    // Handle Logout
    logout: function() {
        localStorage.removeItem('organDonationUser');
        window.location.href = 'login.html';
    },

    // Toggle password visibility
    togglePassword: function(inputId, icon) {
        const input = document.getElementById(inputId);
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    },

    // Helper to show messages
    showMessage: function(msg, type) {
        const message = document.getElementById('authMessage');
        message.textContent = msg;
        message.className = `alert alert-${type} mt-3`;
        message.style.display = 'block';
    }
};

// Initialize auth check on load
document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuth();
});
