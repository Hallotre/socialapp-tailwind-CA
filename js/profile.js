import { authService, profileService, postService } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!authService.isAuthenticated()) {
        alert('User not logged in. Please log in to view profiles.');
        window.location.href = 'index.html'; // Redirect to login page
        return; // Exit the function
    }

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const currentUser = authService.getUser();

    let userToView = currentUser;
    if (username && username !== currentUser.name) {
        userToView = { name: username };
        const editProfileBtn = document.getElementById('editProfileBtn');
        const postForm = document.getElementById('postForm');
        if (editProfileBtn) editProfileBtn.style.display = 'none'; // Hide edit profile button for other users
        if (postForm) postForm.style.display = 'none'; // Hide create post form for other users
    }

    try {
        const profile = await profileService.getProfile(userToView.name, { _followers: true, _following: true });
        const profileImage = document.getElementById('profileImage');
        const profileName = document.getElementById('profileName');
        const profileBio = document.getElementById('profileBio');
        const followerCount = document.getElementById('followerCount');
        const followingCount = document.getElementById('followingCount');
        const followBtn = document.getElementById('followBtn');

        if (profileImage) profileImage.src = profile.data.avatar.url || '';
        if (profileName) profileName.textContent = profile.data.name;
        if (profileBio) profileBio.textContent = profile.data.bio || 'No bio yet';
        if (followerCount) followerCount.textContent = profile.data._count.followers;
        if (followingCount) followingCount.textContent = profile.data._count.following;

        // Check if the current user is following the profile user
        const isFollowing = profile.data.followers?.some(follower => follower.name === currentUser.name);
        if (isFollowing) {
            followBtn.textContent = 'Unfollow';
        } else {
            followBtn.textContent = 'Follow';
        }

        followBtn.addEventListener('click', async () => {
            try {
                if (followBtn.textContent === 'Follow') {
                    const response = await profileService.followProfile(userToView.name);
                    if (response.data) {
                        alert('Followed successfully!');
                        followBtn.textContent = 'Unfollow';
                        if (followerCount) followerCount.textContent = response.data.followers.length;
                    } else {
                        alert('Error following user: ' + response.errors[0].message);
                    }
                } else {
                    const response = await profileService.unfollowProfile(userToView.name);
                    if (response.data) {
                        alert('Unfollowed successfully!');
                        followBtn.textContent = 'Follow';
                        if (followerCount) followerCount.textContent = response.data.followers.length;
                    } else {
                        alert('Error unfollowing user: ' + response.errors[0].message);
                    }
                }
            } catch (error) {
                console.error('Error following/unfollowing user:', error);
            }
        });

        await loadUserPosts(userToView.name);
        displayFollowers(profile.data.followers);
    } catch (error) {
        console.error('Error loading profile:', error);
    }

    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            window.location.href = 'editProfile.html'; // Redirect to edit profile page
        });
    }

    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const title = document.getElementById('postTitle').value;
            const body = document.getElementById('postContent').value;
            const mediaUrl = document.getElementById('mediaUrl').value;

            const postData = {
                title,
                body,
                media: mediaUrl ? { url: mediaUrl } : undefined
            };

            try {
                const response = await postService.createPost(postData);
                if (response.data) {
                    alert('Post created successfully!');
                    loadUserPosts(userToView.name); // Refresh the user's posts list

                    // Clear the input fields
                    document.getElementById('postTitle').value = '';
                    document.getElementById('postContent').value = '';
                    document.getElementById('mediaUrl').value = '';
                } else {
                    alert('Error creating post: ' + response.errors[0].message);
                }
            } catch (error) {
                console.error('Error creating post:', error);
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authService.logout();
            window.location.href = 'index.html'; // Redirect to login page
        });
    }

    const viewFollowersBtn = document.getElementById('viewFollowersBtn');
    const followersPopup = document.getElementById('followersPopup');
    const closeFollowersPopup = document.getElementById('closeFollowersPopup');

    if (viewFollowersBtn && followersPopup && closeFollowersPopup) {
        viewFollowersBtn.addEventListener('click', () => {
            followersPopup.style.display = 'block';
        });

        closeFollowersPopup.addEventListener('click', () => {
            followersPopup.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === followersPopup) {
                followersPopup.style.display = 'none';
            }
        });
    }
});

async function loadUserPosts(username) {
    try {
        const postsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/social/profiles/${username}/posts?_comments=true&_reactions=true`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'X-Noroff-API-Key': import.meta.env.VITE_API_KEY
            }
        });
        const postsData = await postsResponse.json();
        if (postsResponse.ok) {
            const userPostsList = document.getElementById('userPostsList');
            if (userPostsList) {
                userPostsList.innerHTML = ''; // Clear existing posts
                postsData.data.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.innerHTML = `
                        <h4 class="clickable-title" onclick="viewPost(${post.id})">${post.title}</h4>
                        <p>${post.body}</p>
                        ${post.media ? `<img src="${post.media.url}" alt="Post media">` : ''}
                        <p>Comments: ${post._count.comments}</p>
                    `;
                    userPostsList.appendChild(postElement);
                });
            }
        } else {
            console.error('Error fetching user posts:', postsData.errors);
        }
    } catch (error) {
        console.error('Error loading user posts:', error);
    }
}

function displayFollowers(followers) {
    const followersList = document.getElementById('followersList');
    if (followersList) {
        followersList.innerHTML = ''; // Clear existing followers
        followers.forEach(follower => {
            const followerElement = document.createElement('div');
            followerElement.innerHTML = `
                <p>${follower.name}</p>
            `;
            followersList.appendChild(followerElement);
        });
    }
}

// Ensure viewPost and viewProfile are defined in the global scope
window.viewPost = function(postId) {
    window.location.href = `singlePost.html?postId=${postId}`;
};

window.viewProfile = function(username) {
    window.location.href = `profile.html?username=${username}`;
};
