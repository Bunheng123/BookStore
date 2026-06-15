<?php
require_once __DIR__ . '/vendor/autoload.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

use Dotenv\Dotenv;
use App\Config\DatabaseConnection;
use App\Controllers\AdminController;
use App\Controllers\BookController;
use App\Controllers\CustomerController;
use App\Routes\Router;
use App\Controllers\AuthController;
use App\Controllers\OrderController;

// Load .env from project root
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Enable CORS - Allow localhost on any port during development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$router = new Router();

//--------------------Books--------------------
$router->delete('/api/books/{id}', [new BookController(), 'delete']);
$router->put('/api/books/{id}', [new BookController(), 'update']);
$router->get('/api/books', [new BookController(), 'index']);
$router->get('/api/books/{id}', [new BookController(), 'get']);
$router->post('/api/books', [new BookController(), 'save']);
$router->get('/api/authors', [new BookController(), 'indexAuthors']);
$router->get('/api/categories', [new BookController(), 'indexCategories']);
$router->post('/api/categories', [new BookController(), 'saveCategory']);
$router->put('/api/categories/{id}', [new BookController(), 'updateCategory']);
$router->delete('/api/categories/{id}', [new BookController(), 'deleteCategory']);

//--------------------Customers--------------------
$router->get('/api/customers', [new CustomerController(), 'index']);
$router->get('/api/customers/{id}', [new CustomerController(), 'get']);
$router->post('/api/register', [new CustomerController(), 'save']);
$router->put('/api/customers/{id}', [new CustomerController(), 'update']);
$router->delete('/api/customers/{id}', [new CustomerController(), 'delete']);
$router->post('/api/customers/login', [new CustomerController(), 'login']);
$router->post('/api/customers/forgot-password', [new CustomerController(), 'forgotPassword']);
$router->post('/api/customers/reset-password', [new CustomerController(), 'resetPassword']);

//--------------------Admins--------------------
$router->post('/api/admin/register', [new AdminController(), 'store']);
$router->post('/api/admin/login', [new AdminController(), 'login']);
$router->put('/api/admin/{id}', [new AdminController(), 'update']);
// delete admin
$router->delete('/api/admins/{id}', [new AdminController(), 'delete']);
// list admins (staff)
$router->get('/api/admins', [new AdminController(), 'index']);

//--------------------Auth--------------------
$router->post('/api/login', [new AuthController(), 'login']);

//--------------------Orders--------------------
$router->post('/api/orders', [new OrderController(), 'checkout']);
$router->get('/api/orders', [new OrderController(), 'index']);
$router->get('/api/orders/{id}/items', [new OrderController(), 'items']);
$router->put('/api/orders/{id}/status', [new OrderController(), 'updateStatus']);

$router->dispatch();