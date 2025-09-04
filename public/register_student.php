<?php
require_once 'connect.php';
$conn = DB::connect();

$error = "";
$success = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = strtolower(trim($_POST['email']));
    $dob = $_POST['dob'];
    $nationality = trim($_POST['nationality']);
    $contact = trim($_POST['contact']);
    $university_id = $_POST['university_id'];
    $gpa = $_POST['gpa'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $profile_pic = null;

    // Check for duplicate email
    $check = $conn->prepare("SELECT 1 FROM Student WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $existing = $check->get_result();
    if ($existing->num_rows > 0) {
        $error = "❌ A student with this email already exists.";
    }

    // Upload profile picture
    if (empty($error) && isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileName = uniqid() . "_" . basename($_FILES['profile_pic']['name']);
        $profile_pic = $uploadDir . $fileName;

        if (!move_uploaded_file($_FILES['profile_pic']['tmp_name'], $profile_pic)) {
            $error = "❌ Failed to upload profile picture.";
        }
    }

    // Insert student if everything is valid
    if (empty($error)) {
        $stmt = $conn->prepare("
            INSERT INTO Student 
            (name, email, dob, nationality, contact, university_id, gpa, password, profile_pic)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "sssssidss",
            $name, $email, $dob, $nationality, $contact, $university_id, $gpa, $password, $profile_pic
        );

        if ($stmt->execute()) {
            header("Location: student_login.php?registered=1");
            exit();
        } else {
            $error = "❌ Registration failed: " . $stmt->error;
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Registration</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #eef2f3;
            padding: 40px;
        }

        h2 {
            text-align: center;
            color: #2a4d69;
        }

        form {
            max-width: 550px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 12px rgba(0,0,0,0.1);
        }

        input, select {
            width: 100%;
            padding: 10px;
            margin-top: 12px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        input[type="submit"] {
            background-color: #2a4d69;
            color: white;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            border: none;
        }

        input[type="submit"]:hover {
            background-color: #1f355a;
        }

        .error {
            background: #ffe0e0;
            color: #c00;
            padding: 10px;
            border: 1px solid #d88;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
        }

        .success {
            background: #e0ffe0;
            color: #2e7d32;
            padding: 10px;
            border: 1px solid #b2d8b2;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
        }
    </style>
</head>
<body>

<h2>📋 Student Registration</h2>

<?php if (!empty($error)): ?>
    <div class="error"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<form method="POST" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="Full Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <input type="date" name="dob" required>
    <input type="text" name="nationality" placeholder="Nationality" required>
    <input type="tel" name="contact" placeholder="Contact Number" required>

    <label for="university_id">Select University:</label>
    <select name="university_id" required>
        <option value="">-- Choose University --</option>
        <option value="1">NUST</option>
        <option value="2">MIT</option>
        <!-- Add more as needed -->
    </select>

    <input type="number" step="0.01" min="0" max="4" name="gpa" placeholder="GPA" required>
    <label>Upload Profile Picture:</label>
    <input type="file" name="profile_pic" accept="image/*" required>

    <input type="submit" value="Register">
</form>

</body>
</html>
