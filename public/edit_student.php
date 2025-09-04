<?php
require_once 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = DB::connect();

    $stmt = $db->prepare("INSERT INTO Student (name, email, dob, nationality, contact, university_id, gpa) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        'sssssid',
        $_POST['name'],
        $_POST['email'],
        $_POST['dob'],
        $_POST['nationality'],
        $_POST['contact'],
        $_POST['university_id'],
        $_POST['gpa']
    );

    if ($stmt->execute()) {
        header("Location: view_students.php?success=1");
        exit;
    } else {
        $error = "Error adding student: " . $db->error;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Student</title>
    <style>
        body { font-family: Arial; padding: 30px; }
        .container { max-width: 600px; margin: auto; }
        input, select, button { width: 100%; padding: 10px; margin: 10px 0; }
        .alert { background: #fdd; color: #900; padding: 10px; margin-bottom: 10px; border: 1px solid #c00; }
    </style>
</head>
<body>
<div class="container">
    <h1>Add New Student</h1>

    <?php if (isset($error)): ?>
        <div class="alert">❌ <?= $error ?></div>
    <?php endif; ?>

    <form method="post">
        <label>Full Name: <input type="text" name="name" required></label>
        <label>Email: <input type="email" name="email" required></label>
        <label>Date of Birth: <input type="date" name="dob" required></label>
        <label>Nationality: <input type="text" name="nationality" required></label>
        <label>Contact: <input type="tel" name="contact" required></label>
        <label>University:
            <select name="university_id" required>
                <option value="1">NUST</option>
                <option value="2">MIT</option>
            </select>
        </label>
        <label>GPA: <input type="number" step="0.1" min="0" max="4" name="gpa" required></label>
        <button type="submit">➕ Add Student</button>
    </form>
</div>
</body>
</html>

