import { authService, profileService } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!authService.isAuthenticated()) {
        alert('User not logged in. Please log in to edit your profile.');
        window.location.href = 'index.html'; // Redirect to login page
        return; // Exit the function
    }

    const user = authService.getUser(); // Get the current user
    if (user) {
        try {
            const profile = await profileService.getProfile(user.name);
            document.getElementById('editProfileName').value = profile.data.name;
            document.getElementById('editProfileEmail').value = profile.data.email;
            document.getElementById('editProfileBio').value = profile.data.bio || '';
            document.getElementById('editProfileAvatarUrl').value = profile.data.avatar.url || '';
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    const editProfileForm = document.getElementById('editProfileForm');
    editProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('editProfileName').value;
        const email = document.getElementById('editProfileEmail').value;
        const bio = document.getElementById('editProfileBio').value;
        const avatarUrl = document.getElementById('editProfileAvatarUrl').value;

        const avatar = avatarUrl ? { url: avatarUrl } : undefined;

        const profileData = {
            name,
            email,
            bio,
            avatar
        };

        try {
            const response = await profileService.updateProfile(user.name, profileData);
            if (response.data) {
                alert('Profile updated successfully!');
                window.location.href = 'profile.html'; // Redirect to profile page
            } else {
                alert('Error updating profile: ' + response.errors[0].message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    });

    const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
    if (cancelEditProfileBtn) {
        cancelEditProfileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html'; // Redirect to profile page
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authService.logout();
            window.location.href = 'index.html'; // Redirect to login page
        });
    }
});