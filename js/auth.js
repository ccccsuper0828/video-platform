/**
 * Client-side authentication using Backend API
 */

const Auth = {
    // API Base URL - Assuming server runs on the same host or proxied
    // If running separately, change this to 'http://localhost:3000/api'
    API_URL: '/api', 
    CURRENT_USER_KEY: 'app_current_user',

    // Register a new user
    register: async function(username, password, name, role = 'customer') {
        try {
            const response = await fetch(`${this.API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, name, role })
            });
            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: '網絡錯誤或服務器不可用' };
        }
    },

    // Login
    login: async function(username, password) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: '網絡錯誤或服務器不可用' };
        }
    },

    // Logout
    logout: function() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'index.html';
    },

    // Get current user
    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY));
    },

    // Check if logged in
    isLoggedIn: function() {
        return !!this.getCurrentUser();
    },

    // Enforce login on protected pages
    requireLogin: function() {
        if (!this.isLoggedIn()) {
            // Redirect to login page, saving the current URL to redirect back after login
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `login.html?redirect=${currentUrl}`;
        }
    },

    // Update UI with user info
    updateUserDisplay: function() {
        const user = this.getCurrentUser();
        const userInfoEls = document.querySelectorAll('.user-info');

        if (user) {
            let adminLink = '';
            if (user.role === 'admin') {
                adminLink = `<a href="register.html" style="color: #0c82c0; text-decoration: none; font-weight: bold; margin-left: 20px;">註冊新用戶</a>`;
            }
            
            userInfoEls.forEach(el => {
                el.innerHTML = `
                    登入 : <span class="user-name">${user.name}</span> <span style="font-size:12px; color:#666;">(${user.role === 'admin' ? '管理員' : '客戶'})</span>
                    ${adminLink}
                    <a href="javascript:Auth.logout()" class="logout-btn" style="color: #d9534f; text-decoration: none; font-size: 14px; margin-left: 20px;">登出</a>
                `;
            });
        } else {
            userInfoEls.forEach(el => {
                el.innerHTML = `
                    <a href="login.html" style="color: #0c82c0; text-decoration: none; font-weight: bold; margin-right: 10px;">登入</a>
                    <!-- Register hidden for public -->
                `;
            });
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    Auth.updateUserDisplay();
});
