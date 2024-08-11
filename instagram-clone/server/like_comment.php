<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$commentId = $data['commentId'];
$macAddress = $data['macAddress'];

// Check if this user has already liked this comment
$checkSql = "SELECT * FROM comment_likes WHERE comment_id = $commentId AND mac_address = '$macAddress'";
$checkResult = $conn->query($checkSql);

if ($checkResult->num_rows == 0) {
    // Insert the like into the database
    $insertSql = "INSERT INTO comment_likes (comment_id, mac_address) VALUES ($commentId, '$macAddress')";
    if ($conn->query($insertSql) === TRUE) {
        // Update the comment likes count
        $updateSql = "UPDATE comments SET likes = likes + 1 WHERE id = $commentId";
        if ($conn->query($updateSql) === TRUE) {
            // Get the new likes count
            $likesSql = "SELECT likes FROM comments WHERE id = $commentId";
            $likesResult = $conn->query($likesSql);
            $likesRow = $likesResult->fetch_assoc();
            echo json_encode(['success' => true, 'likes' => $likesRow['likes']]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'You have already liked this comment.']);
}
?>
