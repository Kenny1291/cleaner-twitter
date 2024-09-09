<?php
$defaultCSSRulesV2JSON = file_get_contents('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRulesV2.json');
$defaultCSSRulesV2OBJ = json_decode($defaultCSSRulesV2);
$version = $_GET["v"];
var_dump(defaultCSSRulesV2OBJ);
