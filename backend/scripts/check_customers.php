<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Config\DatabaseConnection;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

$conn = DatabaseConnection::getInstance();

// Check customers
$result = $conn->query('SELECT id, email, first_name, last_name FROM customers LIMIT 5');
$customers = $result->fetchAll(PDO::FETCH_ASSOC);

if ($customers) {
    echo "Customers found:\n";
    foreach ($customers as $c) {
        echo "ID: " . $c['id'] . ", Email: " . $c['email'] . ", Name: " . $c['first_name'] . " " . $c['last_name'] . "\n";
    }
} else {
    echo "No customers found in database\n";
}

// Check books
echo "\nBooks:\n";
$result = $conn->query('SELECT id, title, price, stock FROM books LIMIT 3');
$books = $result->fetchAll(PDO::FETCH_ASSOC);

if ($books) {
    foreach ($books as $b) {
        echo "ID: " . $b['id'] . ", Title: " . $b['title'] . ", Price: " . $b['price'] . ", Stock: " . $b['stock'] . "\n";
    }
} else {
    echo "No books found in database\n";
}
