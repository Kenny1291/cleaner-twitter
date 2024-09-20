<?php
require 'utils.php';

echo getallheaders()["Origin"];
exit;

if (!areRequestHeadersSet(['Origin' => 'chrome-extension://iplodopmopkmkpblangcjomcdfiidneo'])) {
    response400();
}

require 'Route.php';
require 'Router.php';
require 'functions.php';

$router = new Router();
$router->discover();
$router->dispatch();