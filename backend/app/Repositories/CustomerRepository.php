<?php
namespace App\Repositories;

use App\Config\DatabaseConnection;
use App\Models\CustomerModel;
use PDO;
use PDOException;
use RuntimeException;

class CustomerRepository 
{
    private PDO $db;

    public function __construct() 
    {
        $this->db = DatabaseConnection::getInstance();
    }

    /**
     * Get all customers (without passwords)
     */
    public function index(): array
    {
        try {
            $sql = "SELECT id, first_name, last_name, email, phone, address, created_at 
                    FROM customers 
                    ORDER BY id DESC";
            $ps = $this->db->prepare($sql);
            $ps->execute();
            
            return $ps->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            throw new RuntimeException('Error getting all customers: ' . $e->getMessage());
        }
    }

    /**
     * Get customer by ID (without password)
     */
    public function getId(int $id): ?array
    {
        try {
            $sql = "SELECT id, first_name, last_name, email, phone, address, created_at 
                    FROM customers 
                    WHERE id = :id";
            $ps = $this->db->prepare($sql);
            $ps->bindValue(':id', $id, PDO::PARAM_INT);
            $ps->execute();
            
            $result = $ps->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
            
        } catch (PDOException $e) {
            throw new RuntimeException('Error getting customer by ID: ' . $e->getMessage());
        }
    }

    /**
     * Get customer by email (includes password for authentication)
     * INTERNAL USE ONLY
     */
    public function getByEmail(string $email): ?array
    {
        try {
            $sql = "SELECT * FROM customers WHERE email = :email";
            $ps = $this->db->prepare($sql);
            $ps->bindValue(':email', $email, PDO::PARAM_STR);
            $ps->execute();
            
            $result = $ps->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
            
        } catch (PDOException $e) {
            throw new RuntimeException('Error getting customer by email: ' . $e->getMessage());
        }
    }

    /**
     * Add new customer
     */
    public function save(CustomerModel $customer): bool 
    {
        try {
            // Check if email already exists
            $existing = $this->getByEmail($customer->getEmail());
            if ($existing) {
                throw new RuntimeException('Email already registered');
            }

            $sql = "
                INSERT INTO customers (
                    first_name,
                    last_name,
                    email,
                    phone,
                    address,
                    password
                )
                VALUES (
                    :first_name,
                    :last_name,
                    :email,
                    :phone,
                    :address,
                    :password
                );
            ";

            $ps = $this->db->prepare($sql);

            $ps->bindValue(':first_name', $customer->getFirstName(), PDO::PARAM_STR);
            $ps->bindValue(':last_name', $customer->getLastName(), PDO::PARAM_STR);
            $ps->bindValue(':email', $customer->getEmail(), PDO::PARAM_STR);
            $ps->bindValue(':phone', $customer->getPhone(), PDO::PARAM_STR);
            $ps->bindValue(':address', $customer->getAddress(), PDO::PARAM_STR);
            $ps->bindValue(':password', password_hash($customer->getPassword(), PASSWORD_BCRYPT), PDO::PARAM_STR);

            return $ps->execute();
            
        } catch (PDOException $e) {
            throw new RuntimeException('Error saving customer: ' . $e->getMessage());
        }
    }

    /**
     * Login customer - verify credentials
     */
    public function login(string $email, string $password): ?array
    {
        try {
            $sql = "SELECT * FROM customers WHERE email = :email";
            $ps = $this->db->prepare($sql);
            $ps->bindValue(':email', $email, PDO::PARAM_STR);
            $ps->execute();
            
            $customer = $ps->fetch(PDO::FETCH_ASSOC);
            
            // Verify password
            if ($customer && password_verify($password, $customer['password'])) {
                // Remove password before returning
                unset($customer['password']);
                return $customer;
            }
            
            return null;
            
        } catch (PDOException $e) {
            throw new RuntimeException('Error during login: ' . $e->getMessage());
        }
    }

    /**
     * Update customer details
     */
    public function update(int $id, CustomerModel $customer): bool
    {
        try {
            // Check if new email is taken by another customer
            $existing = $this->getByEmail($customer->getEmail());
            if ($existing && $existing['id'] != $id) {
                throw new RuntimeException('Email already in use by another customer');
            }

            $sql = "
                UPDATE customers SET
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone,
                    address = :address
                WHERE id = :id;
            ";

            $ps = $this->db->prepare($sql);

            $ps->bindValue(':first_name', $customer->getFirstName(), PDO::PARAM_STR);
            $ps->bindValue(':last_name', $customer->getLastName(), PDO::PARAM_STR);
            $ps->bindValue(':email', $customer->getEmail(), PDO::PARAM_STR);
            $ps->bindValue(':phone', $customer->getPhone(), PDO::PARAM_STR);
            $ps->bindValue(':address', $customer->getAddress(), PDO::PARAM_STR);
            $ps->bindValue(':id', $id, PDO::PARAM_INT);

            return $ps->execute();

        } catch (PDOException $e) {
            throw new RuntimeException('Error updating customer: ' . $e->getMessage());
        }
    }

    /**
     * Delete customer by ID
     */
    public function delete(int $id): bool
    {
        try {
            $sql = "DELETE FROM customers WHERE id = :id";
            $ps = $this->db->prepare($sql);
            $ps->bindParam(':id', $id, PDO::PARAM_INT);
            $ps->execute();

            return $ps->rowCount() > 0;

        } catch (PDOException $e) {
            throw new RuntimeException('Error deleting customer: ' . $e->getMessage());
        }
    }

    /**
     * Generate and save password reset token
     */
    public function createResetToken(string $email): ?array
    {
        try {
            // Find customer by email
            $customer = $this->getByEmail($email);
            
            if (!$customer) {
                return null;  // Email not found
            }
            
            // Generate random token (64-character hex string)
            $token = bin2hex(random_bytes(32));
            
            // Token expires in 1 hour
            $expireTime = date('Y-m-d H:i:s', time() + 3600);
            
            // Save token to database
            $sql = "
                UPDATE customers 
                SET reset_token = :token,
                    reset_token_expire = :expire
                WHERE email = :email
            ";
            
            $ps = $this->db->prepare($sql);
            $ps->bindValue(':token', $token, PDO::PARAM_STR);
            $ps->bindValue(':expire', $expireTime, PDO::PARAM_STR);
            $ps->bindValue(':email', $email, PDO::PARAM_STR);
            $ps->execute();
            
            // Return token and customer info
            return [
                'token' => $token,
                'email' => $customer['email'],
                'customer_id' => $customer['id'],
                'expire' => $expireTime
            ];
            
        } catch (PDOException $e) {
            throw new RuntimeException('Error creating reset token: ' . $e->getMessage());
        }
    }

    /**
     * Verify reset token is valid and not expired
     */
    public function verifyResetToken(string $token): ?array
    {
        try {
            $sql = "
                SELECT * FROM customers 
                WHERE reset_token = :token 
                AND reset_token_expire > NOW()
            ";
            
            $ps = $this->db->prepare($sql);
            $ps->bindValue(':token', $token, PDO::PARAM_STR);
            $ps->execute();
            
            $result = $ps->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
            
        } catch (PDOException $e) {
            throw new RuntimeException('Error verifying reset token: ' . $e->getMessage());
        }
    }

    /**
     * Reset password using valid token
     */
    public function resetPassword(string $token, string $newPassword): bool
    {
        try {
            // Verify token is valid
            $customer = $this->verifyResetToken($token);
            
            if (!$customer) {
                return false;  // Token invalid or expired
            }
            
            // Update password and clear reset token
            $sql = "
                UPDATE customers 
                SET password = :password,
                    reset_token = NULL,
                    reset_token_expire = NULL
                WHERE id = :id
            ";
            
            $ps = $this->db->prepare($sql);
            $ps->bindValue(':password', password_hash($newPassword, PASSWORD_BCRYPT), PDO::PARAM_STR);
            $ps->bindValue(':id', $customer['id'], PDO::PARAM_INT);
            
            return $ps->execute();
            
        } catch (PDOException $e) {
            throw new RuntimeException('Error resetting password: ' . $e->getMessage());
        }
    }
}