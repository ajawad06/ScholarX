# 🎓 ScholarX  

A web-based system for managing **student exchange programs and scholarship applications and approvals**.  

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP 
- **Database:** MySQL 
- **Environment:** XAMPP / PhpStorm  

---

## ✨ Features
- **Authentication & Roles**
  - Student, Instructor, and Admin logins
  - Secure logout & session handling
  - Password hashing support

- **Student**
  - Register & log in
  - Browse **Program Catalog**
  - Apply to **Exchange** and **Scholarship** programs
  - Upload required documents/photos
  - View **dashboard** & track application status

- **Instructor**
  - Log in to **Instructor Dashboard**
  - Views students' applications and approves/rejects.

- **Admin**
  - Full authority over system data through **Admin Panel**
  - Add/Edit students and instructors
  - Add programs and scholarships 
  - View students/instructors/program lists

---

## 🚀 Setup Instructions  

### 1. Clone the Repository  
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Database Setup
- Import database.sql into your MySQL server.
- This will create the database schema and sample data.

### 3. Configure DB Connection
- Inside public/ folder, locate connect.sample.php
- Copy and rename to connect.php:
  ```bash
    cp public/connect.sample.php public/connect.php
  ```
- Open public/connect.php and update with your actual MySQL credentials.
  ```bash
  new mysqli(
    '127.0.0.1',     // host
    'root',          // your MySQL user
    'your_password', // your MySQL password
    'exchange_system', // database name
    3306             // port (default: 3306)
  );
  ```

### 4. Run the project
- Place the project folder inside your XAMPP `htdocs` directory.  
- Start **Apache** and **MySQL** from the XAMPP Control Panel.  
- Open your browser and go to:  
  [http://localhost/exchange-project/public](http://localhost/exchange-project/public)  
