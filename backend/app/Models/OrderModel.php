<?php
namespace App\Models;

class OrderModel {
    private int $id;
    private int $customer_id;
    private float $total_amount;
    private string $status;
    private string $created_at;

    public function __construct(
        int $id = 0,
        int $customer_id = 0,
        float $total_amount = 0.0,
        string $status = 'pending',
        string $created_at = ''
    ) {
        $this->id = $id;
        $this->customer_id = $customer_id;
        $this->total_amount = $total_amount;
        $this->status = $status;
        $this->created_at = $created_at;
    }

    public function getId(): int { return $this->id; }
    public function getCustomerId(): int { return $this->customer_id; }
    public function getTotalAmount(): float { return $this->total_amount; }
    public function getStatus(): string { return $this->status; }
    public function getCreatedAt(): string { return $this->created_at; }

    public function setId(int $id): void { $this->id = $id; }
    public function setCustomerId(int $customer_id): void { $this->customer_id = $customer_id; }
    public function setTotalAmount(float $total_amount): void { $this->total_amount = $total_amount; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function setCreatedAt(string $created_at): void { $this->created_at = $created_at; }
}
