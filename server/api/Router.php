<?php
class Router {
    private array $routes = [];

    function discover() {
        $functions = get_defined_functions()['user'];
        foreach ($functions as $fn) {
            $refFn = new ReflectionFunction($fn);
            $routeAttr = $refFn->getAttributes(Route::class)[0] ?? false;
            if ($routeAttr) {
                $route = $routeAttr->newInstance();
                $this->routes[$route->path] = $fn; 
            }
        }
    }

    function dispatch() {
        $url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: Accept, Authorization");
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header("Cache-Control: no-store");
        header("Content-Security-Policy: frame-ancestors 'none'");
        header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
        header("X-Content-Type-Options: nosniff");
        header("Content-Security-Policy: default-src 'none'");
        header("Referrer-Policy: no-referrer");
        if (array_key_exists($url, $this->routes)) {
            return call_user_func($this->routes[$url]);
        }
        http_response_code(404);
        echo '404 Not Found';
    }
}