<?php
session_start();

// Destroy all session variables
session_unset();
session_destroy();

// Redirect to instructor login page
header("Location: instructor_login.php");
exit();
?>
