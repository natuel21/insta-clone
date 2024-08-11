<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'];
$description = $data['description'];

$sql = "INSERT INTO posts (title, description) VALUES ('$title', '$description')";
if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error creating post: ' . $conn->error]);
}
?>
