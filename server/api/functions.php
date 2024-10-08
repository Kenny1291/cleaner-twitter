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
    
    if (!json_validate($error)) {
        http_response_code(400);
        echo '400 Bad Request';
        return;
    }

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
    curl_exec($ch);
    curl_close($ch);
}