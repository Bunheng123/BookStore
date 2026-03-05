<?php

namespace App\Repositories;

use App\Config\DatabaseConnection;
use App\Models\AdminModel as ModelsAdminModel;
use PDO;
use PDOException;
use RuntimeException;

class AdminRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = DatabaseConnection::getInstance();
    }

    /* =========================
        GET ALL ADMINS
    ========================= */
    public function index(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM admins");
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new RuntimeException('Error getting admins: ' . $e->getMessage());
        }
    }

    /* =========================
        GET ADMIN BY EMAIL
    ========================= */
    public function getByEmail(string $email): ?array
    {
        try {
            $stmt = $this->db->prepare(
                "SELECT * FROM admins WHERE email = :email LIMIT 1"
            );
            $stmt->bindValue(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            throw new RuntimeException('Error getting admin by email: ' . $e->getMessage());
        }
    }

    /* =========================
        REGISTER ADMIN
    ========================= */
    public function addAdmin(ModelsAdminModel $admin): bool
    {
        try {
            // Check duplicate email
            if ($this->getByEmail($admin->getEmail())) {
                throw new RuntimeException('Email already registered');
            }

            $stmt = $this->db->prepare("
                INSERT INTO admins (
                    first_name,
                    last_name,
                    email,
                    phone,
                    address,
                    password
                ) VALUES (
                    :first_name,
                    :last_name,
                    :email,
                    :phone,
                    :address,
                    :password
                )
            ");

            $stmt->bindValue(':first_name', $admin->getFirstName());
            $stmt->bindValue(':last_name', $admin->getLastName());
            $stmt->bindValue(':email', $admin->getEmail());
            $stmt->bindValue(':phone', $admin->getPhone());
            $stmt->bindValue(':address', $admin->getAddress());
            $stmt->bindValue(
                ':password',
                password_hash($admin->getPassword(), PASSWORD_BCRYPT)
            );

            return $stmt->execute();

        } catch (PDOException $e) {
            throw new RuntimeException('Error creating admin: ' . $e->getMessage());
        }
    }

    /* =========================
        LOGIN ADMIN
    ========================= */
    public function loginAdmin(string $email, string $password): ?array
    {
        try {
            $admin = $this->getByEmail($email);

            if (!$admin) {
                return null;
            }

            if (!password_verify($password, $admin['password'])) {
                return null;
            }

            unset($admin['password']); // security
            return $admin;

        } catch (PDOException $e) {
            throw new RuntimeException('Error during login: ' . $e->getMessage());
        }
    }

    /* =========================
        GET ADMIN BY ID
    ========================= */
    public function getById(int $id): ?array
    {
        try {
            $stmt = $this->db->prepare(
                "SELECT * FROM admins WHERE id = :id LIMIT 1"
            );
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            throw new RuntimeException('Error getting admin by id: ' . $e->getMessage());
        }
    }

    /* =========================
        DELETE ADMIN
    ========================= */
    public function delete(int $id): bool
    {
        try {
            $stmt = $this->db->prepare(
                "DELETE FROM admins WHERE id = :id"
            );
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            throw new RuntimeException('Error deleting admin: ' . $e->getMessage());
        }
    }

    /* =========================
        UPDATE ADMIN
    ========================= */
    public function update(int $id, ModelsAdminModel $admin): bool
    {
        try {
            // Prevent email duplication
            $existing = $this->getByEmail($admin->getEmail());
            if ($existing && $existing['id'] !== $id) {
                throw new RuntimeException('Email already in use');
            }

            $stmt = $this->db->prepare("
                UPDATE admins SET
                    first_name = :first_name,
                    last_name  = :last_name,
                    email      = :email,
                    phone      = :phone,
                    address    = :address
                WHERE id = :id
            ");

            $stmt->bindValue(':first_name', $admin->getFirstName());
            $stmt->bindValue(':last_name', $admin->getLastName());
            $stmt->bindValue(':email', $admin->getEmail());
            $stmt->bindValue(':phone', $admin->getPhone());
            $stmt->bindValue(':address', $admin->getAddress());
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            throw new RuntimeException('Error updating admin: ' . $e->getMessage());
        }
    }
}
