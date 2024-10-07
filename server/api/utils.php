<?php
function areRequestHeadersSet(array $headers) {
    return empty(array_diff_assoc($headers, getallheaders()));
} 

function response400() {
    http_response_code(400);
    echo '400 Bad Request';
    exit;
}

