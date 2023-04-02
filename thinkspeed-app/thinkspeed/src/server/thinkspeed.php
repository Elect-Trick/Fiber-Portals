
<?php

include "C://xampp/htdocs/apis/clearaccess/headers.php";
include "C://xampp/htdocs/apis/clearaccess/user-roles.php";
include "C://xampp/htdocs/apis/clearaccess/jwt.php";
include "C://xampp/htdocs/apis/clearaccess/user.php";
include "C://xampp/htdocs/apis/clearaccess/stats.php";


if ($_SERVER['QUERY_STRING'] == 'getAllUserRoles') {
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if (!$token_valid) {
    echo json_encode("false");
  } else {
    $role_group = array();
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
      $duplicateFinder = mysqli_query($connection, "select * from users where user_email like '%$email%'");
      if ($duplicateFinder->num_rows != 0) {
        echo http_response_code(409);
        exit();
      } else {
        $query = "INSERT INTO users(user_account_name,user_email,password,organization_id,role_id,user_last_login) ";
        $query .= "VALUES('$account_name','$email','$hashed_password','1','1','$user_last_login')";

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
  // To filter users by Orgnization pending discussion
  $organization = $jwtInstance->getOrgnization($token);
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if (!$token_valid) {
    echo "false";
    exit();
  } else {
    $query = "SELECT * from users";
    $result = mysqli_query($connection, $query);
    $users = array();
    if (!$result) {
      // Nothing found
      http_response_code(400);
      exit();
    } else {
      while ($row = mysqli_fetch_array($result)) {
        $data = new User($row['user_id'],$row['user_account_name'], $row['user_email'], $row['organization_id'], $row['role_id']);
        array_push($users, (object)$data);
      }
      echo json_encode($users);
      exit();
    }
  }
}

if (isset($_REQUEST['delete-user'])) {
  $user = mysqli_real_escape_string($connection, $_REQUEST['delete-user']);
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

if (isset($_REQUEST['get-stats'])) {
  $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
  $bound = socket_connect($socket, '127.0.0.1', 8060);
  echo $bound;
}

if (isset($_REQUEST['fetch-stats'])) {
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  $service_status = 2;
  if ($token_valid) {
    // Services
    $active_mdu_services = "SELECT COUNT(*) from mdu_services where service_status='2'";
    $active_sdu_services = "SELECT COUNT(*) from sdu_services where service_status='2'";
    $mdu_active_services_result = mysqli_query($connection, $active_mdu_services);
    $sdu_active_services_result = mysqli_query($connection, $active_sdu_services);
    $active_mdu_service_count = mysqli_fetch_row($mdu_active_services_result)[0];
    $active_sdu_service_count = mysqli_fetch_row($sdu_active_services_result)[0];
    $active_services_count = $active_mdu_service_count + $active_sdu_service_count;

    $pending_mdu_services = "SELECT COUNT(*) from mdu_services where service_status='1'";
    $pending_sdu_services = "SELECT COUNT(*) from sdu_services where service_status='1'";
    $pending_mdu_services_result = mysqli_query($connection, $pending_sdu_services);
    $pending_sdu_services_result = mysqli_query($connection, $pending_sdu_services);
    $pending_mdu_service_count = mysqli_fetch_row($pending_mdu_services_result)[0];
    $pending_sdu_service_count = mysqli_fetch_row($pending_sdu_services_result)[0];
    $pending_services_count = $pending_mdu_service_count + $pending_sdu_service_count;


    $cancelled_mdu_services = "SELECT COUNT(*) from mdu_services where service_status='4'";
    $cancelled_sdu_services = "SELECT COUNT(*) from sdu_services where service_status='4'";
    $mdu_cancelled_services_result = mysqli_query($connection, $cancelled_mdu_services);
    $sdu_cancelled_services_result = mysqli_query($connection, $cancelled_sdu_services);
    $cancelled_mdu_service_count = mysqli_fetch_row($mdu_cancelled_services_result)[0];
    $cancelled_sdu_service_count = mysqli_fetch_row($sdu_cancelled_services_result)[0];
    $cancelled_services_count = $cancelled_mdu_service_count + $cancelled_sdu_service_count;
    // *****************************************************************

    // Orders
    $pending_mdu_orders = "SELECT COUNT(*) from mdu_orders where order_status='1'";
    $pending_sdu_orders = "SELECT COUNT(*) from sdu_orders where order_status='1'";
    $mdu_pending_orders_result = mysqli_query($connection, $pending_mdu_orders);
    $sdu_pending_orders_result = mysqli_query($connection, $pending_sdu_orders);
    $pending_mdu_orders_count = mysqli_fetch_row($mdu_pending_orders_result)[0];
    $pending_sdu_orders_count = mysqli_fetch_row($sdu_pending_orders_result)[0];
    $pending_orders_count =  $pending_mdu_orders_count +  $pending_sdu_orders_count;

    $rejected_mdu_orders_query = "SELECT COUNT(*) from mdu_orders where order_status =3";
    $rejected_sdu_orders_query = "SELECT COUNT(*) from sdu_orders where order_status =3";
    $rejected_mdu_result = mysqli_query($connection, $rejected_mdu_orders_query);
    $rejected_sdu_result = mysqli_query($connection, $rejected_sdu_orders_query);
    $rejected_mdu_order_count = mysqli_fetch_row($rejected_mdu_result)[0];
    $rejected_sdu_order_count = mysqli_fetch_row($rejected_sdu_result)[0];
    $rejected_order_count = $rejected_mdu_order_count + $rejected_sdu_order_count;
    // *****************************************************************

    // Tickets
    $open_tickets = "SELECT COUNT(*) from tickets where status_id!='5'";
    $closed_tickets = "SELECT COUNT(*) from tickets where status_id='5'";
    $open_tickets_result = mysqli_query($connection, $open_tickets);
    $closed_tickets_result = mysqli_query($connection, $closed_tickets);
    $open_tickets_count = mysqli_fetch_row($open_tickets_result)[0];
    $closed_tickets_count = mysqli_fetch_row($closed_tickets_result)[0];

    // $rejected_orders_query = "SELECT COUNT(*) from sdu_orders where order_status =3";
    // $rejected_order_count = mysqli_fetch_row($rejected_orders_result)[0];


    // $stats_array = array();
    $stat = new  Stats($active_services_count, $pending_services_count, $cancelled_services_count, $rejected_order_count, $pending_orders_count, $open_tickets_count, $closed_tickets_count);
    // array_push($stats_array,$stat);
    echo json_encode($stat);
    // *****************************************************************

    //
    // echo $active_services_count;
    // echo $pending_services_count;
    // echo $cancelled_services_count;
    // echo $pending_orders_count;
    // echo $rejected_order_count;



  } else {
    echo "false";
    exit();
  }
}
// Pagination

if (isset($_REQUEST['count-users'])) {
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  $totalEntries;
  if ($token_valid) {
    $query = mysqli_query($connection, "SELECT COUNT(*) from users");
    if ($query) {
      $totalEntries = mysqli_fetch_row($query)[0];
    } else {
    }
    echo $totalEntries;
  }
}

if (isset($_REQUEST['paginated-users'])) {
  $items_per_page = 2;
  $page =  mysqli_real_escape_string($connection, $_REQUEST['paginated-users']);
  ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  $totalEntries;
  if ($token_valid) {
    $users = array();
    $query = "SELECT * from users  limit $limiter,$items_per_page ";
    $result =  mysqli_query($connection, $query);
    if ($result) {
      while($row = mysqli_fetch_array($result)){
        $data = new User($row['user_id'],$row['user_account_name'], $row['user_email'], $row['organization_id'], $row['role_id']);
        array_push($users, (object)$data);
      }
      echo json_encode($users);

    } else {
      http_response_code(400);
      // Nothing found here
    }
  } else {
    // token_expired
    echo "false";
    exit();
  }
}



?>
