<?php
namespace App\Repositories;

use App\Config\DatabaseConnection;
use App\Models\OrderModel;
use App\Models\OrderItemModel;
use PDO;
use PDOException;
use RuntimeException;

class OrderRepository {
    private PDO $conn;

    public function __construct() {
        $this->conn = DatabaseConnection::getInstance();
    }

    public function createOrder(OrderModel $order, array $items): int {
        try {
            $this->conn->beginTransaction();

            // 1. Insert Order
            $sqlOrder = "INSERT INTO orders (customer_id, total, status) 
                         VALUES (:customer_id, :total, :status)";
            $psOrder = $this->conn->prepare($sqlOrder);
            $psOrder->bindValue(':customer_id', $order->getCustomerId(), PDO::PARAM_INT);
            $psOrder->bindValue(':total', $order->getTotalAmount());
            $psOrder->bindValue(':status', $order->getStatus(), PDO::PARAM_STR);
            $psOrder->execute();
            
            $orderId = (int) $this->conn->lastInsertId();

            // 2. Insert Items and Update Stock
            foreach ($items as $item) {
                // Insert item
                $sqlItem = "INSERT INTO order_items (order_id, book_id, quantity, unit_price) 
                            VALUES (:order_id, :book_id, :quantity, :unit_price)";
                $psItem = $this->conn->prepare($sqlItem);
                $psItem->bindValue(':order_id', $orderId, PDO::PARAM_INT);
                $psItem->bindValue(':book_id', $item->getBookId(), PDO::PARAM_INT);
                $psItem->bindValue(':quantity', $item->getQuantity(), PDO::PARAM_INT);
                $psItem->bindValue(':unit_price', $item->getPrice());
                $psItem->execute();

                // Decr stock
                $sqlDecr = "UPDATE books SET stock = stock - :quantity WHERE id = :book_id AND stock >= :quantity";
                $psDecr = $this->conn->prepare($sqlDecr);
                $psDecr->bindValue(':quantity', $item->getQuantity(), PDO::PARAM_INT);
                $psDecr->bindValue(':book_id', $item->getBookId(), PDO::PARAM_INT);
                $psDecr->execute();

                if ($psDecr->rowCount() === 0) {
                    throw new RuntimeException("Insufficient stock for book ID: " . $item->getBookId());
                }
            }

            $this->conn->commit();
            return $orderId;

        } catch (\Exception $e) {
            $this->conn->rollBack();
            throw new RuntimeException("Order creation failed: " . $e->getMessage());
        }
    }

    public function getAllOrders(): array {
        try {
            $sql = "SELECT o.*, CONCAT(c.first_name, ' ', c.last_name) as customer_name 
                    FROM orders o 
                    JOIN customers c ON o.customer_id = c.id 
                    ORDER BY o.created_at DESC";
            $ps = $this->conn->query($sql);
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new RuntimeException("Error fetching orders: " . $e->getMessage());
        }
    }

    public function getOrderItems(int $orderId): array {
        try {
            $sql = "SELECT oi.*, b.title as book_title 
                    FROM order_items oi 
                    JOIN books b ON oi.book_id = b.id 
                    WHERE oi.order_id = :order_id";
            $ps = $this->conn->prepare($sql);
            $ps->bindValue(':order_id', $orderId, PDO::PARAM_INT);
            $ps->execute();
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new RuntimeException("Error fetching order items: " . $e->getMessage());
        }
    }

        public function updateOrderStatus(int $orderId, string $status): void {
            try {
                $sql = "UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :order_id";
                $ps = $this->conn->prepare($sql);
                $ps->bindValue(':status', $status, PDO::PARAM_STR);
                $ps->bindValue(':order_id', $orderId, PDO::PARAM_INT);
                $ps->execute();
            } catch (PDOException $e) {
                throw new RuntimeException("Error updating order status: " . $e->getMessage());
            }
        }
}
