<?php
namespace App\Routes;
use App\Controllers\BookController;
use App\Controllers\CustomerController;
class Router{
    private array $routes =[];

    public function get(string $path, $handler) {
        $this->routes['GET'][$path] = $handler;
    }
    public function post(string $path, $handler){
        $this->routes['POST'][$path] = $handler;
    }
    public function put(string $path, $handler){
        $this->routes['PUT'][$path] = $handler;
    }
    public function delete(string $path,$handler){
        $this->routes['DELETE'][$path] = $handler;
    }
    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
        // Normalize scriptDir to not end with slash unless it's just /
        $scriptDir = ($scriptDir === '\\' || $scriptDir === '/') ? '' : str_replace('\\', '/', $scriptDir);
        
        if ($scriptDir !== '' && strpos($uri, $scriptDir) === 0) {
            $uri = substr($uri, strlen($scriptDir));
        }
        
        $uri = '/' . trim($uri, '/');
        
        // Handle OPTIONS request early
        if ($method === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            exit;
        }
        
        header('Access-Control-Allow-Origin: *');

        if ($method === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'DELETE') {
            $method = 'DELETE';
        }

        foreach ($this->routes[$method] ?? [] as $path => $handler) {
            // Normalize path to have leading slash
            $path = '/' . trim($path, '/');
            
            // Convert /books/{id} to regex
            $pattern = preg_replace('#\{[^/]+\}#', '([^/]+)', $path);
            $pattern = str_replace('/', '\/', $pattern);

            if (preg_match("/^$pattern$/", $uri, $matches)) {
                array_shift($matches); // remove full match

                if (is_array($handler) && count($handler) === 2) {
                    [$controller, $methodName] = $handler;
                    $controller->$methodName(...$matches);
                } else {
                    call_user_func_array($handler, $matches);
                }

                return;
            }
        }

        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Route not found'
        ]);
    }



}