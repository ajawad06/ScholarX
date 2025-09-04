<?php
session_start();
require_once 'connect.php';
$conn = DB::connect();

if (!isset($_SESSION['instructor_id'])) {
    header("Location: instructor_login.php");
    exit();
}

$message = ""; // ✅ Define $message at the top
$search = trim($_GET['search'] ?? ''); // ✅ Define $search

// === Handle Approval/Rejection ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $app_id = $_POST['application_id'];
    $type = $_POST['type'];
    $action = $_POST['action'];

    if ($type === 'exchange') {
        $stmt = $conn->prepare("UPDATE Exchange_Applications SET status = ?, approval_date = NOW() WHERE application_id = ?");
        $stmt->bind_param("si", $action, $app_id);
    } elseif ($type === 'scholarship') {
        $stmt = $conn->prepare("UPDATE Scholarship_Applications SET status = ?, approval_date = NOW() WHERE application_id = ?");
        $stmt->bind_param("si", $action, $app_id);
    }

    if ($stmt && $stmt->execute()) {
        $message = "✅ Application $action successfully.";
    } else {
        $message = "❌ Failed to update application.";
    }
}

// === Search condition ===
$like = "%$search%";

// === Exchange Applications ===
$exchange_apps = null;
$ex_stmt = $conn->prepare("
    SELECT ea.application_id, s.name AS student_name, s.gpa, u.name AS university, ep.name AS program_name, ea.status
    FROM Exchange_Applications ea
    JOIN StudentAppliesForExchangeProgram sp ON ea.application_id = sp.application_id
    JOIN Student s ON sp.student_id = s.student_id
    JOIN Exchange_Program ep ON ea.program_id = ep.program_id
    JOIN University u ON s.university_id = u.university_id
    WHERE ea.status = 'Pending' AND (s.name LIKE ? OR ep.name LIKE ?)
");
if ($ex_stmt) {
    $ex_stmt->bind_param("ss", $like, $like);
    $ex_stmt->execute();
    $exchange_apps = $ex_stmt->get_result();
}

// === Scholarship Applications ===
$scholarship_apps = null;
$sch_stmt = $conn->prepare("
    SELECT sa.application_id, s.name AS student_name, s.gpa, u.name AS university, sch.name AS scholarship_name, sa.status
    FROM Scholarship_Applications sa
    JOIN StudentAppliesForScholarship ss ON sa.application_id = ss.application_id
    JOIN Student s ON ss.student_id = s.student_id
    JOIN Scholarship sch ON sa.scholarship_id = sch.scholarship_id
    JOIN University u ON s.university_id = u.university_id
    WHERE sa.status = 'Pending' AND (s.name LIKE ? OR sch.name LIKE ?)
");
if ($sch_stmt) {
    $sch_stmt->bind_param("ss", $like, $like);
    $sch_stmt->execute();
    $scholarship_apps = $sch_stmt->get_result();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Approve Applications</title>
    <style>
        body { font-family: Arial; padding: 30px; background: #f4f6fa; }
        h2 { color: #2a4d69; }
        input[type='text'] { padding: 10px; width: 300px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; border: 1px solid #ccc; }
        th { background: #e0eafc; }
        form.inline { display: inline; }
        .success { color: green; margin-bottom: 15px; font-weight: bold; }
        button { padding: 6px 12px; margin: 2px; border: none; border-radius: 4px; cursor: pointer; }
        button[name="action"][value="Approved"] { background-color: #4CAF50; color: white; }
        button[name="action"][value="Rejected"] { background-color: #e74c3c; color: white; }
    </style>
</head>
<body>

<h2>📄 Review Student Applications</h2>

<?php if (!empty($message)): ?>
    <div class="success"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>

<form method="GET">
    🔍 <input type="text" name="search" value="<?= htmlspecialchars($search) ?>" placeholder="Search by student or program name">
    <input type="submit" value="Filter">
</form>

<h3>🌐 Exchange Program Applications</h3>
<?php if ($exchange_apps && $exchange_apps->num_rows > 0): ?>
    <table>
        <tr><th>Student</th><th>GPA</th><th>University</th><th>Program</th><th>Status</th><th>Actions</th></tr>
        <?php while ($row = $exchange_apps->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['student_name']) ?></td>
                <td><?= $row['gpa'] ?></td>
                <td><?= htmlspecialchars($row['university']) ?></td>
                <td><?= htmlspecialchars($row['program_name']) ?></td>
                <td><?= $row['status'] ?></td>
                <td>
                    <form method="POST" class="inline">
                        <input type="hidden" name="application_id" value="<?= $row['application_id'] ?>">
                        <input type="hidden" name="type" value="exchange">
                        <button name="action" value="Approved">✅ Approve</button>
                        <button name="action" value="Rejected">❌ Reject</button>
                    </form>
                </td>
            </tr>
        <?php endwhile; ?>
    </table>
<?php else: ?>
    <p>No pending exchange applications.</p>
<?php endif; ?>

<h3>🎓 Scholarship Applications</h3>
<?php if ($scholarship_apps && $scholarship_apps->num_rows > 0): ?>
    <table>
        <tr><th>Student</th><th>GPA</th><th>University</th><th>Scholarship</th><th>Status</th><th>Actions</th></tr>
        <?php while ($row = $scholarship_apps->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['student_name']) ?></td>
                <td><?= $row['gpa'] ?></td>
                <td><?= htmlspecialchars($row['university']) ?></td>
                <td><?= htmlspecialchars($row['scholarship_name']) ?></td>
                <td><?= $row['status'] ?></td>
                <td>
                    <form method="POST" class="inline">
                        <input type="hidden" name="application_id" value="<?= $row['application_id'] ?>">
                        <input type="hidden" name="type" value="scholarship">
                        <button name="action" value="Approved">✅ Approve</button>
                        <button name="action" value="Rejected">❌ Reject</button>
                    </form>
                </td>
            </tr>
        <?php endwhile; ?>
    </table>
<?php else: ?>
    <p>No pending scholarship applications.</p>
<?php endif; ?>

</body>
</html>

