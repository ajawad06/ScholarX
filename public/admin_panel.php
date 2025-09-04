<?php
require_once 'connect.php';
$conn = DB::connect();

// --- Delete program or scholarship ---
if (isset($_GET['delete']) && isset($_GET['type'])) {
    $id = (int)$_GET['delete'];
    if ($_GET['type'] === 'program') {
        $conn->query("DELETE FROM Exchange_Program WHERE program_id = $id");
    } elseif ($_GET['type'] === 'scholarship') {
        $conn->query("DELETE FROM Scholarship WHERE scholarship_id = $id");
    }
    header("Location: admin_panel.php");
    exit();
}

// --- Add Exchange Program or Scholarship ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add program
    if (isset($_POST['program_name'])) {
        $stmt = $conn->prepare("INSERT INTO Exchange_Program (name, duration, requirements, start_date, university_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $_POST['program_name'], $_POST['duration'], $_POST['requirements'], $_POST['start_date'], $_POST['university_id']);
        $stmt->execute();
    }
    // Add scholarship
    elseif (isset($_POST['scholarship_name'])) {
        $stmt = $conn->prepare("INSERT INTO Scholarship (name, description, criteria, funding_organization, coverage, amount, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssd", $_POST['scholarship_name'], $_POST['description'], $_POST['criteria'], $_POST['funding'], $_POST['coverage'], $_POST['amount'], $_POST['deadline']);
        $stmt->execute();
    }
    // Add instructor
    elseif (isset($_POST['add_instructor'])) {
        $fname = $_POST['instructor_fname'];
        $mname = $_POST['instructor_mname'];
        $lname = $_POST['instructor_lname'];
        $email = $_POST['instructor_email'];
        $contact = $_POST['instructor_contact'];
        $department = $_POST['instructor_department'];
        $university_id = $_POST['university_id'];
        $password = password_hash($_POST['instructor_password'], PASSWORD_DEFAULT);

        $profile_pic = null;
        if (isset($_FILES['instructor_pic']) && $_FILES['instructor_pic']['error'] === 0) {
            $upload_dir = 'uploads/';
            if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);
            $filename = uniqid() . '_' . basename($_FILES['instructor_pic']['name']);
            $target_path = $upload_dir . $filename;

            if (move_uploaded_file($_FILES['instructor_pic']['tmp_name'], $target_path)) {
                $profile_pic = $target_path;
            }
        }

        $stmt = $conn->prepare("INSERT INTO Instructor (university_id, fname, mname, lname, email, contact, department, password, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssssss", $university_id, $fname, $mname, $lname, $email, $contact, $department, $password, $profile_pic);
        $stmt->execute();
    }
}

$programs = $conn->query("SELECT * FROM Exchange_Program");
$scholarships = $conn->query("SELECT * FROM Scholarship");
$instructors = $conn->query("SELECT * FROM Instructor");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Panel</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f9f9f9; }
        h2 { color: #2a4d69; }
        form { margin-bottom: 40px; background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 0 5px #ccc; }
        input, textarea, select, button { display: block; width: 100%; max-width: 500px; margin: 8px 0; padding: 10px; }
        table { width: 100%; max-width: 900px; border-collapse: collapse; margin-top: 20px; background: #fff; box-shadow: 0 0 5px #ccc; }
        th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
        th { background-color: #f0f0f0; }
        a.delete, a.action { text-decoration: none; padding: 6px 10px; border-radius: 4px; }
        a.delete { background: #e74c3c; color: white; }
        .nav { margin-bottom: 30px; }
        .nav a { margin-right: 15px; background: #2a4d69; color: white; padding: 10px 15px; border-radius: 4px; text-decoration: none; }
    </style>
</head>
<body>

<div class="nav">
    <a href="add_student.php">➕ Add Student</a>
    <a href="view_students.php">👀 View Students</a>
    <a href="add_instructor.php">👨‍🏫 Add Instructor</a>
    <a href="view_instructor.php">📋 View Instructors</a>
</div>


<h2>Add Exchange Program</h2>
<form method="POST">
    <input name="program_name" placeholder="Program Name" required>
    <input name="duration" placeholder="Duration" required>
    <input name="requirements" placeholder="Requirements">
    <input type="date" name="start_date" required>
    <input type="number" name="university_id" placeholder="University ID" required>
    <input type="submit" value="Add Program">
</form>

<?php if ($programs->num_rows > 0): ?>
    <h3>Existing Exchange Programs</h3>
    <table>
        <tr><th>Name</th><th>Duration</th><th>University</th><th>Action</th></tr>
        <?php while ($row = $programs->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td><?= $row['duration'] ?></td>
                <td><?= $row['university_id'] ?></td>
                <td><a href="?delete=<?= $row['program_id'] ?>&type=program" class="delete">Delete</a></td>
            </tr>
        <?php endwhile; ?>
    </table>
<?php endif; ?>

<h2>Add Scholarship</h2>
<form method="POST">
    <input name="scholarship_name" placeholder="Scholarship Name" required>
    <textarea name="description" placeholder="Description" required></textarea>
    <input name="criteria" placeholder="Eligibility Criteria">
    <input name="funding" placeholder="Funding Organization">
    <input name="coverage" placeholder="Coverage">
    <input type="number" step="0.01" name="amount" placeholder="Amount">
    <input type="date" name="deadline" required>
    <input type="submit" value="Add Scholarship">
</form>

<?php if ($scholarships->num_rows > 0): ?>
    <h3>Existing Scholarships</h3>
    <table>
        <tr><th>Name</th><th>Amount</th><th>Deadline</th><th>Action</th></tr>
        <?php while ($row = $scholarships->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td><?= $row['amount'] ?></td>
                <td><?= $row['deadline'] ?></td>
                <td><a href="?delete=<?= $row['scholarship_id'] ?>&type=scholarship" class="delete">Delete</a></td>
            </tr>
        <?php endwhile; ?>
    </table>
<?php endif; ?>

<h2>Add Instructor</h2>
<form method="POST" enctype="multipart/form-data">
    <input type="text" name="instructor_fname" placeholder="First Name" required>
    <input type="text" name="instructor_mname" placeholder="Middle Name">
    <input type="text" name="instructor_lname" placeholder="Last Name" required>
    <input type="email" name="instructor_email" placeholder="Email" required>
    <input type="text" name="instructor_contact" placeholder="Contact Number" required>
    <input type="text" name="instructor_department" placeholder="Department" required>
    <input type="password" name="instructor_password" placeholder="Password" required>
    <input type="file" name="instructor_pic" accept="image/*" required>
    <input type="number" name="university_id" placeholder="University ID" required>
    <button type="submit" name="add_instructor">Add Instructor</button>
</form>

<?php if ($instructors->num_rows > 0): ?>
    <h3>Existing Instructors</h3>
    <table>
        <tr><th>Name</th><th>Email</th><th>Contact</th><th>Department</th><th>University</th><th>Profile Pic</th></tr>
        <?php while ($ins = $instructors->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($ins['fname'] . ' ' . $ins['mname'] . ' ' . $ins['lname']) ?></td>
                <td><?= $ins['email'] ?></td>
                <td><?= $ins['contact'] ?></td>
                <td><?= $ins['department'] ?></td>
                <td><?= $ins['university_id'] ?></td>
                <td>
                    <?php if (!empty($ins['profile_pic'])): ?>
                        <img src="<?= htmlspecialchars($ins['profile_pic']) ?>" width="60" height="60" style="object-fit: cover; border-radius: 4px;">
                    <?php else: ?>No Pic<?php endif; ?>
                </td>
            </tr>
        <?php endwhile; ?>
    </table>
<?php endif; ?>

</body>
</html>

