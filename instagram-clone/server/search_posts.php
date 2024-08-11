<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$title = $conn->real_escape_string($data['title']);

$sql = "SELECT * FROM posts WHERE title LIKE '%$title%'";
$result = $conn->query($sql);

$posts = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $postId = $row['id'];

        // Fetch comments for each post
        $commentsSql = "SELECT * FROM comments WHERE post_id = $postId";
        $commentsResult = $conn->query($commentsSql);
        $comments = [];
        if ($commentsResult->num_rows > 0) {
            while ($commentRow = $commentsResult->fetch_assoc()) {
                $comments[] = $commentRow;
            }
        }
        $row['comments'] = $comments;
        $posts[] = $row;
    }
}

echo json_encode($posts);

$conn->close();
?>
