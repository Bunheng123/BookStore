<?php
namespace App\Models;
class AdminModel{
    private ?int $id = null;
    private string $first_name;
    private string $last_name;
    private string $email;
    private ?string $phone = null;
    private ?string $address = null;
    private ?string $password = null;
    private ?string $created_at = null;

    // constructor
    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->first_name = $data['first_name'] ?? '';
        $this->last_name  = $data['last_name'] ?? '';
        $this->email      = $data['email'] ?? '';
        $this->phone      = $data['phone'] ?? null;
        $this->address    = $data['address'] ?? null;
        $this->password   = $data['password'] ?? null;
        $this->created_at = $data['created_at'] ?? null;
    }

    // Getter
    public function getId(): ?int {  return $this->id;   }
    public function getFirstName(): string {  return $this->first_name;   }
    public function getLastName(): string {  return $this->last_name;   }
    public function getEmail(): string {  return $this->email;   }
    public function getPhone(): ?string {  return $this->phone;   }
    public function getAddress(): ?string {  return $this->address;   }
    public function getPassword(): ?string {  return $this->password;   }
    public function getCreatedAt(): ?string {  return $this->created_at;   }

    // Setter
    public function setId(?int $id): void {  $this->id = $id;   }
    public function setFirstName(string $first_name): void {  $this->first_name = $first_name;   }
    public function setLastName(string $last_name): void {  $this->last_name = $last_name;   }
    public function setEmail(string $email): void {  $this->email = $email;   }
    public function setPhone(?string $phone): void {  $this->phone = $phone;   }
    public function setAddress(?string $address): void {  $this->address = $address;   }
    public function setPassword(?string $password): void {  $this->password = $password;   }
    public function setCreatedAt(?string $created_at): void {  $this->created_at = $created_at;   }    
}