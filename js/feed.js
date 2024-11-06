import { authService, postService } from './api.js';

async function loadPosts() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/social/posts?_author=true&_comments=true&_reactions=true`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-Noroff-API-Key': import.meta.env.VITE_API_KEY
        }
    });
    const data = await response.json();
    if (response.ok) {
        const postsList = document.getElementById('postsList');
        postsList.innerHTML = ''; // Clear existing posts
        const currentUser = authService.getUser();
        // console.log('Current User:', currentUser); // Debugging line
        data.data.forEach(post => {
            // console.log('Post Author:', post.author); // Debugging line
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <h3 onclick="viewPost(${post.id})">${post.title}</h3>
                <p>${post.body}</p>
                ${post.media ? `<img src="${post.media.url}" alt="Post media">` : ''}
                <p>Author: ${post.author.name}</p>
                <p>Comments: ${post._count.comments}</p>
                <p>Likes: ${post._count.reactions}</p>
                ${currentUser && currentUser.name === post.author.name ? `
                    <button onclick="editPost(${post.id})">Edit</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                ` : ''}
            `;
            postsList.appendChild(postElement);
        });
    } else {
        console.error('Error fetching posts:', data.errors);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

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
                    loadPosts(); // Refresh the posts list

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
            loadPosts(); // Refresh the posts list
        } else {
            alert('Error deleting post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Ensure deletePost, editPost, and viewPost are defined in the global scope
window.deletePost = deletePost;
window.editPost = function(postId) {
    window.location.href = `editPost.html?postId=${postId}`;
};
window.viewPost = function(postId) {
    window.location.href = `singlePost.html?postId=${postId}`;
};