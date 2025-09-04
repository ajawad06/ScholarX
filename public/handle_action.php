<?php
session_start();
require_once 'connect.php';
$conn = DB::connect();

// Ensure the instructor is logged in
if (!isset($_SESSION['instructor_id']) || !isset($_SESSION['university_id'])) {
    header("Location: instructor_login.php");
    exit();
}

$instructor_id = $_SESSION['instructor_id'];
$university_id = $_SESSION['university_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['application_id'], $_POST['action'], $_POST['app_type'])) {
    $application_id = (int)$_POST['application_id'];
    $action = $_POST['action'] === 'Approve' ? 'Approved' : 'Rejected';
    $type = $_POST['app_type'];

    if ($type === 'exchange') {
        // Update status in Exchange_Applications
        $stmt = $conn->prepare("UPDATE Exchange_Applications SET status = ?, approval_date = NOW() WHERE application_id = ?");
        $stmt->bind_param("si", $action, $application_id);
        $stmt->execute();

        // Insert approval into InstructorApprovesExchangeApplications
        if ($action === 'Approved') {
            $program_id_query = $conn->query("SELECT program_id FROM Exchange_Applications WHERE application_id = $application_id");
            $row = $program_id_query->fetch_assoc();
            $program_id = $row['program_id'];

            $check = $conn->prepare("SELECT * FROM InstructorApprovesExchangeApplications WHERE instructor_id = ? AND instructor_uni_id = ? AND application_id = ? AND program_id = ?");
            $check->bind_param("iiii", $instructor_id, $university_id, $application_id, $program_id);
            $check->execute();
            $res = $check->get_result();
            if ($res->num_rows === 0) {
                $insert = $conn->prepare("INSERT INTO InstructorApprovesExchangeApplications (instructor_id, instructor_uni_id, application_id, program_id) VALUES (?, ?, ?, ?)");
                $insert->bind_param("iiii", $instructor_id, $university_id, $application_id, $program_id);
                $insert->execute();
                $insert->close();
            }
        }

        $stmt->close();
    }

    elseif ($type === 'scholarship') {
        // Update status in Scholarship_Applications
        $stmt = $conn->prepare("UPDATE Scholarship_Applications SET status = ?, approval_date = NOW() WHERE application_id = ?");
        $stmt->bind_param("si", $action, $application_id);
        $stmt->execute();

        // Insert approval into InstructorApprovesScholarshipApplications
        if ($action === 'Approved') {
            $sch_query = $conn->query("SELECT scholarship_id FROM Scholarship_Applications WHERE application_id = $application_id");
            $row = $sch_query->fetch_assoc();
            $scholarship_id = $row['scholarship_id'];

            $check = $conn->prepare("SELECT * FROM InstructorApprovesScholarshipApplications WHERE instructor_id = ? AND instructor_uni_id = ? AND application_id = ? AND scholarship_id = ?");
            $check->bind_param("iiii", $instructor_id, $university_id, $application_id, $scholarship_id);
            $check->execute();
            $res = $check->get_result();
            if ($res->num_rows === 0) {
                $insert = $conn->prepare("INSERT INTO InstructorApprovesScholarshipApplications (instructor_id, instructor_uni_id, application_id, scholarship_id) VALUES (?, ?, ?, ?)");
                $insert->bind_param("iiii", $instructor_id, $university_id, $application_id, $scholarship_id);
                $insert->execute();
                $insert->close();
            }
        }

        $stmt->close();
    }

    // Redirect back to dashboard after action
    header("Location: instructor_dashboard.php");
    exit();
} else {
    die("Invalid request.");
}
?>
