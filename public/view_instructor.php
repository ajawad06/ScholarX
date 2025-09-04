<?php
require_once 'connect.php';
$conn = DB::connect();
$instructors = $conn->query("SELECT * FROM Instructor");
?>

<!DOCTYPE html>
<html>
<head>
    <title>View Instructors</title>
    <style>
        body { font-family: Arial; padding: 30px; background: #f4f4f4; }
        table { width: 100%; border-collapse: collapse; background: white; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
        th { background: #2a4d69; color: white; }
        img { width: 50px; height: 50px; object-fit: cover; border-radius: 50%; }
        h2 { margin-bottom: 20px; color: #2a4d69; }
    </style>
</head>
<body>
<h2>Instructor Records</h2>

<table>
    <tr>
        <th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>University</th><th>Contact</th><th>Picture</th>
    </tr>
    <?php while ($row = $instructors->fetch_assoc()): ?>
        <tr>
            <td><?= $row['instructor_id'] ?></td>
            <td><?= $row['fname'] . ' ' . $row['mname'] . ' ' . $row['lname'] ?></td>
            <td><?= $row['email'] ?></td>
            <td><?= $row['department'] ?></td>
            <td><?= $row['university_id'] ?></td>
            <td><?= $row['contact'] ?></td>
            <td>
                <?php if (!empty($row['profile_pic']) && file_exists($row['profile_pic'])): ?>
                    <img src="<?= $row['profile_pic'] ?>" alt="Instructor Picture">
                <?php else: ?>
                    N/A
                <?php endif; ?>
            </td>
        </tr>
    <?php endwhile; ?>
</table>
</body>
</html>
