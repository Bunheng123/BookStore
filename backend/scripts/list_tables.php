<?php
$pdo = new PDO('pgsql:host=localhost;port=5432;dbname=bookstore', 'postgres', '123');
$stmt = $pdo->query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
foreach ($tables as $t) {
    echo $t . "\n";
}
