<?php
namespace App\Controllers;

use App\Models\CustomerModel;
use App\Repositories\CustomerRepository;
use App\Helpers\JwtToken;
use RuntimeException;

class CustomerController 
{
    private CustomerRepository $repo;

    public function __construct() 
    {
        $this->repo = new CustomerRepository();
    }

    /**
     * Get all customers
     * GET /customers
     */
    public function index(): void
    {
        try {
            $customers = $this->repo->index();
            
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $customers
            ]);
            
        } catch (RuntimeException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get customer by ID
     * GET /customers/{id}
     */
    public function get(int $id): void
    {
        try {
            $customer = $this->repo->getId($id);
            
            if (!$customer) {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Customer not found'
                ]);
                return;
            }
            
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $customer
            ]);
            
        } catch (RuntimeException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Register new customer
     * POST /customers
     */
    public function save(): void 
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validate JSON
            if (!$data) {
                throw new RuntimeException('Invalid JSON body');
            }

            // Validate required fields
            if (empty($data['email'])) {
                throw new RuntimeException('Email is required');
            }

            if (empty($data['password'])) {
                throw new RuntimeException('Password is required');
            }

            // Create customer model
            $customer = new CustomerModel([
                'first_name' => $data['first_name'] ?? '',
                'last_name' => $data['last_name'] ?? '',
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'password' => $data['password']  // Plain password - repository will hash
            ]);

            // Save customer
            if ($this->repo->save($customer)) {
                http_response_code(201);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Customer registered successfully'
                ]);
            } else {
                throw new RuntimeException('Failed to register customer');
            }

        } catch (RuntimeException $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Login customer
     * POST /customers/login
     */
    public function login(): void
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validate JSON
            if (!$data) {
                throw new RuntimeException('Invalid JSON body');
            }

            // Validate required fields
            if (empty($data['email'])) {
                throw new RuntimeException('Email is required');
            }

            if (empty($data['password'])) {
                throw new RuntimeException('Password is required');
            }

            // Attempt login
            $customer = $this->repo->login($data['email'], $data['password']);

            if (!$customer) {
                http_response_code(401);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid email or password'
                ]);
                return;
            }

            // Generate JWT token
            $token = JwtToken::generate([
                'user_id' => $customer['id'],
                'email' => $customer['email'],
                'role' => 'customer'
            ], 86400);  // 24 hours

            // Success response
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $token,
                'type' => 'Bearer',
                'user' => [
                    'id' => $customer['id'],
                    'email' => $customer['email'],
                    'first_name' => $customer['first_name'],
                    'last_name' => $customer['last_name']
                ]
            ]);

        } catch (RuntimeException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update customer
     * PUT /customers/{id}
     */
    public function update(int $id): void
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validate JSON
            if (!$data) {
                throw new RuntimeException('Invalid JSON body');
            }

            // Create customer model
            $customer = new CustomerModel([
                'first_name' => $data['first_name'] ?? '',
                'last_name' => $data['last_name'] ?? '',
                'email' => $data['email'] ?? '',
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null
            ]);

            // Update customer
            if ($this->repo->update($id, $customer)) {
                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Customer updated successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Customer not found'
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

    /**
     * Delete customer
     * DELETE /customers/{id}
     */
    public function delete(int $id): void
    {
        try {
            if ($this->repo->delete($id)) {
                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Customer deleted successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Customer not found'
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

    /**
     * Request password reset
     * POST /customers/forgot-password
     */
    public function forgotPassword(): void
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data || empty($data['email'])) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Email is required'
                ]);
                return;
            }
            
            $result = $this->repo->createResetToken($data['email']);
            
            if (!$result) {
                // Don't reveal if email exists (security best practice)
                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'If that email exists, a reset link has been sent'
                ]);
                return;
            }
            
            // TODO: In production, send email with reset link
            // For now, return token for testing
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Password reset token generated',
                'token' => $result['token'],  // Remove this in production!
                'expire' => $result['expire']
            ]);
            
        } catch (RuntimeException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Reset password with token
     * POST /customers/reset-password
     */
    public function resetPassword(): void
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data || empty($data['token']) || empty($data['password'])) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Token and new password are required'
                ]);
                return;
            }
            
            $success = $this->repo->resetPassword($data['token'], $data['password']);
            
            if (!$success) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid or expired reset token'
                ]);
                return;
            }
            
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Password reset successfully'
            ]);
            
        } catch (RuntimeException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}