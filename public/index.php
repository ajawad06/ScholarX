<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Exchange & Scholarship System</title>
    <style>
        :root {
            --primary: #003366; /* Deep Blue */
            --accent: #0059b3;  /* Lighter Blue */
            --bg: #f7f9fc;
            --text-dark: #222;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background-color: var(--bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }

        .header {
            width: 100%;
            background: var(--primary);
            color: white;
            padding: 20px 0;
            text-align: center;
        }

        .logo {
            width: 60px;
            height: 60px;
            margin-bottom: 10px;
        }

        .container {
            background: white;
            margin-top: 40px;
            padding: 40px 50px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            text-align: center;
            max-width: 600px;
            width: 90%;
        }

        h1 {
            color: var(--primary);
            margin-bottom: 10px;
        }

        p {
            color: var(--text-dark);
            margin-bottom: 30px;
            font-size: 17px;
        }

        .role-buttons a {
            display: block;
            margin: 15px auto;
            padding: 14px 24px;
            background-color: var(--accent);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 17px;
            width: 80%;
            transition: background 0.3s ease;
        }

        .role-buttons a:hover {
            background-color: #004080;
        }

        @media (min-width: 600px) {
            .role-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
            }

            .role-buttons a {
                width: auto;
            }
        }

        .footer {
            margin-top: auto;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>

<div class="header">
    <img src="uploads/NUST-logo.png" alt="University Logo" class="logo">
    <h2>NUST Exchange Portal</h2>
</div>

<div class="container">
    <h1>🌐 Welcome to the Exchange & Scholarship System</h1>
    <p>This portal allows students to apply for international exchange programs and scholarships, and enables instructors and admins to manage and review applications efficiently.</p>

    <div class="role-buttons">
        <a href="student_login.php">👨‍🎓 Student Login</a>
        <a href="instructor_login.php">👩‍🏫 Instructor Login</a>
        <a href="admin_panel.php">🛠️ Admin Panel</a>
        <a href="program_catalog.php">📚 View Programs & Scholarships</a>

    </div>
</div>

<div class="footer">
    &copy; <?= date('Y') ?> National University. All rights reserved.
</div>

</body>
</html>
