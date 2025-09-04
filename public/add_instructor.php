<?php
require_once 'connect.php';
$conn = DB::connect();

$success = $error = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fname = $_POST['fname'];
    $mname = $_POST['mname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $contact = $_POST['contact'];
    $department = $_POST['department'];
    $university_id = $_POST['university_id'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $profile_pic_path = null;

    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        $filename = uniqid() . "_" . basename($_FILES['profile_pic']['name']);
        $profile_pic_path = $upload_dir . $filename;
        move_uploaded_file($_FILES['profile_pic']['tmp_name'], $profile_pic_path);
    }

    $stmt = $conn->prepare("INSERT INTO Instructor (university_id, fname, mname, lname, email, contact, department, password, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssssss", $university_id, $fname, $mname, $lname, $email, $contact, $department, $password, $profile_pic_path);

    if ($stmt->execute()) {
        $success = "✅ Instructor added successfully!";
    } else {
        $error = "❌ Error: " . $stmt->error;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Add Instructor</title>
    <style>
        body { font-family: Arial; background: #f4f4f4; padding: 30px; }
        .container { background: #fff; padding: 25px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
        h2 { color: #2a4d69; }
        label { display: block; margin-top: 15px; font-weight: bold; }
        input, select { width: 100%; padding: 10px; margin-top: 5px; }
        button { background: #2a4d69; color: white; border: none; padding: 10px 15px; margin-top: 20px; cursor: pointer; }
        .success { background: #d4edda; padding: 10px; border: 1px solid #c3e6cb; margin-top: 10px; }
        .error { background: #f8d7da; padding: 10px; border: 1px solid #f5c6cb; margin-top: 10px; }
    </style>
</head>
<body>
<div class="container">
    <h2>Add Instructor</h2>

    <?php if ($success) echo "<div class='success'>$success</div>"; ?>
    <?php if ($error) echo "<div class='error'>$error</div>"; ?>

    <form method="POST" enctype="multipart/form-data">
        <label>First Name:</label>
        <input type="text" name="fname" required>

        <label>Middle Name:</label>
        <input type="text" name="mname">

        <label>Last Name:</label>
        <input type="text" name="lname" required>

        <label>Email:</label>
        <input type="email" name="email" required>

        <label>Password:</label>
        <input type="password" name="password" required>

        <label>Contact:</label>
        <input type="text" name="contact" required>

        <label>Department:</label>
        <input type="text" name="department" required>

        <label>University ID:</label>
        <input type="number" name="university_id" required>

        <label>Upload Profile Picture:</label>
        <input type="file" name="profile_pic" accept="image/*">

        <button type="submit">Add Instructor</button>
    </form>
</div>
</body>
</html>
