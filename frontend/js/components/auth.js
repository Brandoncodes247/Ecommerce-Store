import { showToast } from '../utils/ui.js';

export function updateAuthButton() {
  const loginBtn = document.getElementById('login-btn');
  const user = JSON.parse(localStorage.getItem('user'));
  if (loginBtn) {
    if (user) {
      loginBtn.textContent = `Welcome, ${user.name}`;
      loginBtn.onclick = logout;
    } else {
      loginBtn.textContent = 'Login / Sign Up';
      loginBtn.onclick = () => document.getElementById('auth-modal').style.display = 'flex';
    }
  }
}

export function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelector('input[type="password"]').value;

  const user = { name: email.split('@')[0], email };
  localStorage.setItem('user', JSON.stringify(user));
  updateAuthButton();
  document.getElementById('auth-modal').style.display = 'none';
  showToast('Successfully logged in!');
}

export function handleSignup(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.querySelector('input[type="text"]').value;
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelectorAll('input[type="password"]')[0].value;
  const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

  if (password !== confirmPassword) {
    showToast('Passwords do not match!', 'error');
    return;
  }

  const user = { name, email };
  localStorage.setItem('user', JSON.stringify(user));
  updateAuthButton();
  document.getElementById('auth-modal').style.display = 'none';
  showToast('Successfully signed up!');
}

export function logout() {
  localStorage.removeItem('user');
  updateAuthButton();
  showToast('Successfully logged out!');
}

export function checkAuthForCheckout() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    showToast('Please login to checkout', 'error');
    document.getElementById('auth-modal').style.display = 'flex';
    return false;
  }
  return true;
} 