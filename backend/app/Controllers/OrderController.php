<?php
namespace App\Controllers;

use App\Models\OrderModel;
use App\Models\OrderItemModel;
use App\Repositories\OrderRepository;
use RuntimeException;

class OrderController {
    private OrderRepository $repo;

    public function __construct() {
        $this->repo = new OrderRepository();
    }

    public function checkout(): void {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['customer_id']) || !isset($data['items'])) {
            // debug: echo raw body and decoded data
            $raw = file_get_contents('php://input');
            error_log("[OrderController] invalid data received: " . $raw);
            error_log("[OrderController] decoded json: " . var_export($data, true));
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid order data']);
            return;
        }

        try {
            $order = new OrderModel(
                0,
                $data['customer_id'],
                (float)$data['total_amount'],
                'pending'
            );

            $items = [];
            foreach ($data['items'] as $itemData) {
                $items[] = new OrderItemModel(
                    0,
                    0, // order_id set by repo
                    (int)$itemData['book_id'],
                    (int)$itemData['quantity'],
                    (float)$itemData['price']
                );
            }

            $orderId = $this->repo->createOrder($order, $items);

            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'order_id' => $orderId
            ]);

        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function index(): void {
        try {
            $orders = $this->repo->getAllOrders();
            echo json_encode(['status' => 'success', 'data' => $orders]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function items(int $orderId): void {
        try {
            $items = $this->repo->getOrderItems($orderId);
            echo json_encode(['status' => 'success', 'data' => $items]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
        public function updateStatus(int $orderId): void {
            try {
                $data = json_decode(file_get_contents('php://input'), true);

                if (!$data || !isset($data['status'])) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Status is required']);
                    return;
                }

                $this->repo->updateOrderStatus($orderId, $data['status']);

                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Order status updated successfully'
                ]);

            } catch (\Throwable $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
        }
    }
