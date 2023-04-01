<?php
class UserRoles
{ public $role_id ;
  public $role_name;

  function __construct($role_id, $role_name){
    $this ->role_id = $role_id;
	  $this ->role_name = $role_name;

  }


}
