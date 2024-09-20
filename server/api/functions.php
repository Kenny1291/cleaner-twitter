<?php
#[Route('/data')]
function data() {
    $defaultCSSRulesV2JSON = file_get_contents('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRulesV2.json');
    $defaultCSSRulesV2OBJ = json_decode($defaultCSSRulesV2JSON);
    $version = $_GET["v"] ?? null;
    $response = new stdClass();
    $response->version = $defaultCSSRulesV2OBJ->version;
    $response->defaultRules = $defaultCSSRulesV2OBJ->defaultRules;
    if (!is_null($version)) {
        if (isset($defaultCSSRulesV2OBJ->oldRules->{$version})) {
            $response->oldRules = $defaultCSSRulesV2OBJ->oldRules->{$version};
        }
    }
    echo json_encode($response);
}

#[Route('/logs/collect')]
function collectLogs() {
    //Read raw data from the POST request body
    $error = file_get_contents('php://input');

    $errorDecoded = json_decode($error);
    $d = [
        'name' => '',
        'message' => '',
        'stack' => ''
    ];
    
    //TODO: input validation. Something is wrong
    //Log keys and values type/format
    // $isInputValid = fn () => match (true) {
    //         !json_validate($errorDecoded), !empty(array_diff_key($errorDecoded, $d)) => false,
    //         default => true
    //     };

    // switch (true) {
    //     case $_SERVER['REQUEST_METHOD'] !== 'POST':
    //     case isset($parsedUrl['query']):
    //     case isset($parsedUrl['fragment']):
    //     case !areRequestHeadersSet(['Authorization' => 'Bearer ' . $_ENV['LOG_KEY']]):
    //     case !$isInputValid():
    //         response400();
    // }

    $data = [
        'requests' => [
            [
                'type' => 'execute', 
                'stmt' => [
                    'sql' => "INSERT INTO logs (error) VALUES @error",
                    "named_args" => [
                        [
                            "name" => "error",
                            "value" => [
                                "type" => "text",
                                "value" => $error 
                            ]
                        ],
                        
                    ]
                ]
            ],
            ['type' => 'close']
        ]
    ];

    $ch = curl_init($_ENV['TURSO_DB_HTTP_URL']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $_ENV['TURSO_DB_AUTH_TOKEN'],
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);

    echo $response;
}

#[Route('/logs/setup')]
function test() {
    $parsedUrl = parse_url($_SERVER['REQUEST_URI']);

    header("Content-Type: text/plain");

    switch (true) {
        case $_SERVER['REQUEST_METHOD'] !== 'GET':
            echo "1";
            break;
        case isset($parsedUrl['query']):
            echo "2";
            break;
        case isset($parsedUrl['fragment']):
            echo "3";
            break;
        case !areRequestHeadersSet(['Accept' => 'text/plain']):
            echo "4";
            break;
            // response400();
    }

    //TODO: Find out why when I put the header() here PHP throws

    echo $_ENV['LOG_KEY'];
}