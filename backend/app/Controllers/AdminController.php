<?php

namespace App\Controllers;

use App\Models\AdminModel;
use App\Repositories\AdminRepository;
use App\Helpers\JwtToken;
use RuntimeException;

class AdminController
{
    private AdminRepository $repository;

    public function __construct()
    {
        $this->repository = new AdminRepository();
        header('Content-Type: application/json');
    }

    /* =========================
        REGISTER ADMIN
    ========================= */
    public function store(): void
    {
        try {
            $data = $this->getJsonInput();

            if (empty($data['email'])) {
                throw new RuntimeException('Email is required', 400);
            }

            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new RuntimeException('Invalid email format', 400);
            }

            if (empty($data['password']) || strlen($data['password']) < 6) {
                throw new RuntimeException('Password must be at least 6 characters', 400);
            }

            $admin = new AdminModel($data);

            if (!$this->repository->addAdmin($admin)) {
                throw new RuntimeException('Failed to register admin', 500);
            }

            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'Admin registered successfully'
            ]);

        } catch (RuntimeException $e) {
            http_response_code($e->getCode() ?: 400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /* =========================
        LOGIN ADMIN
    ========================= */
    public function login(): void
    {
        try {
            $data = $this->getJsonInput();

            if (empty($data['email']) || empty($data['password'])) {
                throw new RuntimeException('Email and password are required', 400);
            }

            $admin = $this->repository->loginAdmin($data['email'], $data['password']);

            if (!$admin) {
                http_response_code(401);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid email or password'
                ]);
                return;
            }

            $token = JwtToken::generate([
                'user_id' => $admin['id'],
                'email'   => $admin['email'],
                'role'    => 'admin'
            ], 86400);

            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $token,
                'type' => 'Bearer',
                'user' => $admin
            ]);

        } catch (RuntimeException $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /* =========================
        LIST ADMINS / STAFF
    ========================= */
    public function index(): void
    {
        try {
            $admins = $this->repository->index();

            // Remove password before returning
            $sanitized = array_map(function ($a) {
                unset($a['password']);
                return $a;
            }, $admins);

            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $sanitized
            ]);
        } catch (RuntimeException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /* =========================
        UPDATE ADMIN
    ========================= */
    public function update(int $id): void
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validate JSON
            if (!$data) {
                throw new RuntimeException('Invalid JSON body');
            }

            // Create admin model
            $admin = new AdminModel([
                'first_name' => $data['first_name'] ?? '',
                'last_name' => $data['last_name'] ?? '',
                'email' => $data['email'] ?? '',
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
            ]);

            // Update admin
            if ($this->repository->update($id, $admin)) {
                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Admin updated successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Admin not found'
                ]);
            }

        } catch (RuntimeException $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /* =========================
        DELETE ADMIN
    ========================= */
    public function delete(int $id): void
    {
        try {
            if ($this->repository->delete($id)) {
                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Admin deleted successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Admin not found'
                ]);
            }
        } catch (RuntimeException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }



    /* =========================
        HELPER
    ========================= */
    private function getJsonInput(): array
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            throw new RuntimeException('Invalid JSON body', 400);
        }

        return $data;
    }
}
