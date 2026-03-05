<?php
namespace App\Models;

class OrderItemModel {
    private int $id;
    private int $order_id;
    private int $book_id;
    private int $quantity;
    private float $price;

    public function __construct(
        int $id = 0,
        int $order_id = 0,
        int $book_id = 0,
        int $quantity = 0,
        float $price = 0.0
    ) {
        $this->id = $id;
        $this->order_id = $order_id;
        $this->book_id = $book_id;
        $this->quantity = $quantity;
        $this->price = $price;
    }

    public function getId(): int { return $this->id; }
    public function getOrderId(): int { return $this->order_id; }
    public function getBookId(): int { return $this->book_id; }
    public function getQuantity(): int { return $this->quantity; }
    public function getPrice(): float { return $this->price; }

    public function setId(int $id): void { $this->id = $id; }
    public function setOrderId(int $order_id): void { $this->order_id = $order_id; }
    public function setBookId(int $book_id): void { $this->book_id = $book_id; }
    public function setQuantity(int $quantity): void { $this->quantity = $quantity; }
    public function setPrice(float $price): void { $this->price = $price; }
}
