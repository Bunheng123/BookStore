<?php
namespace App\Models;

class CustomerModel
{
    private ?int $id = null;
    private string $first_name;
    private string $last_name;
    private string $email;
    private ?string $phone = null;
    private ?string $address = null;
    private ?string $password = null;
    private ?string $reset_token = null;           // ← NEW
    private ?string $reset_token_expire = null;    // ← NEW
    private ?string $created_at = null;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->first_name = $data['first_name'] ?? '';
        $this->last_name = $data['last_name'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->phone = $data['phone'] ?? null;
        $this->address = $data['address'] ?? null;
        $this->password = $data['password'] ?? null;
        $this->reset_token = $data['reset_token'] ?? null;              // ← NEW
        $this->reset_token_expire = $data['reset_token_expire'] ?? null; // ← NEW
        $this->created_at = $data['created_at'] ?? null;
    }

    // Getters
    public function getId(): ?int { return $this->id; }
    public function getFirstName(): string { return $this->first_name; }
    public function getLastName(): string { return $this->last_name; }
    public function getEmail(): string { return $this->email; }
    public function getPhone(): ?string { return $this->phone; }
    public function getAddress(): ?string { return $this->address; }
    public function getPassword(): ?string { return $this->password; }
    public function getResetToken(): ?string { return $this->reset_token; }           // ← NEW
    public function getResetTokenExpire(): ?string { return $this->reset_token_expire; } // ← NEW
    public function getCreatedAt(): ?string { return $this->created_at; }

    // Setters
    public function setId(?int $id): void { $this->id = $id; }
    public function setFirstName(string $first_name): void { $this->first_name = $first_name; }
    public function setLastName(string $last_name): void { $this->last_name = $last_name; }
    public function setEmail(string $email): void { $this->email = $email; }
    public function setPhone(?string $phone): void { $this->phone = $phone; }
    public function setAddress(?string $address): void { $this->address = $address; }
    public function setPassword(?string $password): void { $this->password = $password; }
    public function setResetToken(?string $reset_token): void { $this->reset_token = $reset_token; }              // ← NEW
    public function setResetTokenExpire(?string $reset_token_expire): void { $this->reset_token_expire = $reset_token_expire; } // ← NEW
    public function setCreatedAt(?string $created_at): void { $this->created_at = $created_at; }
}