import { authService, postService } from './api.js';

export async function renderPosts(postsData, containerId) {
    const container = document.getElementById(containerId);
    const postTemplate = document.getElementById('postTemplate').content;
    const currentUser = authService.getUser(); // Get the current user
    container.innerHTML = ''; // Clear existing posts

    postsData.forEach(post => {
        console.log('post:', post); // Log each post to check its structure
        const postElement = postTemplate.cloneNode(true);
        const postAuthorLink = postElement.querySelector('a');

        if (post.author) {
            console.log('post.author:', post.author); // Log the author object to check its structure
            postAuthorLink.href = `profile.html?username=${post.author.name}`;
            postElement.querySelector('img').src = post.author.avatar?.url || '';
            postElement.querySelector('img').alt = post.author.name || 'Unknown';
            postElement.querySelector('h3').textContent = post.author.name || 'Unknown';
        } else {
            console.warn('post.author is undefined for post:', post); // Log a warning if post.author is undefined
            postAuthorLink.href = '#';
            postElement.querySelector('img').src = '';
            postElement.querySelector('img').alt = 'Unknown';
            postElement.querySelector('h3').textContent = 'Unknown';
        }

        postElement.querySelector('p.text-sm').textContent = new Date(post.created).toLocaleString();
        const postTitle = postElement.querySelector('.post-title');
        const postContent = postElement.querySelector('.post-content');
        postTitle.textContent = post.title || 'No title';
        postContent.textContent = post.body || 'No content';
        postTitle.onclick = () => window.location.href = `singlePost.html?postId=${post.id}`;
        postContent.onclick = () => window.location.href = `singlePost.html?postId=${post.id}`;
        if (post.media) {
            const mediaElement = postElement.querySelector('img[alt="Post Media"]');
            mediaElement.src = post.media.url;
            mediaElement.classList.remove('hidden');
        }
        const deleteButton = postElement.querySelector('.delete-post-btn');
        const editButton = postElement.querySelector('.edit-post-btn');
        if (post.author && post.author.name === currentUser.name) {
            deleteButton.classList.remove('hidden');
            deleteButton.onclick = () => deletePost(post.id);
            editButton.classList.remove('hidden');
            editButton.onclick = () => window.location.href = `editPost.html?postId=${post.id}`;
        }

        const commentsContainer = postElement.querySelector('.commentsContainer');
        const viewMoreCommentsBtn = postElement.querySelector('.view-more-comments-btn');
        const hideCommentsBtn = postElement.querySelector('.hide-comments-btn');

        if (post.comments.length > 0) {
            const comment = post.comments[0];
            const commentElement = document.createElement('div');
            commentElement.className = 'w-full bg-gray-600 p-4 rounded-lg mb-4';
            commentElement.innerHTML = `
                <div class="flex items-center mb-2">
                    <a href="profile.html?username=${comment.author.name}" class="flex items-center">
                        <img src="${comment.author.avatar.url}" alt="${comment.author.name}" class="w-8 h-8 rounded-full mr-3">
                        <div>
                            <h4 class="text-md font-semibold">${comment.author.name}</h4>
                        </div>
                    </a>
                    <p class="text-sm text-gray-400 ml-3">${new Date(comment.created).toLocaleString()}</p>
                </div>
                <p>${comment.body}</p>
            `;
            commentsContainer.appendChild(commentElement);
        } else {
            commentsContainer.classList.add('hidden'); // Hide the comments container if there are no comments
        }

        if (post.comments.length > 1) {
            viewMoreCommentsBtn.classList.remove('hidden');
            viewMoreCommentsBtn.onclick = () => {
                commentsContainer.innerHTML = ''; // Clear existing comments
                post.comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'w-full bg-gray-600 p-4 rounded-lg mb-4';
                    commentElement.innerHTML = `
                        <div class="flex items-center mb-2">
                            <a href="profile.html?username=${comment.author.name}" class="flex items-center">
                                <img src="${comment.author.avatar.url}" alt="${comment.author.name}" class="w-8 h-8 rounded-full mr-3">
                                <div>
                                    <h4 class="text-md font-semibold">${comment.author.name}</h4>
                                </div>
                            </a>
                            <p class="text-sm text-gray-400 ml-3">${new Date(comment.created).toLocaleString()}</p>
                        </div>
                        <p>${comment.body}</p>
                    `;
                    commentsContainer.appendChild(commentElement);
                });
                viewMoreCommentsBtn.classList.add('hidden'); // Hide the button after expanding comments
                hideCommentsBtn.classList.remove('hidden'); // Show the hide comments button
            };
        }

        hideCommentsBtn.onclick = () => {
            commentsContainer.innerHTML = ''; // Clear existing comments
            if (post.comments.length > 0) {
                const comment = post.comments[0];
                const commentElement = document.createElement('div');
                commentElement.className = 'w-full bg-gray-600 p-4 rounded-lg mb-4';
                commentElement.innerHTML = `
                    <div class="flex items-center mb-2">
                        <a href="profile.html?username=${comment.author.name}" class="flex items-center">
                            <img src="${comment.author.avatar.url}" alt="${comment.author.name}" class="w-8 h-8 rounded-full mr-3">
                            <div>
                                <h4 class="text-md font-semibold">${comment.author.name}</h4>
                            </div>
                        </a>
                        <p class="text-sm text-gray-400 ml-3">${new Date(comment.created).toLocaleString()}</p>
                    </div>
                    <p>${comment.body}</p>
                `;
                commentsContainer.appendChild(commentElement);
            }
            viewMoreCommentsBtn.classList.remove('hidden');
            hideCommentsBtn.classList.add('hidden');
        };

        const commentForm = postElement.querySelector('.commentForm');
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const content = commentForm.querySelector('textarea[name="content"]').value;
            const commentData = {
                body: content
            };
            try {
                const response = await postService.commentOnPost(post.id, commentData);
                if (response.data) {
                    alert('Comment posted successfully!');
                    renderPosts(postsData, containerId); // Reload the posts list to show the new comment
                } else {
                    alert('Error posting comment: ' + response.errors[0].message);
                }
            } catch (error) {
                console.error('Error posting comment:', error);
            }
        });

        container.appendChild(postElement);
    });
}