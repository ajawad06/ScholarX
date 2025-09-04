<?php
require_once 'connect.php';
$conn = DB::connect();
$error = "";
$success = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = $_POST['name'];
    $email    = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Handle image upload
    $targetDir = "uploads/";
    $imageName = basename($_FILES["profile_picture"]["name"]);
    $targetFile = $targetDir . uniqid() . "_" . $imageName;
    $imageType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (in_array($imageType, $allowedTypes)) {
        if (move_uploaded_file($_FILES["profile_picture"]["tmp_name"], $targetFile)) {
            // Save in DB
            $stmt = $conn->prepare("INSERT INTO Student (name, email, password, profile_picture) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $name, $email, $password, $targetFile);

            if ($stmt->execute()) {
                $success = "Student registered successfully.";
            } else {
                $error = "Error saving student.";
            }

            $stmt->close();
        } else {
            $error = "Failed to upload image.";
        }
    } else {
        $error = "Only JPG, PNG, GIF allowed.";
    }
}
?>
