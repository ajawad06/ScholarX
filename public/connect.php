<?php
/**
 * Database Connection Handler
 */
declare(strict_types=1);

class DB {
    private static ?mysqli $connection = null;

    public static function connect(): mysqli {
        if (self::$connection === null) {
            try {
                self::$connection = new mysqli(
                    '127.0.0.1',
                    'root',
                    '',
                    'exchange_system',
                    4306
                );

                if (self::$connection->connect_errno) {
                    throw new RuntimeException(
                        "Database connection failed: " .
                        self::$connection->connect_error
                    );
                }

                self::$connection->set_charset('utf8mb4');

            } catch (RuntimeException $e) {
                error_log($e->getMessage());
                die("System temporarily unavailable.");
            }
        }
        return self::$connection;
    }
}
?>