
<?php

include "C:/xampp/htdocs/xampp/user-roles.php";
include "C:/xampp/htdocs/xampp/headers.php";
//foreach($_SERVER as $param => $value) echo "$param =$value'\n";

class Organizations{
	
	public $organization_id ;
  public $organization_name;

  function __construct($organization_id, $organization_name){
    $this ->organization_id = $organization_id;
	$this ->organization_name = $organization_name;

  }

}




if($_SERVER['QUERY_STRING']=='getOrganizations')
{

	getOrganizations();
}

function getOrganizations(){
	
  global $connection;
  $organizations = array();
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
