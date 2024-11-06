import { authService } from './api.js';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await authService.login(email, password);
        if (response.data?.accessToken) {
            console.log('Login successful, redirecting to feed...'); // Debugging line
            window.location.href = 'feed.html';
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const bio = document.getElementById('registerBio').value;
    const avatarUrl = document.getElementById('registerAvatarUrl').value;
    const avatarAlt = document.getElementById('registerAvatarAlt').value;
    const bannerUrl = document.getElementById('registerBannerUrl').value;
    const bannerAlt = document.getElementById('registerBannerAlt').value;

    const avatar = avatarUrl ? { url: avatarUrl, alt: avatarAlt } : undefined;
    const banner = bannerUrl ? { url: bannerUrl, alt: bannerAlt } : undefined;

    try {
        const response = await authService.register(name, email, password, bio, avatar, banner, venueManager);
        if (response.data) {
            alert('Registration successful! You can now log in.');
            window.location.href = 'index.html'; // Redirect to login page
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
});
