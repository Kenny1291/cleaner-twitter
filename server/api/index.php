<?php
require 'utils.php';

echo '<pre>';
var_dump(getallheaders());
echo '</pre>'; 
exit;

if (!areRequestHeadersSet(['origin' => 'chrome-extension://iplodopmopkmkpblangcjomcdfiidneo'])) {
    response400();
}

require 'Route.php';
require 'Router.php';
require 'functions.php';

$router = new Router();
$router->discover();
$router->dispatch();