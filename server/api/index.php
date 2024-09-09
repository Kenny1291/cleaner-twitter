<?php
$defaultCSSRulesV2JSON = file_get_contents('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRulesV2.json');
$defaultCSSRulesV2OBJ = json_decode($defaultCSSRulesV2JSON);
$version = $_GET["v"];
$response = new stdClass();
$response->version = $defaultCSSRulesV2OBJ->version;
$response->defaultRules = $defaultCSSRulesV2OBJ->defaultRules;
$response->oldRules = $defaultCSSRulesV2OBJ->oldRules?->{$version};
header('Access-Control-Allow-Origin: *');
echo json_encode($response);