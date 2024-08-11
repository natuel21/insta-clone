<?php
include 'db.php';

// Fetch all posts from the database
$postSql = "SELECT * FROM posts";
$postResult = $conn->query($postSql);

$posts = array();
while ($postRow = $postResult->fetch_assoc()) {
    $postId = $postRow['id'];
    
    // Fetch comments for each post
    $commentSql = "SELECT * FROM comments WHERE post_id = $postId";
    $commentResult = $conn->query($commentSql);
    
    $comments = array();
    while ($commentRow = $commentResult->fetch_assoc()) {
        $comments[] = $commentRow;
    }

    $postRow['comments'] = $comments;
    $postRow['comment_count'] = count($comments);
    $posts[] = $postRow;
}

echo json_encode($posts);
?>
