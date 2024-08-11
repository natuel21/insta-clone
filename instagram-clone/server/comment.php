<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$postId = $data['postId'];
$comment = $data['comment'];
$userName = $data['userName'];

$sql = "INSERT INTO comments (post_id, comment, user_name) VALUES ($postId, '$comment', '$userName')";
if ($conn->query($sql) === TRUE) {
    // Fetch updated comments
    $commentSql = "SELECT * FROM comments WHERE post_id = $postId";
    $commentResult = $conn->query($commentSql);

    $comments = array();
    while ($row = $commentResult->fetch_assoc()) {
        $comments[] = $row;
    }

    echo json_encode(['success' => true, 'comments' => $comments]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
?>
