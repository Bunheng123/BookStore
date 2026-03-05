<?php

namespace App\Controllers;

use App\Repositories\AdminRepository;
use App\Repositories\CustomerRepository;
use App\Helpers\JwtToken;
use RuntimeException;

class AuthController
{
    private AdminRepository $adminRepo;
    private CustomerRepository $customerRepo;

    public function __construct()
    {
        $this->adminRepo = new AdminRepository();
        $this->customerRepo = new CustomerRepository();
    }

    public function login(): void
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data || empty($data['email']) || empty($data['password'])) {
                throw new RuntimeException('Email and password are required', 400);
            }

            $email = $data['email'];
            $password = $data['password'];

            // 🔹 Check Admin
            $admin = $this->adminRepo->loginAdmin($email, $password);

            if ($admin) {
                $token = JwtToken::generate([
                    'user_id' => $admin['id'],
                    'email'   => $admin['email'],
                    'role'    => 'admin'
                ], 86400);

                // Remove password
                unset($admin['password']);

                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'token'  => $token,
                    'role'   => 'admin',
                    'user'   => $admin
                ]);
                return;
            }

            // 🔹 Check Customer
            $customer = $this->customerRepo->login($email, $password);

            if ($customer) {
                $token = JwtToken::generate([
                    'user_id' => $customer['id'],
                    'email'   => $customer['email'],
                    'role'    => 'customer'
                ], 86400);

                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'token'  => $token,
                    'role'   => 'customer',
                    'user' => [
                        'id' => $customer['id'],
                        'first_name' => $customer['first_name'],
                        'last_name' => $customer['last_name'],
                        'email' => $customer['email'],
                        'phone' => $customer['phone'] ?? null,
                        'address' => $customer['address'] ?? null,
                        'created_at' => $customer['created_at'] ?? null
                    ]
                ]);
                return;
            }

            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid email or password'
            ]);

        } catch (RuntimeException $e) {
            http_response_code($e->getCode() ?: 400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

}