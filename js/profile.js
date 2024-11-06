import { authService, profileService, postService } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!authService.isAuthenticated()) {
        alert('User not logged in. Please log in to view your profile.');
        window.location.href = 'index.html'; // Redirect to login page
        return; // Exit the function
    }

    const user = authService.getUser(); // Get the current user
    if (user) {
        try {
            const profile = await profileService.getProfile(user.name);
            document.getElementById('profileImage').src = profile.data.avatar.url || '';
            document.getElementById('profileName').textContent = profile.data.name;
            document.getElementById('profileBio').textContent = profile.data.bio || 'No bio yet';
            document.getElementById('followerCount').textContent = profile.data._count.followers;
            document.getElementById('followingCount').textContent = profile.data._count.following;

            const postsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/social/profiles/${user.name}/posts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'X-Noroff-API-Key': import.meta.env.VITE_API_KEY
                }
            });
            const postsData = await postsResponse.json();
            if (postsResponse.ok) {
                const userPostsList = document.getElementById('userPostsList');
                userPostsList.innerHTML = ''; // Clear existing posts
                postsData.data.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.innerHTML = `
                        <h3 class="clickable-title" onclick="viewPost(${post.id})">${post.title}</h3>
                        <p>${post.body}</p>
                        ${post.media ? `<img src="${post.media.url}" alt="Post media">` : ''}
                        <p>Comments: ${post._count.comments}</p>
                        <p>Reactions: ${post._count.reactions}</p>
                    `;
                    userPostsList.appendChild(postElement);
                });
            } else {
                console.error('Error fetching user posts:', postsData.errors);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    const followBtn = document.getElementById('followBtn');
    followBtn.addEventListener('click', async () => {
        try {
            const response = await profileService.followProfile(user.name);
            if (response.data) {
                alert('Followed successfully!');
                document.getElementById('followerCount').textContent = response.data.followers.length;
            } else {
                alert('Error following user: ' + response.errors[0].message);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    });

    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            window.location.href = 'editProfile.html'; // Redirect to edit profile page
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

// Ensure viewPost is defined in the global scope
window.viewPost = function(postId) {
    window.location.href = `singlePost.html?postId=${postId}`;
};
