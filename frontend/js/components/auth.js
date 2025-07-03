// js/auth.js
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { showToast } from '/js/utils/ui.js';

class Auth {
  constructor() {
    this.loginBtn = document.getElementById('login-btn');
    this.authModal = document.getElementById('auth-modal');
    this.loginForm = document.getElementById('login-form');
    this.signupForm = document.getElementById('signup-form');

    // Initialize auth state listener
    onAuthStateChanged(auth, (user) => {
      this.updateAuthButton(user);
      this.handleAuthStateChange(user);
    });

    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (this.signupForm) {
      this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    // Close modal handlers
    document.getElementById('close-auth-modal')?.addEventListener('click', () => {
      this.authModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === this.authModal) {
        this.authModal.style.display = 'none';
      }
    });
  }

  handleAuthStateChange(user) {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      // Close auth modal if open
      if (this.authModal) {
        this.authModal.style.display = 'none';
      }
    } else {
      localStorage.removeItem('authUser');
    }
  }

  updateAuthButton(user) {
    if (this.loginBtn) {
      if (user) {
        this.loginBtn.textContent = `Welcome, ${user.email.split('@')[0]}`;
        this.loginBtn.onclick = () => this.logout();
      } else {
        this.loginBtn.textContent = 'Login / Sign Up';
        this.loginBtn.onclick = () => this.showAuthModal();
      }
    }
  }

  showAuthModal(activeTab = 'login') {
    if (this.authModal) {
      this.authModal.style.display = 'flex';
      document.getElementById('login-form').style.display = activeTab === 'login' ? 'block' : 'none';
      document.getElementById('signup-form').style.display = activeTab === 'signup' ? 'block' : 'none';
      
      // Update active tab UI
      document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === activeTab);
      });
    }
  }

  handleLogin(event) {
    event.preventDefault();
    const email = this.loginForm.querySelector('input[type="email"]').value;
    const password = this.loginForm.querySelector('input[type="password"]').value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        showToast("Logged in successfully!");
      })
      .catch(err => showToast(err.message, 'error'));
  }

  handleSignup(event) {
    event.preventDefault();
    const name = this.signupForm.querySelector('input[type="text"]').value;
    const email = this.signupForm.querySelector('input[type="email"]').value;
    const password = this.signupForm.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = this.signupForm.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", 'error');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        showToast("Account created successfully!");
      })
      .catch(err => showToast(err.message, 'error'));
  }

  logout() {
    signOut(auth)
      .then(() => showToast("Logged out successfully!"))
      .catch(err => showToast(err.message, 'error'));
  }

  checkAuth(showModal = false) {
    const user = auth.currentUser || JSON.parse(localStorage.getItem('authUser') || 'null');
    if (!user && showModal) {
      this.showAuthModal();
    }
    return !!user;
  }
}

// Create singleton instance
const authInstance = new Auth();

// Export functions for direct usage
export function checkAuth(showModal = false) {
  return authInstance.checkAuth(showModal);
}

export default authInstance;
