<?php
session_start();
require_once 'connect.php';
$conn = DB::connect();

// ✅ Ensure only logged-in students can access
if (!isset($_SESSION['student_id'])) {
    header("Location: student_login.php");
    exit();
}

$student_id = $_SESSION['student_id'];

// Fetch programs list
$programs = $conn->query("SELECT * FROM Exchange_Program");

// Fetch student info
$stmt = $conn->prepare("SELECT name, email, dob, nationality, contact FROM Student WHERE student_id = ?");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$student_result = $stmt->get_result();
$student_data = $student_result->fetch_assoc();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['program_id'])) {
    $program_id = (int)$_POST['program_id'];
    $app_id = rand(10000, 99999);

    $stmt = $conn->prepare("INSERT INTO Exchange_Applications (application_id, program_id, status, application_date) VALUES (?, ?, 'Pending', NOW())");
    $stmt->bind_param("ii", $app_id, $program_id);
    $stmt->execute();

    $stmt2 = $conn->prepare("INSERT INTO StudentAppliesForExchangeProgram (student_id, application_id, program_id) VALUES (?, ?, ?)");
    $stmt2->bind_param("iii", $student_id, $app_id, $program_id);
    $stmt2->execute();

    header("Location: student_dashboard.php?success=1");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Apply for Exchange Program</title>
    <style>
        body { font-family: Arial; padding: 30px; }
        label { display: block; margin-top: 10px; font-weight: bold; }
        input, select, textarea, button {
            padding: 10px;
            margin: 5px 0;
            width: 100%;
            max-width: 500px;
        }
    </style>
</head>
<body>
<h2>Exchange Program Application</h2>
<form method="POST">
    <label>Name:</label>
    <input type="text" name="name" value="<?= htmlspecialchars($student_data['name']) ?>">

    <label>Email:</label>
    <input type="email" name="email" value="<?= htmlspecialchars($student_data['email']) ?>">

    <label>Date of Birth:</label>
    <input type="date" name="dob" value="<?= htmlspecialchars($student_data['dob']) ?>">

    <label>Nationality:</label>
    <input type="text" name="nationality" value="<?= htmlspecialchars($student_data['nationality']) ?>">

    <label>Contact:</label>
    <input type="text" name="contact" value="<?= htmlspecialchars($student_data['contact']) ?>">

    <label for="program_id">Select Exchange Program:</label>
    <select name="program_id" required>
        <?php while ($row = $programs->fetch_assoc()): ?>
            <option value="<?= $row['program_id'] ?>">
                <?= htmlspecialchars($row['name']) ?> (Starts: <?= $row['start_date'] ?>)
            </option>
        <?php endwhile; ?>
    </select>

    <button type="submit">Submit Application</button>
</form>
</body>
</html>

