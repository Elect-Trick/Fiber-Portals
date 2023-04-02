<?php
class JWT
{

	public $headers;
	private $secret;
	public function __construct()
	{
		$this->headers = [
			'typ' => 'JWT', 'alg' => 'HS256'
		];

		$this->secret = 'secret';
	}

	public function generateJWT($payload, $secret = 'secret')
	{
		//echo "payload " .json_encode($payload)."\n";
		$headers_encoded = $this->base64url_encode(json_encode($this->headers));

		$payload_encoded =  $this->base64url_encode(json_encode($payload));

		$signature = hash_hmac('SHA256', "$headers_encoded.$payload_encoded", $secret, true);
		$signature_encoded =  $this->base64url_encode($signature);

		$jwt = "$headers_encoded.$payload_encoded.$signature_encoded";
		// $valid = $this->is_jwt_valid($jwt);
		// echo "valid in the generate? " .$valid;
		return $jwt;
	}

	public function getOrgnization($jwt)
	{
		$tokenParts = explode('.', $jwt);
		$payload = base64_decode($tokenParts[1]);
		$organization = json_decode($payload)->organization_id;
		return $organization;
	}

	public function is_jwt_valid($jwt, $secret = 'secret')
	{
		$tokenParts = explode('.', $jwt);
		$payload = base64_decode($tokenParts[1]);
		$signature_provided = $tokenParts[2];
		// check the expiration time - note this will cause an error if there is no 'exp' claim in the jwt
		$expiration = json_decode($payload)->expiration;
		$is_token_expired = ($expiration - time()) < 0;
		//echo "time ".json_encode($is_token_expired);
		// build a signature based on the header and payload using the secret

		$base64_url_signature = $this->base64url_encode($signature_provided);

		// verify it matches the signature provided in the jwt
		$is_signature_valid = ($base64_url_signature === $this->base64url_encode($signature_provided));
		if ($is_token_expired || !$is_signature_valid) {
			return FALSE;
		} else {
			return TRUE;
		}
	}

	public function refreshToken($token)
	{

		$tokenParts = explode('.', $token);
		$payload = base64_decode($tokenParts[1]);
		$newToken = $this->generateJWT($payload);

		return json_encode($newToken);
	}
	public function fetchJWT()
	{
		$headers = getallheaders();
		$token_string = (object)$headers;
		$token = trim($token_string->Authorization, 'Bearer ');
		return json_encode($token);
	}
	private function base64url_encode($str)
	{
		if (!empty($str)) {
			return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
		}
	}
}
