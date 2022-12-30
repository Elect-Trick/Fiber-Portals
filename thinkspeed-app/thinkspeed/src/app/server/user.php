<?php 

class User
{ public $account_name ;
  public $email;
  public $organization;
  public $role;

  function __construct($account_name,$email,$organization,$role){
    $this ->account_name = $account_name;
	$this ->email = $email;
	$this ->organization = $organization;
	$this ->role = $role;

  }


}
?>