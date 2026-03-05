<?php
$pdo = new PDO('pgsql:host=localhost;port=5432;dbname=bookstore', 'postgres', '123');
$stmt = $pdo->query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='order_items'");
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $col) {
    echo $col['column_name']." (".$col['data_type'].")\n";
}
