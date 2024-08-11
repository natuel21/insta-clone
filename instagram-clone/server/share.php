<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$postId = $data['postId'];

$sql = "UPDATE posts SET shares = shares + 1 WHERE id = $postId";
if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
?>
