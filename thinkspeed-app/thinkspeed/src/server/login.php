<?php

include "localhost/apis/clearaccess/headers.php";
include "localhost/apis/clearaccess/jwt.php";

if ($_SERVER['QUERY_STRING'] == 'login') {
	$data = file_get_contents("php://input");
	$obj = json_decode(($data));
	$email = mysqli_real_escape_string($connection, $obj->email);
	$member_password = mysqli_real_escape_string($connection, $obj->password);
	$query = "Select * from users ";
	$query .= "WHERE user_email = '$email'";
	$result = mysqli_query($connection, $query);
	if (!$result) {
		echo http_response_code(400);
		exit();
	} else {
		while ($row = mysqli_fetch_assoc($result)) {
			$user_id = $row['user_id'];
			$user_role = $row['role_id'];
			$organization = $row['organization_id'];
			$payload = (object)[
				'user_id' => $user_id,
				'user_role' => $user_role,
				'organization_id' => $organization,
				'username' => $email,
				//Time in seconds
				'expiration' => time() + 60000
			];
			$hashed_password = $row['password'];
			if (password_verify($member_password, $hashed_password)) {
				$jwtInstance = new JWT();
				// Create token header as a JSON string
				$token = $jwtInstance->generateJWT($payload);
				echo json_encode($token);
				exit();
			} else {
				echo http_response_code(401);
				exit();
			}
		}
	}
}
