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
        if (array_key_exists($url, $this->routes)) {
            return call_user_func($this->routes[$url]);
        }
        http_response_code(404);
        echo '404 Not Found';
    }
}