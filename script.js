document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const postsContainer = document.getElementById('postsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const postForm = document.getElementById('postForm');
    const postContent = document.getElementById('postContent');
    const postImage = document.getElementById('postImage');
    const imagePreview = document.getElementById('imagePreview');
    const profileForm = document.getElementById('profileForm');
    const usernameInput = document.getElementById('username');
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePicPreview = document.getElementById('profilePicPreview');
    const currentProfilePic = document.getElementById('currentProfilePic');
    const changeProfilePicBtn = document.getElementById('changeProfilePicBtn');
    const removeProfilePicBtn = document.getElementById('removeProfilePicBtn');
    const editPostForm = document.getElementById('editPostForm');
    const editPostContent = document.getElementById('editPostContent');
    const editPostImage = document.getElementById('editPostImage');
    const editImagePreview = document.getElementById('editImagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const deletePostBtn = document.getElementById('deletePostBtn');
    const editPostId = document.getElementById('editPostId');
    const logoutBtn = document.getElementById('logoutBtn');

    // State
    let currentUser = {
        id: 'user1',
        name: 'John Doe',
        profilePic: 'https://via.placeholder.com/150'
    };
    
    let posts = [
        {
            id: 'post1',
            userId: 'user1',
            userName: 'John Doe',
            userPic: 'https://via.placeholder.com/150',
            content: 'Just enjoying a beautiful day at the beach! 🏖️ #summer #vacation',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            timestamp: new Date('2023-06-15T10:30:00'),
            likes: 24,
            comments: 5,
            isLiked: false
        },
        {
            id: 'post2',
            userId: 'user2',
            userName: 'Jane Smith',
            userPic: 'https://via.placeholder.com/150/0000FF/FFFFFF',
            content: 'Check out this amazing recipe I tried today! So delicious and easy to make.',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            timestamp: new Date('2023-06-14T18:45:00'),
            likes: 42,
            comments: 12,
            isLiked: true
        },
        {
            id: 'post3',
            userId: 'user1',
            userName: 'John Doe',
            userPic: 'https://via.placeholder.com/150',
            content: 'No image post, just sharing some thoughts. Sometimes the simplest things in life bring the most joy.',
            image: null,
            timestamp: new Date('2023-06-12T08:15:00'),
            likes: 8,
            comments: 2,
            isLiked: false
        }
    ];

    // Initialize the app
    function init() {
        // Set current user info
        usernameInput.value = currentUser.name;
        profilePicPreview.src = currentUser.profilePic;
        currentProfilePic.src = currentUser.profilePic;
        
        // Load posts
        loadPosts();
        
        // Hide loading spinner after initial load
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
        }, 500);
    }

    // Load posts into the UI
    function loadPosts() {
        postsContainer.innerHTML = '';
        
        // Sort posts by timestamp (newest first)
        const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedPosts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }

    // Create a post element
    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post-card fade-in';
        
        // Format timestamp
        const formattedTime = formatTime(post.timestamp);
        
        // Check if the post belongs to the current user
        const isCurrentUserPost = post.userId === currentUser.id;
        
        // Create post HTML
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.userPic}" alt="${post.userName}" class="post-user-img">
                <div class="post-user-info">
                    <h6 class="post-user-name mb-0">${post.userName}</h6>
                    <small class="post-time">${formattedTime}</small>
                </div>
                ${isCurrentUserPost ? `<div class="post-menu" data-post-id="${post.id}">
                    <i class="fas fa-ellipsis-h"></i>
                </div>` : ''}
            </div>
            <div class="post-content">
                <p class="post-text">${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image mb-2">` : ''}
            </div>
            <div class="post-actions">
                <div class="d-flex align-items-center">
                    <span class="post-action ${post.isLiked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
                        <i class="fas fa-heart me-1"></i>
                        <span class="like-count">${post.likes}</span>
                    </span>
                </div>
                <div class="d-flex align-items-center">
                    <span class="post-action" data-action="comment" data-post-id="${post.id}">
                        <i class="fas fa-comment me-1"></i>
                        <span>${post.comments}</span>
                    </span>
                </div>
                <div class="d-flex align-items-center">
                    <span class="post-action" data-action="share" data-post-id="${post.id}">
                        <i class="fas fa-share"></i>
                    </span>
                </div>
            </div>
        `;
        
        return postElement;
    }

    // Format timestamp
    function formatTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    // Event Listeners

    // Post form submission
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const content = postContent.value.trim();
        if (!content) return;
        
        // Create new post
        const newPost = {
            id: 'post' + Date.now(),
            userId: currentUser.id,
            userName: currentUser.name,
            userPic: currentUser.profilePic,
            content: content,
            image: imagePreview.src !== '#' ? imagePreview.src : null,
            timestamp: new Date(),
            likes: 0,
            comments: 0,
            isLiked: false
        };
        
        // Add to posts array
        posts.unshift(newPost);
        
        // Create and prepend new post element
        const postElement = createPostElement(newPost);
        postsContainer.prepend(postElement);
        
        // Reset form
        postContent.value = '';
        postImage.value = '';
        imagePreview.src = '#';
        imagePreview.classList.add('d-none');
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('postModal'));
        modal.hide();
    });

    // Image preview for new post
    postImage.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Profile form submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newUsername = usernameInput.value.trim();
        if (!newUsername) return;
        
        // Update current user
        currentUser.name = newUsername;
        currentUser.profilePic = profilePicPreview.src;
        
        // Update profile pic in header
        currentProfilePic.src = profilePicPreview.src;
        
        // Update all posts by this user
        posts.forEach(post => {
            if (post.userId === currentUser.id) {
                post.userName = newUsername;
                post.userPic = profilePicPreview.src;
            }
        });
        
        // Reload posts to reflect changes
        loadPosts();
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
        modal.hide();
    });

    // Change profile picture button
    changeProfilePicBtn.addEventListener('click', function() {
        profilePicInput.click();
    });

    // Profile picture input change
    profilePicInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profilePicPreview.src = e.target.result;
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Remove profile picture button
    removeProfilePicBtn.addEventListener('click', function() {
        profilePicPreview.src = 'https://via.placeholder.com/150';
    });

    // Logout button
    logoutBtn.addEventListener('click', function() {
        // In a real app, this would clear the session
        alert('Logged out successfully!');
    });

    // Post actions (like, comment, share)
    postsContainer.addEventListener('click', function(e) {
        const actionBtn = e.target.closest('[data-action]');
        const menuBtn = e.target.closest('.post-menu');
        
        if (actionBtn) {
            const action = actionBtn.getAttribute('data-action');
            const postId = actionBtn.getAttribute('data-post-id');
            const post = posts.find(p => p.id === postId);
            
            if (!post) return;
            
            if (action === 'like') {
                // Toggle like
                if (post.isLiked) {
                    post.likes--;
                } else {
                    post.likes++;
                }
                post.isLiked = !post.isLiked;
                
                // Update UI
                const likeCount = actionBtn.querySelector('.like-count');
                likeCount.textContent = post.likes;
                actionBtn.classList.toggle('liked');
            } else if (action === 'comment') {
                alert('Comment functionality would be implemented here!');
            } else if (action === 'share') {
                alert('Share functionality would be implemented here!');
            }
        } else if (menuBtn) {
            const postId = menuBtn.getAttribute('data-post-id');
            const post = posts.find(p => p.id === postId);
            
            if (post) {
                // Open edit modal
                editPostId.value = post.id;
                editPostContent.value = post.content;
                
                if (post.image) {
                    editImagePreview.src = post.image;
                    editImagePreview.style.display = 'block';
                    removeImageBtn.style.display = 'block';
                } else {
                    editImagePreview.style.display = 'none';
                    removeImageBtn.style.display = 'none';
                }
                
                const modal = new bootstrap.Modal(document.getElementById('editPostModal'));
                modal.show();
            }
        }
    });

    // Edit post form submission
    editPostForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const postId = editPostId.value;
        const post = posts.find(p => p.id === postId);
        
        if (!post) return;
        
        // Update post
        post.content = editPostContent.value.trim();
        
        // Handle image changes
        if (editPostImage.files && editPostImage.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                post.image = e.target.result;
                updatePostInUI(post);
            }
            
            reader.readAsDataURL(editPostImage.files[0]);
        } else {
            updatePostInUI(post);
        }
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
        modal.hide();
    });

    // Remove image button in edit modal
    removeImageBtn.addEventListener('click', function() {
        const postId = editPostId.value;
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            post.image = null;
            editImagePreview.style.display = 'none';
            this.style.display = 'none';
        }
    });

    // Delete post button
    deletePostBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this post?')) {
            const postId = editPostId.value;
            posts = posts.filter(p => p.id !== postId);
            
            // Remove from UI
            const postElement = document.querySelector(`.post-menu[data-post-id="${postId}"]`)?.closest('.post-card');
            if (postElement) {
                postElement.remove();
            }
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
            modal.hide();
        }
    });

    // Image preview for edit post
    editPostImage.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                editImagePreview.src = e.target.result;
                editImagePreview.style.display = 'block';
                removeImageBtn.style.display = 'block';
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Update post in UI
    function updatePostInUI(post) {
        const postElement = document.querySelector(`.post-menu[data-post-id="${post.id}"]`)?.closest('.post-card');
        if (postElement) {
            const newPostElement = createPostElement(post);
            postElement.replaceWith(newPostElement);
        }
    }

    // Initialize the app
    init();
});