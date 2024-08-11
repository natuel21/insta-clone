document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchPosts(searchTerm);
        } else {
            fetchPosts(); // Fetch all posts if search term is empty
        }
    });

    async function fetchPosts() {
        try {
            const response = await fetch('server/fetch_posts.php');
            const posts = await response.json();
            renderPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    async function searchPosts(title) {
        try {
            const response = await fetch('server/search_posts.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            const posts = await response.json();
            if (posts.length > 0) {
                renderPosts(posts, title);
                scrollToPost(posts[0].id); // Scroll to the first matched post
            } else {
                alert('No posts found.');
            }
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    }

    function renderPosts(posts, searchTerm = '') {
        const feed = document.querySelector('.feed');
        feed.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.id = `post-${post.id}`;

            // Highlight the post if it matches the search term
            if (searchTerm && post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                postElement.classList.add('highlight');
            }

            postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.description}</p>
            <img src="${post.image}" alt="Post image"> <!-- Ensure 'post.image' matches the image path structure -->
            <div class="actions">
                    <button class="like" onclick="likePost(${post.id})"><i class="fas fa-heart"></i> Like (${post.likes})</button>
                    <button class="comment-button" onclick="toggleComments(${post.id})"><i class="fas fa-comment"></i> Comment (${post.comment_count})</button>
                    <button class="share" onclick="sharePost(${post.id})"><i class="fas fa-share"></i> Share (${post.shares})</button>
                    <button class="cart" onclick="goToShop(${post.id})"><i class="fas fa-shopping-cart"></i> Cart</button>
                    ${post.sold_out ? '<span class="sold-out">Sold Out</span>' : ''}
                </div>
                <div class="comments-section" id="comments-section-${post.id}" style="display: none;">
                    <div class="comments" id="comments-${post.id}">
                        ${renderComments(post.comments)}
                    </div>
                    <div class="comment-form">
                        <input type="text" id="user-name-input-${post.id}" placeholder="Your name">
                        <input type="text" id="comment-input-${post.id}" placeholder="Add a comment">
                        <button onclick="addComment(${post.id})">Post</button>
                    </div>
                </div>
            `;

            feed.appendChild(postElement);
        });
    }

    function renderComments(comments) {
        return comments.map(comment => `
            <div class='comment' data-id='${comment.id}'>
                <span class='user-name'>${comment.user_name}:</span>
                <span class='comment-text'>${comment.comment}</span>
                <button class='like-comment' onclick='likeComment(${comment.id}, ${comment.post_id})'><i class='fas fa-heart'></i> Like</button>
                <span class='comment-likes'>(${comment.likes})</span>
            </div>
        `).join('');
    }

    function scrollToPost(postId) {
        const postElement = document.getElementById(`post-${postId}`);
        if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    window.toggleComments = (postId) => {
        const commentsSection = document.getElementById(`comments-section-${postId}`);
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    };

    window.addComment = async (postId) => {
        const commentInput = document.getElementById(`comment-input-${postId}`);
        const userNameInput = document.getElementById(`user-name-input-${postId}`);
        const comment = commentInput.value;
        const userName = userNameInput.value;

        if (comment && userName) {
            try {
                const response = await fetch('server/comment.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId, comment, userName })
                });
                const result = await response.json();
                if (result.success) {
                    const commentsContainer = document.getElementById(`comments-${postId}`);
                    commentsContainer.innerHTML = renderComments(result.comments);
                    commentInput.value = '';
                    userNameInput.value = '';
                    updateCommentCount(postId, result.comments.length);
                } else {
                    console.error('Error adding comment:', result.error);
                }
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        } else {
            alert('Please enter both your name and a comment.');
        }
    };

    window.likePost = async (postId) => {
        try {
            const macAddress = 'example-mac-address'; // Replace with actual method to get MAC address
            const response = await fetch('server/like.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, macAddress })
            });
            const result = await response.json();
            if (result.success) {
                updatePostLikes(postId, result.likes);
            } else {
                alert(result.message || 'Error liking post');
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    window.likeComment = async (commentId, postId) => {
        try {
            const macAddress = 'example-mac-address'; // Replace with actual method to get MAC address
            const response = await fetch('server/like_comment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId, macAddress })
            });
            const result = await response.json();
            if (result.success) {
                updateCommentLikes(commentId, postId, result.likes);
            } else {
                alert(result.message || 'Error liking comment');
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    function updatePostLikes(postId, likes) {
        const postElement = document.querySelector(`.post button[onclick="likePost(${postId})"]`);
        postElement.innerHTML = `<i class="fas fa-heart"></i> Like (${likes})`;
    }

    function updateCommentLikes(commentId, postId, likes) {
        const commentElement = document.querySelector(`#comments-${postId} .comment[data-id="${commentId}"] .comment-likes`);
        commentElement.textContent = `(${likes})`;
    }

    function updateCommentCount(postId, count) {
        const commentButton = document.querySelector(`.post button[onclick="toggleComments(${postId})"]`);
        commentButton.innerHTML = `<i class="fas fa-comment"></i> Comment (${count})`;
    }

    window.sharePost = async (postId) => {
        try {
            const response = await fetch('server/share.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId })
            });
            const result = await response.json();
            if (result.success) {
                updatePostShares(postId, result.shares);
            } else {
                console.error('Error sharing post:', result.error);
            }
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    function updatePostShares(postId, shares) {
        const postElement = document.querySelector(`.post button[onclick="sharePost(${postId})"]`);
        postElement.innerHTML = `<i class="fas fa-share"></i> Share (${shares})`;
    }

    window.goToShop = (postId) => {
        window.location.href = `shop.html?postId=${postId}`;
    };

    fetchPosts();
});
