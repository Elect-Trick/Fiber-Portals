<?php
include "../server/headers.php";
include "../server/jwt.php";





if (isset($_REQUEST['find-location']) && $_REQUEST['find-location'] !="") {
  $data = $_REQUEST['find-location'];
  $searchString = json_decode($data)->searchString;
  $type = json_decode($data)->type;
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
 // echo "Token ".$token;
  $token_valid = $jwtInstance->is_jwt_valid($token);
  //echo "Token is valid? ". json_encode($token_valid);
  if ($token_valid=='true') {
	 $searchParts = explode(",",$searchString);
if($type =='mdu')
{

	 $query = "SELECT * from mdu_locations ";
    $query .= "WHERE mdu_unit like '%$searchParts[0]%' AND mdu_name regexp '[$searchParts[1]]'";
    $result = mysqli_query($connection, $query);
    $locations = array();

    if (!$result) {
      echo "false";
      exit();
    } else {
      while ($row = mysqli_fetch_array($result)) {
        $obj = "unit ".$row['mdu_unit']." ".$row['mdu_name']." ,".$row['mdu_street_name'].", ".$row['mdu_surburb'];
        $pre = (object)Array(
          "location_id" => $row['location_id'],
          "location_string" =>$obj,


        );


		array_push($locations,$obj);

      }
      echo json_encode($pre);

	  echo json_encode($locations);
      exit();
    }

    exit();
  } else {
    exit();
  }

}
else{
	//invalid token return false;
	echo "token invalid";
	exit();

}

}

if(isset($_REQUEST['confirm-location'])){

}

?>
