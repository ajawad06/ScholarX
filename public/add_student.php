<?php
require_once 'connect.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

$error = "";
$success = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = DB::connect();

    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // hashed
    $dob = $_POST['dob'];
    $nationality = $_POST['nationality'];
    $contact = $_POST['contact'];
    $university_id = $_POST['university_id'];
    $gpa = $_POST['gpa'];

    // Handle profile picture
    $profile_pic = null;
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        $filename = uniqid() . '_' . basename($_FILES['profile_pic']['name']);
        $filepath = $upload_dir . $filename;

        if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $filepath)) {
            $profile_pic = $filepath;
        } else {
            $error = "❌ Failed to upload profile picture.";
        }
    }

    if (empty($error)) {
        $stmt = $db->prepare("INSERT INTO student (name, email, dob, nationality, contact, university_id, gpa, password, profile_pic)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssidss", $name, $email, $dob, $nationality, $contact, $university_id, $gpa, $password, $profile_pic);

        if ($stmt->execute()) {
            $success = "✅ Student added successfully.";
        } else {
            $error = "❌ Database error: " . $stmt->error;
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Add Student</title>
    <style>
        body { font-family: Arial; padding: 30px; background-color: #f0f0f0; }
        .container { max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        label { font-weight: bold; display: block; margin-top: 15px; }
        input, select, button { width: 100%; padding: 10px; margin-top: 5px; }
        .success { background: #e0ffe0; padding: 10px; border: 1px solid #b2d8b2; margin: 10px 0; border-radius: 4px; }
        .error { background: #ffe0e0; padding: 10px; border: 1px solid #d88; margin: 10px 0; border-radius: 4px; }
    </style>
</head>
<body>
<div class="container">
    <h2>➕ Add New Student</h2>

    <?php if ($success): ?>
        <div class="success"><?= htmlspecialchars($success) ?></div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="post" enctype="multipart/form-data">
        <label>Full Name:</label>
        <input type="text" name="name" required>

        <label>Email:</label>
        <input type="email" name="email" required>

        <label>Password:</label>
        <input type="password" name="password" required>

        <label>Date of Birth:</label>
        <input type="date" name="dob" required>

        <label>Nationality:</label>
        <input type="text" name="nationality" required>

        <label>Contact:</label>
        <input type="text" name="contact" required>

        <label>University:</label>
        <select name="university_id" required>
            <option value="1">NUST</option>
            <option value="2">MIT</option>
        </select>

        <label>GPA:</label>
        <input type="number" name="gpa" step="0.01" min="0" max="4" required>

        <label>Profile Picture:</label>
        <input type="file" name="profile_pic" accept="image/*" required>

        <button type="submit">Add Student</button>
    </form>
</div>
</body>
</html>
