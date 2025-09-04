-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:4306
-- Generation Time: May 14, 2025 at 08:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exchange_system`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `approve_exchange_app` (IN `app_id` INT)   BEGIN
    UPDATE Exchange_Applications 
    SET status = 'Approved', approval_date = CURDATE()
    WHERE application_id = app_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `approve_scholarship_app` (IN `app_id` INT)   BEGIN
    UPDATE Scholarship_Applications 
    SET status = 'Approved', approval_date = CURDATE()
    WHERE application_id = app_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `exchange_applications`
--

CREATE TABLE `exchange_applications` (
  `application_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `application_date` date DEFAULT NULL,
  `approval_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exchange_applications`
--

INSERT INTO `exchange_applications` (`application_id`, `program_id`, `status`, `application_date`, `approval_date`) VALUES
(1, 1, 'Pending', '2025-04-01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `exchange_program`
--

CREATE TABLE `exchange_program` (
  `program_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `university_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exchange_program`
--

INSERT INTO `exchange_program` (`program_id`, `name`, `duration`, `requirements`, `start_date`, `university_id`) VALUES
(1, 'Fall Exchange', '6 months', 'GPA > 3.0', '2025-09-01', 2);

-- --------------------------------------------------------

--
-- Table structure for table `home_university`
--

CREATE TABLE `home_university` (
  `university_id` int(11) NOT NULL,
  `ranking` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `home_university`
--

INSERT INTO `home_university` (`university_id`, `ranking`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `instructor_id` int(11) NOT NULL,
  `university_id` int(11) NOT NULL,
  `fname` varchar(50) DEFAULT NULL,
  `mname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`instructor_id`, `university_id`, `fname`, `mname`, `lname`, `email`, `contact`, `department`) VALUES
(101, 1, 'Dr.', 'Naeem', 'Zafar', 'naeem.zafar@nust.edu.pk', '03001239876', 'AI & Data Science');

-- --------------------------------------------------------

--
-- Table structure for table `instructorapprovesexchangeapplications`
--

CREATE TABLE `instructorapprovesexchangeapplications` (
  `instructor_id` int(11) NOT NULL,
  `instructor_uni_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructorapprovesexchangeapplications`
--

INSERT INTO `instructorapprovesexchangeapplications` (`instructor_id`, `instructor_uni_id`, `application_id`, `program_id`) VALUES
(101, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `instructorapprovesscholarshipapplications`
--

CREATE TABLE `instructorapprovesscholarshipapplications` (
  `instructor_id` int(11) NOT NULL,
  `instructor_uni_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `scholarship_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructorapprovesscholarshipapplications`
--

INSERT INTO `instructorapprovesscholarshipapplications` (`instructor_id`, `instructor_uni_id`, `application_id`, `scholarship_id`) VALUES
(101, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `instructorsadvisestudents`
--

CREATE TABLE `instructorsadvisestudents` (
  `instructor_id` int(11) NOT NULL,
  `instructor_uni_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partner_university`
--

CREATE TABLE `partner_university` (
  `university_id` int(11) NOT NULL,
  `exchange_capacity` int(11) DEFAULT NULL,
  `eligibility_criteria` text DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partner_university`
--

INSERT INTO `partner_university` (`university_id`, `exchange_capacity`, `eligibility_criteria`, `contact`) VALUES
(2, 10, 'GPA > 3.0', 'contact@mit.edu');

-- --------------------------------------------------------

--
-- Table structure for table `scholarship`
--

CREATE TABLE `scholarship` (
  `scholarship_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `criteria` text DEFAULT NULL,
  `funding_organization` varchar(100) DEFAULT NULL,
  `coverage` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `deadline` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarship`
--

INSERT INTO `scholarship` (`scholarship_id`, `name`, `description`, `criteria`, `funding_organization`, `coverage`, `amount`, `deadline`) VALUES
(1, 'Merit Scholarship', 'Awarded to top students', 'GPA > 3.7', 'HEC', 'Tuition + Accommodation', 5000.00, '2025-08-01');

-- --------------------------------------------------------

--
-- Table structure for table `scholarship_applications`
--

CREATE TABLE `scholarship_applications` (
  `application_id` int(11) NOT NULL,
  `scholarship_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `application_date` date DEFAULT NULL,
  `approval_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarship_applications`
--

INSERT INTO `scholarship_applications` (`application_id`, `scholarship_id`, `status`, `application_date`, `approval_date`) VALUES
(1, 1, 'Pending', '2025-04-02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `university_id` int(11) DEFAULT NULL,
  `gpa` float DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `name`, `email`, `dob`, `nationality`, `contact`, `university_id`, `gpa`, `password`, `profile_pic`) VALUES
(3, 'maryam ubaid', 'umaryam1010@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$10$/m3B3JPMmFiRjXtYlvKHd.Y61zN4zY/H.GulLA64N8fizr8mt8bhS', 'uploads/WhatsApp Image 2025-03-31 at 2.02.38 PM.jpeg'),
(8, 'Sameen Umar', 'sameenumar123@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$10$JBmI0OUJdgcFGOoHbRcLE.yxUPTNFNKuVxGIKTHVYTFarWatD0fle', 'uploads/682377f5a796d_6823741a49ab5_WhatsApp Image 2025-05-13 at 9.25.37 PM.jpeg'),
(9, 'Sameen Umar', 'sameenumar123@gmail.com', '2005-12-29', 'Pakistani', '03239850976', 1, 3.4, '$2y$10$y.xtmPfD4PlYMZV1EpLgxuSywbl73w8GmJuD2Rx8pPXEeAk1wgHgy', '0');

--
-- Triggers `student`
--
DELIMITER $$
CREATE TRIGGER `after_student_insert` AFTER INSERT ON `student` FOR EACH ROW BEGIN
    INSERT INTO student_log(student_id, action)
    VALUES (NEW.student_id, 'INSERTED');
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `check_gpa_before_insert` BEFORE INSERT ON `student` FOR EACH ROW BEGIN
    IF NEW.gpa > 4.0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'GPA cannot exceed 4.0';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `studentappliesforexchangeprogram`
--

CREATE TABLE `studentappliesforexchangeprogram` (
  `student_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentappliesforscholarship`
--

CREATE TABLE `studentappliesforscholarship` (
  `student_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `scholarship_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_log`
--

CREATE TABLE `student_log` (
  `log_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `action` varchar(20) DEFAULT NULL,
  `log_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `university`
--

CREATE TABLE `university` (
  `university_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `university`
--

INSERT INTO `university` (`university_id`, `name`, `city`, `country`, `address`) VALUES
(1, 'NUST', 'Islamabad', 'Pakistan', 'Sector H-12'),
(2, 'MIT', 'Cambridge', 'USA', '77 Massachusetts Ave');

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_exchange_applications`
-- (See below for the actual view)
--
CREATE TABLE `view_exchange_applications` (
`student_id` int(11)
,`student_name` varchar(100)
,`program_name` varchar(100)
,`status` varchar(50)
,`application_date` date
,`approval_date` date
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_scholarship_applications`
-- (See below for the actual view)
--
CREATE TABLE `view_scholarship_applications` (
`student_id` int(11)
,`student_name` varchar(100)
,`scholarship_name` varchar(100)
,`status` varchar(50)
,`application_date` date
,`approval_date` date
);

-- --------------------------------------------------------

--
-- Table structure for table `visa_details`
--

CREATE TABLE `visa_details` (
  `id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `application_date` date DEFAULT NULL,
  `approval_status` varchar(50) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `visa_no` varchar(50) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `view_exchange_applications`
--
DROP TABLE IF EXISTS `view_exchange_applications`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_exchange_applications`  AS SELECT `s`.`student_id` AS `student_id`, `s`.`name` AS `student_name`, `ep`.`name` AS `program_name`, `ea`.`status` AS `status`, `ea`.`application_date` AS `application_date`, `ea`.`approval_date` AS `approval_date` FROM (((`exchange_applications` `ea` join `studentappliesforexchangeprogram` `sp` on(`ea`.`application_id` = `sp`.`application_id`)) join `exchange_program` `ep` on(`ea`.`program_id` = `ep`.`program_id`)) join `student` `s` on(`sp`.`student_id` = `s`.`student_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `view_scholarship_applications`
--
DROP TABLE IF EXISTS `view_scholarship_applications`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_scholarship_applications`  AS SELECT `s`.`student_id` AS `student_id`, `s`.`name` AS `student_name`, `sch`.`name` AS `scholarship_name`, `sa`.`status` AS `status`, `sa`.`application_date` AS `application_date`, `sa`.`approval_date` AS `approval_date` FROM (((`scholarship_applications` `sa` join `studentappliesforscholarship` `ss` on(`sa`.`application_id` = `ss`.`application_id`)) join `scholarship` `sch` on(`sa`.`scholarship_id` = `sch`.`scholarship_id`)) join `student` `s` on(`ss`.`student_id` = `s`.`student_id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exchange_applications`
--
ALTER TABLE `exchange_applications`
  ADD PRIMARY KEY (`application_id`,`program_id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `exchange_program`
--
ALTER TABLE `exchange_program`
  ADD PRIMARY KEY (`program_id`),
  ADD KEY `university_id` (`university_id`);

--
-- Indexes for table `home_university`
--
ALTER TABLE `home_university`
  ADD PRIMARY KEY (`university_id`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`instructor_id`,`university_id`),
  ADD KEY `university_id` (`university_id`);

--
-- Indexes for table `instructorapprovesexchangeapplications`
--
ALTER TABLE `instructorapprovesexchangeapplications`
  ADD PRIMARY KEY (`instructor_id`,`instructor_uni_id`,`application_id`,`program_id`),
  ADD KEY `application_id` (`application_id`,`program_id`);

--
-- Indexes for table `instructorapprovesscholarshipapplications`
--
ALTER TABLE `instructorapprovesscholarshipapplications`
  ADD PRIMARY KEY (`instructor_id`,`instructor_uni_id`,`application_id`,`scholarship_id`),
  ADD KEY `application_id` (`application_id`,`scholarship_id`);

--
-- Indexes for table `instructorsadvisestudents`
--
ALTER TABLE `instructorsadvisestudents`
  ADD PRIMARY KEY (`instructor_id`,`instructor_uni_id`,`student_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `partner_university`
--
ALTER TABLE `partner_university`
  ADD PRIMARY KEY (`university_id`);

--
-- Indexes for table `scholarship`
--
ALTER TABLE `scholarship`
  ADD PRIMARY KEY (`scholarship_id`);

--
-- Indexes for table `scholarship_applications`
--
ALTER TABLE `scholarship_applications`
  ADD PRIMARY KEY (`application_id`,`scholarship_id`),
  ADD KEY `scholarship_id` (`scholarship_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `university_id` (`university_id`);

--
-- Indexes for table `studentappliesforexchangeprogram`
--
ALTER TABLE `studentappliesforexchangeprogram`
  ADD PRIMARY KEY (`student_id`,`application_id`,`program_id`),
  ADD KEY `application_id` (`application_id`,`program_id`);

--
-- Indexes for table `studentappliesforscholarship`
--
ALTER TABLE `studentappliesforscholarship`
  ADD PRIMARY KEY (`student_id`,`application_id`,`scholarship_id`),
  ADD KEY `application_id` (`application_id`,`scholarship_id`);

--
-- Indexes for table `student_log`
--
ALTER TABLE `student_log`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `university`
--
ALTER TABLE `university`
  ADD PRIMARY KEY (`university_id`);

--
-- Indexes for table `visa_details`
--
ALTER TABLE `visa_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exchange_program`
--
ALTER TABLE `exchange_program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `scholarship`
--
ALTER TABLE `scholarship`
  MODIFY `scholarship_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `student_log`
--
ALTER TABLE `student_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visa_details`
--
ALTER TABLE `visa_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exchange_applications`
--
ALTER TABLE `exchange_applications`
  ADD CONSTRAINT `exchange_applications_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `exchange_program` (`program_id`) ON DELETE CASCADE;

--
-- Constraints for table `exchange_program`
--
ALTER TABLE `exchange_program`
  ADD CONSTRAINT `exchange_program_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `partner_university` (`university_id`) ON DELETE CASCADE;

--
-- Constraints for table `home_university`
--
ALTER TABLE `home_university`
  ADD CONSTRAINT `home_university_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `university` (`university_id`) ON DELETE CASCADE;

--
-- Constraints for table `instructor`
--
ALTER TABLE `instructor`
  ADD CONSTRAINT `instructor_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `university` (`university_id`) ON DELETE CASCADE;

--
-- Constraints for table `instructorapprovesexchangeapplications`
--
ALTER TABLE `instructorapprovesexchangeapplications`
  ADD CONSTRAINT `instructorapprovesexchangeapplications_ibfk_1` FOREIGN KEY (`instructor_id`,`instructor_uni_id`) REFERENCES `instructor` (`instructor_id`, `university_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `instructorapprovesexchangeapplications_ibfk_2` FOREIGN KEY (`application_id`,`program_id`) REFERENCES `exchange_applications` (`application_id`, `program_id`) ON DELETE CASCADE;

--
-- Constraints for table `instructorapprovesscholarshipapplications`
--
ALTER TABLE `instructorapprovesscholarshipapplications`
  ADD CONSTRAINT `instructorapprovesscholarshipapplications_ibfk_1` FOREIGN KEY (`instructor_id`,`instructor_uni_id`) REFERENCES `instructor` (`instructor_id`, `university_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `instructorapprovesscholarshipapplications_ibfk_2` FOREIGN KEY (`application_id`,`scholarship_id`) REFERENCES `scholarship_applications` (`application_id`, `scholarship_id`) ON DELETE CASCADE;

--
-- Constraints for table `instructorsadvisestudents`
--
ALTER TABLE `instructorsadvisestudents`
  ADD CONSTRAINT `instructorsadvisestudents_ibfk_1` FOREIGN KEY (`instructor_id`,`instructor_uni_id`) REFERENCES `instructor` (`instructor_id`, `university_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `instructorsadvisestudents_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `partner_university`
--
ALTER TABLE `partner_university`
  ADD CONSTRAINT `partner_university_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `university` (`university_id`) ON DELETE CASCADE;

--
-- Constraints for table `scholarship_applications`
--
ALTER TABLE `scholarship_applications`
  ADD CONSTRAINT `scholarship_applications_ibfk_1` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarship` (`scholarship_id`) ON DELETE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `university` (`university_id`) ON DELETE CASCADE;

--
-- Constraints for table `studentappliesforexchangeprogram`
--
ALTER TABLE `studentappliesforexchangeprogram`
  ADD CONSTRAINT `studentappliesforexchangeprogram_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `studentappliesforexchangeprogram_ibfk_2` FOREIGN KEY (`application_id`,`program_id`) REFERENCES `exchange_applications` (`application_id`, `program_id`) ON DELETE CASCADE;

--
-- Constraints for table `studentappliesforscholarship`
--
ALTER TABLE `studentappliesforscholarship`
  ADD CONSTRAINT `studentappliesforscholarship_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `studentappliesforscholarship_ibfk_2` FOREIGN KEY (`application_id`,`scholarship_id`) REFERENCES `scholarship_applications` (`application_id`, `scholarship_id`) ON DELETE CASCADE;

--
-- Constraints for table `visa_details`
--
ALTER TABLE `visa_details`
  ADD CONSTRAINT `visa_details_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
