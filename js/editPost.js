import { authService, postService } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    if (!postId) {
        alert('No post ID provided');
        window.location.href = 'feed.html';
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/social/posts/${postId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'X-Noroff-API-Key': import.meta.env.VITE_API_KEY
            }
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('editPostId').value = data.data.id;
            document.getElementById('editPostTitle').value = data.data.title;
            document.getElementById('editPostContent').value = data.data.body;
            document.getElementById('editMediaUrl').value = data.data.media ? data.data.media.url : '';
        } else {
            alert('Error loading post: ' + data.errors[0].message);
            window.location.href = 'feed.html';
        }
    } catch (error) {
        console.error('Error loading post:', error);
        window.location.href = 'feed.html';
    }

    const editPostForm = document.getElementById('editPostForm');
    editPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const postId = document.getElementById('editPostId').value;
        const title = document.getElementById('editPostTitle').value;
        const body = document.getElementById('editPostContent').value;
        const mediaUrl = document.getElementById('editMediaUrl').value;

        const postData = {
            title,
            body,
            media: mediaUrl ? { url: mediaUrl } : undefined
        };

        try {
            const response = await postService.updatePost(postId, postData);
            if (response.data) {
                alert('Post updated successfully!');
                history.back(); // Navigate back to the last visited page
            } else {
                alert('Error updating post: ' + response.errors[0].message);
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    });

    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            history.back(); // Navigate back to the last visited page
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