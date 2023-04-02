<?php
include "localhost/apis/clearaccess/headers.php";
include "localhost/apis/clearaccess/jwt.php";
include "localhost/apis/clearaccess/location.php";
include "localhost/apis/clearaccess/products.php";
include "localhost/apis/clearaccess/order-status.php";

// Find Location based on search string
if (isset($_REQUEST['find-location']) && $_REQUEST['find-location'] != "") {
  $data = $_REQUEST['find-location'];
  $searchString = json_decode($data)->searchString;
  $type = json_decode($data)->type;
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if ($token_valid) {
    $searchParts = explode(",", $searchString);
    $mdu_name = mysqli_real_escape_string($connection, $searchParts[0]);
    $unit = $mdu_name;
    $index_of_space = strpos($mdu_name, ' ');
    $unit = substr_replace($unit, '', $index_of_space);
    $mdu_name = substr_replace($mdu_name, '', 0, $index_of_space + 1);
    $surburb = mysqli_real_escape_string($connection, $searchParts[1]);
    if ($type == 'mdu') {

      // echo $mdu_name;

      // echo $surburb;
      // echo json_encode($mdu_name);
      $query = "SELECT * from mdu_locations ";
      $query .= "WHERE mdu_unit='$unit' AND ( mdu_name  like '%$mdu_name%' OR mdu_surburb like '%$surburb%' OR mdu_street_name like '%$surburb%') ";
      $result = mysqli_query($connection, $query);
      $locations = array();
      if (!$result) {
        // something went wrong
        die('Something went wrong');
        exit();
      } else {
        while ($row = mysqli_fetch_array($result)) {
          $obj = $row['mdu_unit'] . " " . $row['mdu_name'] . " ," . $row['mdu_street_name'] . ", " . $row['mdu_surburb'];
          $location = new Location($row['location_id'], $obj);
          array_push($locations, $location);
        }
        echo json_encode($locations);
        exit();
      }
      exit();
    } else {
      $street_name = mysqli_real_escape_string($connection, $searchParts[0]);
      $surburb = mysqli_real_escape_string($connection, $searchParts[1]);


      $query = "SELECT * from sdu_locations ";
      $query .= "WHERE sdu_unit='$unit' AND ( sdu_street_name  like '%$mdu_name%' OR sdu_surburb like '%$surburb%' OR sdu_street_name like '%$surburb%') ";
      $result = mysqli_query($connection, $query);
      $locations = array();
      if (!$result) {
        echo "nothing found";
        // something went wrong
        // http_response_code(400);
        die('Something went wrong');
        exit();
      } else {
        while ($row = mysqli_fetch_array($result)) {
          $obj = $row['sdu_unit'] . " " . $row['sdu_street_name'] . "," .  $row['sdu_surburb'] . ", " . $row['sdu_country'];
          $location = new Location($row['location_id'], $obj);
          array_push($locations, $location);
        }

        echo json_encode($locations);
        exit();
      }
      exit();
    }
  } else {
    //invalid token return false;
    echo "false";
    exit();
  }
}

// Find location based on location ID
if (isset($_REQUEST['fetch-location'])) {
  $postdata = $_REQUEST['fetch-location'];
  $obj = json_decode($postdata);
  $location_type = $obj->location_string;
  $location_id = mysqli_real_escape_string($connection, $obj->location_id);
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if (!$token_valid) {
    echo "false";
    exit();
  } else {
    switch ($location_type) {
      case 'sdu':
        # For stand alone locations
        $query = "SELECT * from sdu_locations ";
        $query .= "WHERE location_id ='$location_id'";
        $result = mysqli_query($connection, $query);

        if (!$result) {
          echo "false";
          exit();
        } else {
          while ($row = mysqli_fetch_array($result)) {
            $location = $row['sdu_unit'] . "," . $row['sdu_street_name'] . ", " . $row['sdu_surburb'];
          }
        }
        echo json_encode($location);
        break;

      case 'mdu':
        # For complex location
        $query = "SELECT * from mdu_locations ";
        $query .= "WHERE location_id ='$location_id'";
        $result = mysqli_query($connection, $query);

        if (!$result) {
          echo "false";
        } else {
          while ($row = mysqli_fetch_array($result)) {
            $location = $row['mdu_unit'] . "," . $row['mdu_name'] . ", " . $row['mdu_street_name'] . ", " . $row['mdu_surburb'] . " UNIT " . $row['mdu_unit'];
          }
        }
        echo json_encode($location);
        break;
    }
  }
}

if (isset($_REQUEST['products'])) {
  // This needs to check if a location has an existing order which is active/pending

  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if ($token_valid) {
    $query = "SELECT * from products ";
    $result = mysqli_query($connection, $query);
    $products = array();
    if (!$result) {
      echo http_response_code(404);
      exit();
    } else {
      while ($row = mysqli_fetch_array($result)) {
        $obj = new Products($row['product_id'], $row['product_name'], $row['product_price']);
        array_push($products, $obj);
      }
      echo json_encode($products);
      exit();
    }
  } else {
    echo "false";
    exit();
  }
}

if (isset($_REQUEST['place-order'])) {
  $connection->autocommit(FALSE);
  $postdata = file_get_contents("php://input");
  $obj = json_decode($postdata);
  $location_type = $obj->location_type;
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $organization = $jwtInstance->getOrgnization($token);
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if ($token_valid) {
    // echo "token valid ";

    if ($location_type == 'mdu') {
      // echo " entering mdu if ";
      // order is location type based to avoid anamolies
      $date = date('Y:m:d');
      $newDate = str_replace(":", "-", $date);
      $processedDate = "CAC" . str_replace(':', '', $date);
      $duplicateCheck = "SELECT * FROM mdu_orders ";
      $duplicateCheck .= "WHERE (location_id='$obj->location_id' AND order_status='1')";
      $dupResult = mysqli_query($connection, $duplicateCheck);
      $record_count = mysqli_query($connection, "SELECT COUNT(*) from mdu_orders ");
      $totalEntries = mysqli_fetch_row($record_count);
      $tracker = ($totalEntries[0]) + 1;
      $serialized_order_number = $processedDate . "-" . str_pad($tracker, 6, '0', STR_PAD_LEFT);
      if ($dupResult->num_rows != 0) {

        while ($row = mysqli_fetch_array($dupResult)) {
          $existing_order = $row['order_number'];
        }
        echo $existing_order;
        http_response_code(400);
        // Duplicate found
        exit();
      } else {

        $location_id = mysqli_real_escape_string($connection, $obj->location_id);
        $client_name = mysqli_real_escape_string($connection, $obj->client_name);
        $client_surname = mysqli_real_escape_string($connection, $obj->client_surname);
        $email = mysqli_real_escape_string($connection, $obj->email);
        $contact_number = mysqli_real_escape_string($connection, $obj->contact_number);
        $id_number = mysqli_real_escape_string($connection, $obj->id_number);
        $product = mysqli_real_escape_string($connection, $obj->product);
        $order_type = mysqli_real_escape_string($connection, $obj->order_type);
        $isp_reference = mysqli_real_escape_string($connection, $obj->isp_reference);
        $location_type = mysqli_real_escape_string($connection, $location_type);

        $network_id = mysqli_real_escape_string($connection, $obj->network_id);
        $query = "INSERT INTO mdu_orders(location_id,location_type,client_name,client_surname,client_email,client_contact_number,client_id_number,product_id,order_type,isp_reference,order_status,organization_id,order_number,creation_date,network_id) ";
        $query .= "VALUES('$location_id','$location_type','$client_name','$client_surname','$email','$contact_number','$id_number','$product','$order_type','$isp_reference',1,$organization,'$serialized_order_number','$newDate','$network_id') ";

        $result = mysqli_query($connection, $query);
        if ($result) {
          $serviceQuery = "INSERT INTO mdu_services(location_id,product_id,organization_id,isp_order_number,order_type,network_id,isp_modem_mac,service_status,last_updated,vlan) ";
          $serviceQuery .= "VALUES('$location_id','$product',$organization,'$isp_reference',$order_type,'$network_id','$network_id','1','$newDate','Vlan1030') ";

          $result2 = mysqli_query($connection, $serviceQuery);
          if ($result2) {

            $connection->commit();
            echo $serialized_order_number;
            http_response_code(200);
            exit();
          } else {

            $connection->rollback();
            exit();
          }
        }

        http_response_code(408);
        exit();
      }
    } else {
      $date = date('Y:m:d');
      $newDate = str_replace(":", "-", $date);

      $processedDate = "CAS" . str_replace(':', '', $date);
      $duplicateCheck = "SELECT * FROM sdu_orders ";
      $duplicateCheck .= "WHERE (location_id= ('$obj->location_id') AND order_status='1')";
      $dupResult = mysqli_query($connection, $duplicateCheck);
      $record_count = mysqli_query($connection, "SELECT COUNT(*) from sdu_orders ");
      $totalEntries = mysqli_fetch_row($record_count);

      $tracker = ($totalEntries[0]) + 1;
      $serialized_order_number = $processedDate . "-" . str_pad($tracker, 6, '0', STR_PAD_LEFT);
      if ($dupResult->num_rows != 0) {
        while ($row = mysqli_fetch_array($dupResult)) {
          $existing_order = $row['order_number'];
        }
        echo $existing_order;
        http_response_code(400);
        // Duplicate found
        exit();
      } else {
        $location_id = mysqli_real_escape_string($connection, $obj->location_id);
        $client_name = mysqli_real_escape_string($connection, $obj->client_name);
        $client_surname = mysqli_real_escape_string($connection, $obj->client_surname);
        $email = mysqli_real_escape_string($connection, $obj->email);
        $contact_number = mysqli_real_escape_string($connection, $obj->contact_number);
        $id_number = mysqli_real_escape_string($connection, $obj->id_number);
        $product = mysqli_real_escape_string($connection, $obj->product);
        $order_type = mysqli_real_escape_string($connection, $obj->order_type);
        $isp_reference = mysqli_real_escape_string($connection, $obj->isp_reference);
        $network_id = mysqli_real_escape_string($connection, $obj->network_id);
        $location_type = mysqli_real_escape_string($connection, $location_type);

        $query = "INSERT INTO sdu_orders(location_id,location_type,client_name,client_surname,client_email,client_contact_number,client_id_number,product_id,order_type,isp_reference,order_status,organization_id,order_number,creation_date,network_id) ";
        $query .= "VALUES('$location_id','$location_type','$client_name','$client_surname','$email','$contact_number','$id_number','$product','$order_type','$isp_reference',1,'$organization','$serialized_order_number','$newDate','$network_id') ";
        $result = mysqli_query($connection, $query);
        if ($result) {
          $serviceQuery = "INSERT INTO sdu_services(location_id,product_id,organization_id,isp_order_number,network_id,isp_modem_mac,service_status,last_updated,vlan) ";
          $serviceQuery .= "VALUES('$location_id','$product',$organization,'$isp_reference','$network_id','$network_id','1','$newDate','Vlan1030') ";
          $result2 = mysqli_query($connection, $serviceQuery);
          if ($result2) {
            $connection->commit();
            echo $serialized_order_number;
            http_response_code(200);
            exit();
          } else {
            $connection->rollback();
            exit();
          }
        }
        http_response_code(408);
        exit();
      }
    }
  }

  // Token expired
  // Seems like we can only return a max of 2 status codes
  echo "false";
  exit();
}

if (isset($_REQUEST['order-status'])) {
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $organization =  mysqli_real_escape_string($connection, $jwtInstance->getOrgnization($token));
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if ($token_valid) {
    $data = $_REQUEST['order-status'];
    $orderNumber = mysqli_real_escape_string($connection, json_decode($data)->order_number);
    $orderType = json_decode($data)->order_type;
    switch ($orderType) {
      case 'CAS':
        // For standalone orders
        $query = "SELECT * from sdu_orders ";
        $query .= "WHERE (order_number ='$orderNumber' AND organization_id='$organization')";
        $result = mysqli_query($connection, $query);
        $orders = array();
        if (!$result) {
          http_response_code(400);
          exit();
        }
        while ($row = mysqli_fetch_array($result)) {
          $order = new OrderStatus($row['order_number'], $row['order_status'], $row['product_id'], $row['creation_date'], $row['location_id'], $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'], $row['order_type'], $row['isp_reference'], $row['organization_id'], $row['network_id'], $row['location_type'], $row['technician_id'], $row['order_fullfilled'], $row['scheduled_date']);
          array_push($orders, $order);
        }
        echo json_encode($orders);
        exit();

        # code...
        break;

      case 'CAC':
        $query = "SELECT * from mdu_orders ";
        $query .= "WHERE (order_number ='$orderNumber' AND organization_id='$organization')";
        $result = mysqli_query($connection, $query);
        $orders = array();
        if (!$result) {
          http_response_code(400);
          exit();
        }
        while ($row = mysqli_fetch_array($result)) {
          $order = new OrderStatus($row['order_number'], $row['order_status'], $row['product_id'], $row['creation_date'], $row['location_id'], $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'], $row['order_type'], $row['isp_reference'], $row['organization_id'], $row['network_id'], $row['location_type'], $row['technician_id'], $row['order_fullfilled'], $row['scheduled_date']);
          array_push($orders, $order);
        }
        echo json_encode($orders);
        exit();
        break;
    }
  } else {
    // token expired
    echo "false";
    exit();
  }
}

if (isset($_REQUEST['reject-order'])) {
  $jwtInstance = new JWT();
  $postdata = mysqli_real_escape_string($connection, file_get_contents("php://input"));
  $token = $jwtInstance->fetchJWT();
  $organization =  mysqli_real_escape_string($connection, $jwtInstance->getOrgnization($token));
  $token_valid = $jwtInstance->is_jwt_valid($token);
  $location_type = substr($postdata, 0, 3);
  if ($token_valid) {

    switch ($location_type) {
      case 'CAC':
        # code for MDU rejections
        $rejection_query = "UPDATE mdu_orders SET order_status='3' where order_number like '%$postdata%'";
        $result = mysqli_query($connection, $rejection_query);
        if ($result) {
          http_response_code(200);
          echo "true";
          exit();
        } else {
          http_response_code(409);
          exit();
        }
        break;

      default:
        # code for sdu order rejections

        $rejection_query = "UPDATE sdu_orders SET order_status='3' where order_number like '%$postdata%'";
        $result = mysqli_query($connection, $rejection_query);
        if ($result) {
          http_response_code(200);
          echo "true";
          exit();
        } else {
          http_response_code(409);
          exit();
        }
        break;
    }
  } else {
    // Token expired.
    echo "false";
    exit();
  }
}

if (isset($_REQUEST['add-location'])) {

  $postdata = file_get_contents("php://input");
  $obj = json_decode($postdata);
  $location_type = $obj->type;
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $organization = $jwtInstance->getOrgnization($token);
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if ($token_valid) {

    switch ($location_type) {
      case 'sdu':
        $street_name = mysqli_real_escape_string($connection, $obj->street_name);
        $surburb = mysqli_real_escape_string($connection, $obj->surburb);
        $house_number = mysqli_real_escape_string($connection, $obj->house_number);
        $postal_code = mysqli_real_escape_string($connection, $obj->postal_code);
        $is_installed = mysqli_real_escape_string($connection, $obj->is_Installed);
        $network_id = mysqli_real_escape_string($connection, $obj->network_id);
        $coordinates = mysqli_real_escape_string($connection, $obj->coordinates);
        $date = date('Y:m:d');
        $creation_date = str_replace(":", "-", $date);

        $duplicateCheck = "SELECT * from sdu_locations ";
        $duplicateCheck .= "WHERE sdu_unit like '%$house_number%' AND sdu_street_name like '%$street_name%' AND sdu_surburb like '%$surburb%'";

        $duplicateResult = mysqli_query($connection, $duplicateCheck);

        if ($duplicateResult->num_rows != 0) {
          while ($row = mysqli_fetch_array($duplicateResult)) {
            $existing_location = $row['sdu_street_name'] . "," . $row['sdu_surburb'];
          }
          // Duplicate Location found
          http_response_code(409);
          echo $existing_location;
          exit();
        } else {
          $query = "INSERT INTO sdu_locations(sdu_unit,sdu_street_name,sdu_surburb,sdu_country,sdu_postal_code,is_installed,network_id,sdu_coordinates,is_active,creation_date) ";
          $query .= "VALUES('$house_number','$street_name','$surburb','South Africa','$postal_code','$is_installed','$network_id','$coordinates','0','$creation_date')";
          $result = mysqli_query($connection, $query);
          if ($result) {
            // Successfully added location
            echo "true";
            http_response_code(200);
            exit();
          } else {
            // Something went wrong, contact support

            http_response_code(400);
            exit();
          }
        }
        # code...
        break;

      default:
        $unit_number = mysqli_real_escape_string($connection, json_decode($postdata)->unit_number);
        $building_name = mysqli_real_escape_string($connection, json_decode($postdata)->building_name);
        $street_name = mysqli_real_escape_string($connection, json_decode($postdata)->street_name);
        $surburb = mysqli_real_escape_string($connection, json_decode($postdata)->surburb);
        $postal_code = mysqli_real_escape_string($connection, json_decode($postdata)->postal_code);
        $coordinates = mysqli_real_escape_string($connection, json_decode($postdata)->coordinates);
        $network_id = mysqli_real_escape_string($connection, json_decode($postdata)->network_id);
        $is_installed = mysqli_real_escape_string($connection, json_decode($postdata)->is_Installed);
        $date = date('Y:m:d');
        $creation_date = str_replace(":", "-", $date);


        $duplicateCheck = "SELECT * from mdu_locations ";
        $duplicateCheck .= "WHERE mdu_unit='$unit_number' AND mdu_name like '%$building_name%' AND mdu_surburb like '%$surburb%'";

        $duplicateResult = mysqli_query($connection, $duplicateCheck);

        if ($duplicateResult->num_rows != 0) {
          while ($row = mysqli_fetch_array($duplicateResult)) {
            $existing_location = $row['mdu_street_name'] . "," . $row['mdu_surburb'];
          }
          // Duplicate Location found
          http_response_code(409);
          echo $existing_location;
          exit();
        } else {
          $query = "INSERT INTO mdu_locations(mdu_unit, mdu_name,mdu_street_name,mdu_surburb,mdu_country,mdu_postal_code,is_installed,network_id,mdu_coordinates,is_active,creation_date) ";
          $query .= "VALUES('$unit_number','$building_name','$street_name','$surburb','South Africa','$postal_code','$is_installed','$network_id','$coordinates','0','$creation_date')";
          $result = mysqli_query($connection, $query);
          if ($result) {
            // Successfully added location
            echo "true";
            http_response_code(200);
            exit();
          } else {
            // Something went wrong, contact support

            http_response_code(400);
            exit();
          }
        }
        break;
    }
  } else {
    echo "false";
    exit();
  }
}

// FNO SECTION

if (isset($_REQUEST['pending-fno-orders'])) {
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $organization = $jwtInstance->getOrgnization($token);
  $token_valid = $jwtInstance->is_jwt_valid($token);
  $items_per_page = 6;
  $page =  mysqli_real_escape_string($connection, $_REQUEST['pending-fno-orders']);
  ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

  if ($token_valid) {
    $query = "SELECT * from sdu_orders  WHERE order_status ='1' UNION SELECT * from mdu_orders where order_status='1' order by  creation_date DESC limit $limiter,$items_per_page";
    $result = mysqli_query($connection, $query);
    $data = array();
    if ($result) {
      while ($row = mysqli_fetch_array($result)) {
        $order = new OrderStatus($row['order_number'], $row['order_status'], $row['product_id'], $row['creation_date'], $row['location_id'], $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'], $row['order_type'], $row['isp_reference'], $row['organization_id'], $row['network_id'], $row['location_type'], $row['technician_id'], $row['order_fullfilled'], $row['scheduled_date']);

        array_push($data, $order);
      }
      echo json_encode($data);
    } else {
      // something went wrong
    }
  } else {
    echo "false";
    // Token expired
  }
}
if (isset($_REQUEST['active-fno-orders'])) {
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $organization = $jwtInstance->getOrgnization($token);
  $token_valid = $jwtInstance->is_jwt_valid($token);
  $items_per_page = 6;
  $page =  mysqli_real_escape_string($connection, $_REQUEST['active-fno-orders']);
  ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

  if ($token_valid) {
    $query = "SELECT * from sdu_orders  WHERE order_status ='4' UNION SELECT * from mdu_orders where order_status='4' order by  creation_date DESC limit $limiter,$items_per_page";
    $result = mysqli_query($connection, $query);
    $data = array();
    if ($result) {
      while ($row = mysqli_fetch_array($result)) {
        $order = new OrderStatus($row['order_number'], $row['order_status'], $row['product_id'], $row['creation_date'], $row['location_id'], $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'], $row['order_type'], $row['isp_reference'], $row['organization_id'], $row['network_id'], $row['location_type'], $row['technician_id'], $row['order_fullfilled'], $row['scheduled_date']);

        array_push($data, $order);
      }
      echo json_encode($data);
    } else {
      // something went wrong
    }
  } else {
    echo "false";
    // Token expired
  }
}
if (isset($_REQUEST['awaiting-installation'])) {
  $jwtInstance = new JWT();
  $token = $jwtInstance->fetchJWT();
  $organization = $jwtInstance->getOrgnization($token);
  $token_valid = $jwtInstance->is_jwt_valid($token);
  $items_per_page = 6;
  $page =  mysqli_real_escape_string($connection, $_REQUEST['awaiting-installation']);
  ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

  if ($token_valid) {
    $query = "SELECT * from sdu_orders  WHERE order_status ='2' UNION SELECT * from mdu_orders where order_status='2' order by  creation_date DESC limit $limiter,$items_per_page";
    $result = mysqli_query($connection, $query);
    $data = array();
    if ($result) {
      while ($row = mysqli_fetch_array($result)) {
        $order = new OrderStatus($row['order_number'], $row['order_status'], $row['product_id'], $row['creation_date'], $row['location_id'], $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'], $row['order_type'], $row['isp_reference'], $row['organization_id'], $row['network_id'], $row['location_type'], $row['technician_id'], $row['order_fullfilled'], $row['scheduled_date']);

        array_push($data, $order);
      }
      echo json_encode($data);
    } else {
      // something went wrong
    }
  } else {
    echo "false";
    // Token expired
  }
}

if (isset($_REQUEST['update-order'])) {

  $jwtInstance = new JWT();
  $postdata =  file_get_contents("php://input");
  $obj = json_decode($postdata);
  $client_name = mysqli_real_escape_string($connection, $obj->client_name);
  $client_email =  mysqli_real_escape_string($connection,$obj->client_email);
  $client_surname = mysqli_real_escape_string($connection, $obj->client_surname);
  $contact_number =  mysqli_real_escape_string($connection,$obj->contact_number);
  $location_type =  mysqli_real_escape_string($connection,$obj->location_type);
  $order_number = mysqli_real_escape_string($connection,$obj->order_number);

 $token = $jwtInstance->fetchJWT();
  $organization =  mysqli_real_escape_string($connection, $jwtInstance->getOrgnization($token));
  $token_valid = $jwtInstance->is_jwt_valid($token);
  if ($token_valid) {

    switch ($location_type) {
      case 'mdu':
        # code for MDU rejections
        $rejection_query = "UPDATE mdu_orders SET client_name ='$client_name',client_surname='$client_surname',client_email='$client_email',client_contact_number='$contact_number'  where order_number like '%$order_number%'";
        $result = mysqli_query($connection, $rejection_query);
        if ($result) {
          http_response_code(200);
          echo "true";
          exit();
        } else {
          http_response_code(409);
          exit();
        }
        break;

      case 'sdu':
        # code for sdu order rejections

        $rejection_query = "UPDATE sdu_orders   SET (client_name ='$client_name',client_surname='$client_surname',client_email='$client_email',client_contact_number='$contact_number') where order_number like '%$order_number%'";
        $result = mysqli_query($connection, $rejection_query);
        if ($result) {
          http_response_code(200);
          echo "true";
          exit();
        } else {
          http_response_code(409);
          exit();
        }
        break;
    }
  } else {
    // Token expired.
    echo "false";
    exit();
  }
}
