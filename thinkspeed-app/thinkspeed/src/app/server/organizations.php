
<?php

include "../server/headers.php";
include "../server/user-roles.php";


//foreach($_SERVER as $param => $value) echo "$param =$value'\n";

class Organizations{

	public $organization_id ;
  public $organization_name;

  function __construct($organization_id, $organization_name){
    $this ->organization_id = $organization_id;
	$this ->organization_name = $organization_name;

  }

}


/*if ($_SERVER['QUERY_STRING'] == 'getAllUserRoles') {


  if ($connection) {
	  	$headers = getallheaders();
	//echo json_encode($headers);
	$token_string = (object)$headers;
	$token = trim($token_string->Authorization,'Bearer ');


	echo $token;
    $role_group = array();
    $data;

    $query = "SELECT * from user_roles";
    $result = mysqli_query($connection, $query);
    if (!$result) {
      die("Could not fetch user roles" . mysqli_error(($connection)));
    } else {
      while ($row = mysqli_fetch_array(($result))) {

        $data = new UserRoles($row['role_id'], $row['role_name']);
        array_push($role_group, (object)$data);
      }
      echo json_encode($role_group);
    }




    //echo json_encode("True");
  } else {
    return 0;
  }
}*/

if($_SERVER['QUERY_STRING']=='getOrganizations')
{

	getOrganizations();
}

function getOrganizations(){

  global $connection;
  $organizations = array();
  $data;

  $query ="SELECT * from organizations";
  $result = mysqli_query($connection,$query);
  if(!$result){
die("Could not fetch organizations".mysqli_error($connection));

  }else{
    while($row = mysqli_fetch_array($result)){
      $data =  new Organizations($row['organization_id'], $row['organization_name']);
      array_push($organizations, (object)$data);


    }
	     echo json_encode($organizations);


  }
}

if($_SERVER['QUERY_STRING']=='manageUsers'){

}

function manageUsers(){

}
?>
