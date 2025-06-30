// js/auth.js
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { showToast } from './utils/ui.js'; // or adjust the path if different

class Auth {
  constructor() {
    this.loginBtn = document.getElementById('login-btn');
    this.authModal = document.getElementById('auth-modal');
    this.loginForm = document.getElementById('login-form');
    this.signupForm = document.getElementById('signup-form');

    // Auth state listener
    onAuthStateChanged(auth, (user) => this.updateAuthButton(user));

    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (this.signupForm) {
      this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }
  }

  updateAuthButton(user) {
    if (this.loginBtn) {
      if (user) {
        this.loginBtn.textContent = `Welcome, ${user.email.split('@')[0]}`;
        this.loginBtn.onclick = () => this.logout();
      } else {
        this.loginBtn.textContent = 'Login / Sign Up';
        this.loginBtn.onclick = () => {
          if (this.authModal) this.authModal.style.display = 'flex';
        };
      }
    }
  }

  handleLogin(event) {
    event.preventDefault();
    const email = this.loginForm.querySelector('input[type="email"]').value;
    const password = this.loginForm.querySelector('input[type="password"]').value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        this.authModal.style.display = 'none';
        showToast("Logged in!");
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
        this.authModal.style.display = 'none';
        showToast("Signed up!");
      })
      .catch(err => showToast(err.message, 'error'));
  }

  logout() {
    signOut(auth)
      .then(() => showToast("Logged out!"))
      .catch(err => showToast(err.message, 'error'));
  }

  checkAuthForCheckout() {
    const user = auth.currentUser;
    if (!user) {
      showToast("Please login to checkout", 'error');
      if (this.authModal) this.authModal.style.display = 'flex';
      return false;
    }
    return true;
  }
}

export default Auth;
