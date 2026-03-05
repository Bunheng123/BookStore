<?php
if ($argc !== 2) {
    echo "Usage: php book_stock.php <book_id>\n";
    exit(1);
}
$bookId = (int)$argv[1];
$pdo = new PDO('pgsql:host=localhost;port=5432;dbname=bookstore', 'postgres', '123');
$stmt = $pdo->prepare('SELECT stock FROM books WHERE id = ?');
$stmt->execute([$bookId]);
$stock = $stmt->fetchColumn();
if ($stock === false) {
    echo "Book not found\n";
    exit(1);
}
echo "Book $bookId stock: $stock\n";
