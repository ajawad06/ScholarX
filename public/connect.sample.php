<?php
/**
 * Database Connection Handler (Sample)
 */
declare(strict_types=1);

class DB {
    private static ?mysqli $connection = null;

    public static function connect(): mysqli {
        if (self::$connection === null) {
            self::$connection = new mysqli(
                '127.0.0.1',   // host
                'user',        // username
                'password',    // password
                'project', // db name
                3306           // port
            );

            if (self::$connection->connect_errno) {
                throw new RuntimeException(
                    "Database connection failed: " .
                    self::$connection->connect_error
                );
            }

            self::$connection->set_charset('utf8mb4');
        }
        return self::$connection;
    }
}
?>
