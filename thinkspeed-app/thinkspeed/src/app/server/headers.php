<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset-UTF-8");
header("Access-Control-Allow-Methods: POST, GET, UPDATE, DELETE");
header("Access-Control-Max-Age:84600");
header("Access-Control-Allow-Headers:Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$db_host = 'localhost';
$db_user ='root';
$db_pass ='';
$db_name ='thinkspeed';
global $connection;
 $connection = mysqli_connect($db_host,$db_user,$db_pass,$db_name);

if ($connection) {
//    echo "We are connected";
} else {
    echo "Failed to establish connection";
    echo "Failed to establish connection";
    echo "Failed to establish connection";
    echo "Failed to establish connection";
}


?>
