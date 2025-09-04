<?php
require_once 'connect.php';
$conn = DB::connect();

$programs = $conn->query("SELECT * FROM Exchange_Program");
$scholarships = $conn->query("SELECT * FROM Scholarship");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Programs & Scholarships Catalog</title>
    <style>
        body { font-family: Arial; padding: 30px; }
        h2 { color: #2a4d69; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th, td { padding: 10px; border: 1px solid #ccc; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>

<h1>🌐 Available Exchange Programs</h1>
<?php if ($programs->num_rows > 0): ?>
    <table>
        <tr>
            <th>Name</th>
            <th>Duration</th>
            <th>Requirements</th>
            <th>Start Date</th>
            <th>University ID</th>
        </tr>
        <?php while ($row = $programs->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td><?= $row['duration'] ?></td>
                <td><?= $row['requirements'] ?></td>
                <td><?= $row['start_date'] ?></td>
                <td><?= $row['university_id'] ?></td>
            </tr>
        <?php endwhile; ?>
    </table>
<?php else: ?>
    <p>No exchange programs available.</p>
<?php endif; ?>

<h1>🎓 Available Scholarships</h1>
<?php if ($scholarships->num_rows > 0): ?>
    <table>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Funding Org.</th>
            <th>Coverage</th>
            <th>Amount</th>
            <th>Deadline</th>
        </tr>
        <?php while ($row = $scholarships->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td><?= $row['description'] ?></td>
                <td><?= $row['funding_organization'] ?></td>
                <td><?= $row['coverage'] ?></td>
                <td><?= $row['amount'] ?></td>
                <td><?= $row['deadline'] ?></td>
            </tr>
        <?php endwhile; ?>
    </table>
<?php else: ?>
    <p>No scholarships available.</p>
<?php endif; ?>

</body>
</html>

