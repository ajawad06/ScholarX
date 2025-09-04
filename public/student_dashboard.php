<?php
session_start();
require_once 'connect.php';
$conn = DB::connect();

if (!isset($_SESSION['student_id'])) {
    header("Location: student_login.php");
    exit();
}

$student_id = $_SESSION['student_id'];
$student_name = $_SESSION['student_name'];
$student_pic = $_SESSION['student_pic'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Dashboard</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            background: #f6f8fa;
            color: #333;
        }

        .container {
            max-width: 1000px;
            margin: 50px auto;
            padding: 20px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        h2 {
            color: #2a4d69;
            margin-bottom: 20px;
        }

        .profile {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .profile-info {
            display: flex;
            align-items: center;
        }

        .profile img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 50%;
            border: 3px solid #ddd;
            margin-right: 20px;
        }

        .logout {
            font-size: 14px;
            text-decoration: none;
            color: white;
            background: #e74c3c;
            padding: 8px 16px;
            border-radius: 5px;
        }

        .nav-links {
            margin: 25px 0;
        }

        .nav-links a {
            background: #2a4d69;
            color: white;
            padding: 10px 20px;
            margin-right: 15px;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
        }

        .success {
            background: #e0ffe0;
            border: 1px solid #b2d8b2;
            padding: 10px;
            margin: 20px 0;
            border-radius: 5px;
            color: #2e7d32;
        }

        h3 {
            margin-top: 40px;
            color: #1c3b5e;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th, td {
            padding: 12px;
            border: 1px solid #ddd;
        }

        th {
            background-color: #2a4d69;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #f1f1f1;
        }

        p {
            color: #888;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="profile">
        <div class="profile-info">
            <?php if (!empty($student_pic) && file_exists($student_pic)): ?>
                <img src="<?= htmlspecialchars($student_pic) ?>" alt="Profile Picture">
            <?php endif; ?>
            <h2>Welcome, <?= htmlspecialchars($student_name) ?></h2>
        </div>
        <a href="student_logout.php" class="logout">🚪 Logout</a>
    </div>

    <div class="nav-links">
        <a href="student_application_form.php">Apply for Exchange Program</a>
        <a href="student_scholarship_apply.php">Apply for Scholarship</a>
    </div>

    <?php if (isset($_GET['success'])): ?>
        <div class="success">✅ Exchange program application submitted successfully!</div>
    <?php endif; ?>

    <?php if (isset($_GET['scholar_success'])): ?>
        <div class="success">✅ Scholarship application submitted successfully!</div>
    <?php endif; ?>

    <h3>📘 Your Exchange Applications</h3>
    <?php
    $query = "
        SELECT ep.name AS program_name, ea.status, ea.application_date, ea.approval_date
        FROM Exchange_Applications ea
        JOIN StudentAppliesForExchangeProgram sp ON ea.application_id = sp.application_id
        JOIN Exchange_Program ep ON ea.program_id = ep.program_id
        WHERE sp.student_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0): ?>
        <table>
            <tr><th>Program</th><th>Status</th><th>Applied On</th><th>Approved On</th></tr>
            <?php while ($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= htmlspecialchars($row['program_name']) ?></td>
                    <td><?= $row['status'] ?></td>
                    <td><?= $row['application_date'] ?></td>
                    <td><?= $row['approval_date'] ?? '---' ?></td>
                </tr>
            <?php endwhile; ?>
        </table>
    <?php else: ?>
        <p>No exchange applications found.</p>
    <?php endif;
    $stmt->close(); ?>

    <h3>🎓 Your Scholarship Applications</h3>
    <?php
    $query = "
        SELECT s.name AS scholarship_name, sa.status, sa.application_date, sa.approval_date
        FROM Scholarship_Applications sa
        JOIN StudentAppliesForScholarship ss ON sa.application_id = ss.application_id
        JOIN Scholarship s ON sa.scholarship_id = s.scholarship_id
        WHERE ss.student_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0): ?>
        <table>
            <tr><th>Scholarship</th><th>Status</th><th>Applied On</th><th>Approved On</th></tr>
            <?php while ($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= htmlspecialchars($row['scholarship_name']) ?></td>
                    <td><?= $row['status'] ?></td>
                    <td><?= $row['application_date'] ?></td>
                    <td><?= $row['approval_date'] ?? '---' ?></td>
                </tr>
            <?php endwhile; ?>
        </table>
    <?php else: ?>
        <p>No scholarship applications found.</p>
    <?php endif;
    $stmt->close(); ?>
</div>
</body>
</html>


