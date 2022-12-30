
<?php


include "../server/headers.php";
include "../server/user-roles.php";
include "../server/jwt.php";
include "../server/user.php";




if ($_SERVER['QUERY_STRING'] == 'getAllUserRoles') {

  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if (!$token_valid) {
    echo json_encode("false");
  } else {
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
  }
}

if (isset($_REQUEST['add-user'])) {

  $postdata = file_get_contents("php://input");
  $obj = json_decode($postdata);

  if (!empty($obj)) {

    $jwtInstance = new JWT();
    $jwt = $jwtInstance->fetchJWT();
    $valid = $jwtInstance->is_jwt_valid($jwt);
    $loggedin = true;

    if ($loggedin) {
      $account_name = mysqli_real_escape_string($connection, ($obj->account_name));
      $email = mysqli_real_escape_string($connection, ($obj->e_mail));
      $organization = mysqli_real_escape_string($connection, ($obj->organization));
      $password = mysqli_real_escape_string($connection, ($obj->password));
      $user_role = mysqli_real_escape_string($connection, ($obj->user_role));
      $user_last_login = date("Y-m-d");
      $options = [
        "cost" => 12,
      ];
      $hashed_password = password_hash($password, PASSWORD_BCRYPT, $options);
      $duplicateFinder = mysqli_query($connection, "select * from users where user_email ='$email'");
      if ($duplicateFinder->num_rows != 0) {
        echo http_response_code(409);
        // echo json_encode($duplicateFinder);
        exit();
      } else {
        $query = "INSERT INTO users(user_account_name,user_email,password,organization_id,role_id,user_last_login) ";
        $query .= "VALUES('$account_name','$email','$hashed_password','$organization','$user_role','$user_last_login')";

        $result = mysqli_query($connection, $query);

        if (!$result) {
          echo json_encode($result);
          exit();
        } else {

          echo json_encode($result);
          exit();
        }
      }


    } else {

      echo json_encode("false");
      exit();
    }
    echo json_encode("false");
    exit();
  }
  echo json_encode("false");
}

if (isset($_REQUEST['manage-users'])) {
  $jwtInstance = new JWT();

  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  $loggedin = true;
  if (!$token_valid) {
    echo "false";
    exit();
  } else {

    $query = "SELECT * from users";
    $result = mysqli_query($connection, $query);
    $users = array();
    if (!$result) {

      exit();
    } else {
      while ($row = mysqli_fetch_array($result)) {
        $data = new User($row['user_account_name'], $row['user_email'], $row['organization_id'], $row['role_id']);
        array_push($users, (object)$data);
      }
      echo json_encode($users);
      exit();
    }
  }
}

if (isset($_REQUEST['delete-user'])) {

  $user = $_REQUEST['delete-user'];
  $jwtInstance = new JWT();

  $token = $jwtInstance->fetchJWT();

  $token_valid = $jwtInstance->is_jwt_valid($token);
  if (!$token_valid) {
    echo json_encode("false");
    exit();
  } else {
    $query = "DELETE from users ";
    $query .= "WHERE user_email ='$user'";
    $result = mysqli_query($connection, $query);

    if (!$result) {
      echo json_encode("false");

      exit();
    } else {
      echo json_encode("true");
      exit();
    }
  }
}




?>
