<?php
namespace App\Config;

use PDO;
use PDOException;
use RuntimeException;
class DatabaseConnection {
    private static ?PDO $instance = null;
    public static function getInstance(): PDO{ // create a connection to the database

        // if will work only if there is no connection to database 
        if(self::$instance === null){  
            $dsn = sprintf( // use to store data source name
                "%s:host=%s;port=%s;dbname=%s",
                $_ENV['DB_DRIVER'],
                $_ENV['DB_HOST'],
                $_ENV['DB_PORT'],
                $_ENV['DB_NAME']
            );

            try { // this try will use the data from dsn+user+pw and connect to database
                self::$instance = new PDO($dsn,$_ENV['DB_USER'],$_ENV['DB_PASS'],
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_PERSISTENT => true,
                    ]
                );
            }catch (PDOException $e){ // if any error it will show the error 
                throw new RuntimeException('Database connection failed: ' . $e -> getMessage());
            }
        }
        
        return self::$instance; // return the connection
    }
}