// Profile modal logic
function openProfileModal() {
  document.getElementById('profile-modal').style.display = 'flex';
  document.getElementById('profile-modal').classList.add('show');
  loadProfileForm();
}
function closeProfileModal() {
  document.getElementById('profile-modal').style.display = 'none';
  document.getElementById('profile-modal').classList.remove('show');
}
function loadProfileForm() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  document.getElementById('profile-fullname').value = userProfile.fullname || '';
  document.getElementById('profile-address').value = userProfile.address || '';
  document.getElementById('profile-payment-method').value = userProfile.paymentMethod || 'mpesa';
}
function saveProfileForm(e) {
  e.preventDefault();
  const fullname = document.getElementById('profile-fullname').value.trim();
  const address = document.getElementById('profile-address').value.trim();
  const paymentMethod = document.getElementById('profile-payment-method').value;
  const profile = { fullname, address, paymentMethod };
  if (window.openProfileModalForAuth) {
    window.openProfileModalForAuth(profile);
    closeProfileModal();
    return;
  }
  // Save to user object
  let user = JSON.parse(localStorage.getItem('user') || '{}');
  user = { ...user, ...profile };
  localStorage.setItem('user', JSON.stringify(user));
  closeProfileModal();
  // Update checkout summary if present
  const profileSummary = document.getElementById('checkout-profile-summary');
  if (profileSummary) {
    profileSummary.innerHTML = `
      <div><strong>Full Name:</strong> ${fullname}</div>
      <div><strong>Address:</strong> ${address}</div>
      <div><strong>Payment Method:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</div>
    `;
  }
}
// Event listeners
window.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) profileBtn.onclick = openProfileModal;
  const closeProfileModalBtn = document.getElementById('close-profile-modal');
  if (closeProfileModalBtn) closeProfileModalBtn.onclick = closeProfileModal;
  const profileForm = document.getElementById('profile-form');
  if (profileForm) profileForm.onsubmit = saveProfileForm;
  // Close modal on outside click
  const profileModal = document.getElementById('profile-modal');
  if (profileModal) {
    profileModal.onclick = e => { if (e.target === profileModal) closeProfileModal(); };
  }
}); 