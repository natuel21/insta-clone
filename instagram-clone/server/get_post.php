<?php
include 'db.php';

if (isset($_GET['postId'])) {
    $postId = intval($_GET['postId']);
    
    // Fetch post by ID
    $postSql = "SELECT * FROM posts WHERE id = $postId";
    $postResult = $conn->query($postSql);

    if ($postResult->num_rows > 0) {
        $post = $postResult->fetch_assoc();

        // Fetch comments for the post
        $commentSql = "SELECT * FROM comments WHERE post_id = $postId";
        $commentResult = $conn->query($commentSql);
        
        $comments = array();
        while ($commentRow = $commentResult->fetch_assoc()) {
            $comments[] = $commentRow;
        }

        $post['comments'] = $comments;
        $post['comment_count'] = count($comments);

        echo json_encode($post);
    } else {
        echo json_encode(null);
    }
} else {
    echo json_encode(null);
}

$conn->close();
?>
