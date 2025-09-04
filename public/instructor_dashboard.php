<?php
session_start();
require_once 'connect.php';

if (!isset($_SESSION['instructor_id'])) {
    header("Location: instructor_login.php");
    exit();
}

$name = $_SESSION['instructor_name'];
$pic = $_SESSION['instructor_pic'];
?>

<!DOCTYPE html>
<html>
<head>
    <title>Instructor Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 30px;
            background-color: #eef2f3;
        }

        .dashboard-container {
            max-width: 800px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #2a4d69;
            margin-bottom: 20px;
        }

        .profile-section {
            text-align: center;
            margin-bottom: 20px;
        }

        .profile-pic {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 60px;
            border: 3px solid #2a4d69;
            margin-top: 10px;
        }

        .nav-links {
            text-align: center;
            margin-top: 30px;
        }

        .nav-links a, .logout-btn {
            display: inline-block;
            background-color: #2a4d69;
            color: white;
            padding: 10px 18px;
            border-radius: 5px;
            text-decoration: none;
            margin: 10px;
            font-size: 16px;
            transition: background 0.3s;
        }

        .nav-links a:hover, .logout-btn:hover {
            background-color: #1e3752;
        }

        .logout-btn {
            background-color: #e74c3c;
        }

        .logout-btn:hover {
            background-color: #c0392b;
        }
    </style>
</head>
<body>

<div class="dashboard-container">
    <h2>Welcome, <?= htmlspecialchars($name) ?> 👋</h2>

    <div class="profile-section">
        <?php if (!empty($pic) && file_exists($pic)): ?>
            <img src="<?= htmlspecialchars($pic) ?>" class="profile-pic" alt="Profile Picture">
        <?php else: ?>
            <p style="color: #888;">No profile picture available.</p>
        <?php endif; ?>
    </div>

    <div class="nav-links">
        <a href="approve_application.php">📄 Review Exchange Applications</a>
        <form method="POST" action="instructor_logout.php" style="display:inline;">
            <button type="submit" class="logout-btn">🚪 Logout</button>
        </form>
    </div>
</div>

</body>
</html>
