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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/social/posts/${postId}?_author=true&_comments=true&_reactions=true`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'X-Noroff-API-Key': import.meta.env.VITE_API_KEY
            }
        });
        const data = await response.json();
        if (response.ok) {
            const currentUser = authService.getUser();
            const postContainer = document.getElementById('postContainer');
            postContainer.innerHTML = `
                <h3>${data.data.title}</h3>
                <p>${data.data.body}</p>
                ${data.data.media ? `<img src="${data.data.media.url}" alt="Post media">` : ''}
                <p>Author: ${data.data.author.name}</p>
                <p>Comments: ${data.data._count.comments}</p>
                <p>Likes: ${data.data._count.reactions}</p>
                ${currentUser && currentUser.name === data.data.author.name ? `
                    <button onclick="editPost(${data.data.id})">Edit</button>
                    <button onclick="deletePost(${data.data.id})">Delete</button>
                ` : ''}
            `;

            const commentsContainer = document.getElementById('commentsContainer');
            data.data.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.innerHTML = `
                    <p>${comment.body}</p>
                    <p>By: ${comment.author.name}</p>
                `;
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

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authService.logout();
            window.location.href = 'index.html'; // Redirect to login page
        });
    }
});

window.deletePost = async function(postId) {
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
};

window.editPost = function(postId) {
    window.location.href = `editPost.html?postId=${postId}`;
};