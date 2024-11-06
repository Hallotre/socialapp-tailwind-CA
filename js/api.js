const API_BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_API_KEY;

const endpoints = {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    posts: `${API_BASE_URL}/social/posts`,
    profiles: `${API_BASE_URL}/social/profiles`
};

const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': API_KEY
};

let currentUser = null;

export const authService = {
    async login(email, password) {
        const response = await fetch(endpoints.login, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || 'Login failed');
        }
        currentUser = data.data;
        // console.log('Login successful, currentUser:', currentUser); // Debugging line
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Store current user in localStorage
        return data;
    },
    async register(name, email, password, bio, avatar, banner) {
        const requestBody = {
            name,
            email,
            password,
            bio,
            avatar,
            banner
        };
        const response = await fetch(endpoints.register, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || 'Registration failed');
        }
        return data;
    },
    getUser() {
        if (!currentUser) {
            currentUser = JSON.parse(localStorage.getItem('currentUser')); // Retrieve current user from localStorage
            // console.log('Retrieved currentUser from localStorage:', currentUser); // Debugging line
        }
        return currentUser;
    },
    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    },
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        currentUser = null;
        console.log('User logged out'); // Debugging line
    }
};

export const postService = {
    async createPost(postData) {
        const response = await fetch(endpoints.posts, {
            method: 'POST',
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(postData)
        });
        return response.json();
    },
    async updatePost(id, postData) {
        const response = await fetch(`${endpoints.posts}/${id}`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(postData)
        });
        return response.json();
    },
    async deletePost(id) {
        const response = await fetch(`${endpoints.posts}/${id}`, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.ok;
    },

    async commentOnPost(id, commentData) {
        const response = await fetch(`${endpoints.posts}/${id}/comment`, {
            method: 'POST',
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(commentData)
        });
        return response.json();
    }
};

export const profileService = {
    async getProfile(name) {
        const response = await fetch(`${endpoints.profiles}/${name}`, {
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.json();
    },
    async updateProfile(name, profileData) {
        const response = await fetch(`${endpoints.profiles}/${name}`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(profileData)
        });
        return response.json();
    },
    async followProfile(name) {
        const response = await fetch(`${endpoints.profiles}/${name}/follow`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.json();
    },
    async unfollowProfile(name) {
        const response = await fetch(`${endpoints.profiles}/${name}/unfollow`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.json();
    }
};
