<?php
require_once 'connect.php';
$db = DB::connect();

// Optional: handle delete
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $db->query("DELETE FROM Student WHERE student_id = $id");
    header("Location: view_students.php?deleted=1");
    exit;
}

$students = $db->query("
    SELECT s.*, u.name as university 
    FROM Student s
    JOIN University u ON s.university_id = u.university_id
");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View Students</title>
    <style>
        body { font-family: Arial; padding: 30px; background-color: #f9f9f9; }
        .container { max-width: 1000px; margin: auto; }
        .success { background-color: #e0ffe0; padding: 10px; border: 1px solid #b2d8b2; margin-bottom: 15px; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
        th { background-color: #f0f0f0; }
        .action { text-decoration: none; padding: 5px 10px; border-radius: 4px; }
        .edit { background-color: #4CAF50; color: white; }
        .delete { background-color: #e74c3c; color: white; margin-left: 5px; }
        .profile-pic { width: 60px; height: 60px; object-fit: cover; border-radius: 50px; border: 1px solid #ccc; }
    </style>
</head>
<body>
<div class="container">
    <h1>📋 Student Records</h1>

    <?php if (isset($_GET['success'])): ?>
        <div class="success">✅ Student added successfully!</div>
    <?php elseif (isset($_GET['deleted'])): ?>
        <div class="success">🗑️ Student deleted successfully!</div>
    <?php endif; ?>

    <table>
        <thead>
        <tr>
            <th>ID</th>
            <th>Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>University</th>
            <th>GPA</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <?php while ($student = $students->fetch_assoc()): ?>
            <tr>
                <td><?= $student['student_id'] ?></td>
                <td>
                    <?php if (!empty($student['profile_pic']) && file_exists($student['profile_pic'])): ?>
                        <img src="<?= htmlspecialchars($student['profile_pic']) ?>" alt="Profile" class="profile-pic">
                    <?php else: ?>
                        <span>No image</span>
                    <?php endif; ?>
                </td>
                <td><?= htmlspecialchars($student['name']) ?></td>
                <td><?= htmlspecialchars($student['email']) ?></td>
                <td><?= htmlspecialchars($student['university']) ?></td>
                <td><?= $student['gpa'] ?></td>
                <td>
                    <a href="edit_student.php?id=<?= $student['student_id'] ?>" class="action edit">Edit</a>
                    <a href="view_students.php?delete=<?= $student['student_id'] ?>" class="action delete"
                       onclick="return confirm('Are you sure you want to delete this student?');">Delete</a>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>
</div>
</body>
</html>

