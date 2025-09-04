<?php
session_start();
require_once 'connect.php';
$conn = DB::connect();
$error = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['email']));
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM Instructor WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 1) {
        $row = $res->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['instructor_id'] = $row['instructor_id'];
            $_SESSION['instructor_name'] = $row['fname'] . " " . $row['lname'];
            $_SESSION['instructor_pic'] = $row['profile_pic'];
            header("Location: instructor_dashboard.php");
            exit();
        } else {
            $error = "❌ Incorrect password.";
        }
    } else {
        $error = "❌ No instructor found with that email.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Instructor Login</title>
    <style>
        body { font-family: Arial; padding: 50px; background-color: #f4f4f4; }
        form { max-width: 400px; margin: auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h2 { color: #2a4d69; }
        input { width: 100%; padding: 10px; margin: 10px 0; }
        button { background: #2a4d69; color: white; padding: 10px 15px; border: none; cursor: pointer; }
        .error { color: red; margin-top: 10px; }
    </style>
</head>
<body>

<form method="POST">
    <h2>Instructor Login</h2>
    <input name="email" type="email" placeholder="Email" required>
    <input name="password" type="password" placeholder="Password" required>
    <button type="submit">Login</button>
    <?php if (!empty($error)): ?>
        <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>
</form>

</body>
</html>
