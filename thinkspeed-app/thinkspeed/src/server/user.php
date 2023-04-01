<?php 

class User
{ public $user_id ;
 public $account_name ;
  public $email;
  public $organization;
  public $role;

  function __construct($user_id,$account_name,$email,$organization,$role){
  $this ->user_id = $user_id;
  $this ->account_name = $account_name;
	$this ->email = $email;
	$this ->organization = $organization;
	$this ->role = $role;

  }


}
?>