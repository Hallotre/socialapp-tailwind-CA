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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/social/posts/${postId}?_author=true&_comments=true`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'X-Noroff-API-Key': import.meta.env.VITE_API_KEY
            }
        });
        const data = await response.json();
        if (response.ok) {
            const currentUser = authService.getUser();
            const postContainer = document.getElementById('postContainer');
            const postTemplate = document.getElementById('postTemplate').content;
            const postElement = postTemplate.cloneNode(true);

            postElement.querySelector('img').src = data.data.author.avatar.url;
            postElement.querySelector('img').alt = data.data.author.name;
            postElement.querySelector('h3').textContent = data.data.author.name;
            postElement.querySelector('p.text-sm').textContent = new Date(data.data.created).toLocaleString();
            postElement.querySelector('h4').textContent = data.data.title;
            postElement.querySelector('p.mb-4').textContent = data.data.body;
            if (data.data.media) {
                const mediaElement = postElement.querySelector('img[alt="Post Media"]');
                mediaElement.src = data.data.media.url;
                mediaElement.classList.remove('hidden');
            }
            const editButton = postElement.querySelector('.edit-post-btn');
            const deleteButton = postElement.querySelector('.delete-post-btn');
            if (data.data.author.name === currentUser.name) {
                editButton.classList.remove('hidden');
                editButton.onclick = () => window.location.href = `editPost.html?postId=${data.data.id}`;
                deleteButton.classList.remove('hidden');
                deleteButton.onclick = () => deletePost(data.data.id);
            }
            postContainer.appendChild(postElement);

            const commentsContainer = document.getElementById('commentsContainer');
            const commentTemplate = document.getElementById('commentTemplate').content;
            data.data.comments.forEach(comment => {
                const commentElement = commentTemplate.cloneNode(true);
                commentElement.querySelector('img').src = comment.author.avatar.url;
                commentElement.querySelector('img').alt = comment.author.name;
                commentElement.querySelector('h4').textContent = comment.author.name;
                commentElement.querySelector('p.text-sm').textContent = new Date(comment.created).toLocaleString();
                commentElement.querySelector('p:not(.text-sm)').textContent = comment.body;
                commentsContainer.appendChild(commentElement);
            });
        } else {
            alert('Error loading post: ' + data.errors[0].message);
            window.location.href = 'feed.html';
        }
    } catch (error) {
        console.error('Error loading post:', error);
        window.location.href = 'feed.html';
    }

    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const content = document.getElementById('commentContent').value;

            const commentData = {
                body: content
            };

            try {
                const response = await postService.commentOnPost(postId, commentData);
                if (response.data) {
                    alert('Comment posted successfully!');
                    window.location.reload(); // Reload the page to show the new comment
                } else {
                    alert('Error posting comment: ' + response.errors[0].message);
                }
            } catch (error) {
                console.error('Error posting comment:', error);
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
});

async function deletePost(postId) {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) {
        return; // Exit the function if the user cancels the deletion
    }

    try {
        const success = await postService.deletePost(postId);
        if (success) {
            alert('Post deleted successfully!');
            window.location.href = 'feed.html'; // Redirect to feed page
        } else {
            alert('Error deleting post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}