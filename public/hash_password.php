<?php
// hash_password.php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['plain_password'])) {
    $hashed = password_hash($_POST['plain_password'], PASSWORD_DEFAULT);
    echo "<strong>Hashed Password:</strong><br><input type='text' value='$hashed' readonly style='width: 100%;'>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Hash Password</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        input, button { padding: 10px; width: 100%; margin-top: 10px; }
    </style>
</head>
<body>
<h2>🔐 Password Hasher (For Admin Use)</h2>
<form method="POST">
    <input type="text" name="plain_password" placeholder="Enter password to hash" required>
    <button type="submit">Generate Hash</button>
</form>
</body>
</html>
