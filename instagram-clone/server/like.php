<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$postId = $data['postId'];
$macAddress = $data['macAddress']; // Assuming you have a way to get this on the server

// Insert a new like
$insertSql = "INSERT INTO post_likes (post_id, mac_address) VALUES ($postId, '$macAddress')";
if ($conn->query($insertSql) === TRUE) {
    $updateSql = "UPDATE posts SET likes = likes + 1 WHERE id = $postId";
    if ($conn->query($updateSql) === TRUE) {
        // Fetch the new likes count
        $likesCountResult = $conn->query("SELECT likes FROM posts WHERE id = $postId");
        if ($likesCountResult) {
            $likesCountRow = $likesCountResult->fetch_assoc();
            echo json_encode(['success' => true, 'likes' => $likesCountRow['likes']]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error fetching likes count.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
} else {
    // Check for duplicate entry error code
    if ($conn->errno === 1062) {
        echo json_encode(['success' => false, 'message' => 'You have already liked this post.']);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

$conn->close();
?>
