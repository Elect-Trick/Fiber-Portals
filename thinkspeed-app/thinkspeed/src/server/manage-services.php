<?php
include 'localhost/apis/clearaccess/headers.php';
include 'localhost/apis/clearaccess/jwt.php';
include 'localhost/apis/clearaccess/service.php';
include 'localhost/apis/clearaccess/regrade.php';

if (isset($_REQUEST['find-service'])) {

    $data = $_REQUEST['find-service'];
    // Prepeare the input;
    $searchString = mysqli_real_escape_string($connection, json_decode($data)->searchString);
    $searchType = mysqli_real_escape_string($connection, json_decode($data)->searchType);
    $locationType = mysqli_real_escape_string($connection, json_decode($data)->locationType);
    $timeZone = new DateTimeZone('Africa/Harare');
    $date = new DateTimeImmutable('now', $timeZone);
    $newDate = date_format($date, 'Y-m-d H:i:s');
    //    JWT instance to validate the request's token.
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);

    if ($token_valid) {
        // Check search type,

        if ($locationType == 'mdu') {
            switch ($searchType) {
                case 1:
                    # Service search via location_id
                    $services = array();
                    $query = "SELECT *,mdu_orders.client_name,mdu_orders.order_number,mdu_orders.client_surname,mdu_orders.client_email,mdu_orders.client_contact_number,mdu_services.network_id, mdu_locations.mdu_unit, mdu_locations.mdu_name,mdu_locations.mdu_street_name,mdu_locations.mdu_surburb from (mdu_services inner join mdu_locations on mdu_services.location_id = mdu_locations.location_id AND mdu_services.location_id='$searchString')inner JOIN mdu_orders on mdu_services.location_id= mdu_orders.location_id ";
                    $result = mysqli_query($connection, $query);
                    if (!$result) {
                        echo "false";
                        exit();
                    } else {


                        while ($row = mysqli_fetch_array($result)) {
                            $location =  $row['mdu_unit'] . "," . $row['mdu_name'] . " ," . $row['mdu_street_name'] . ", " . $row['mdu_surburb']." UNIT ".$row['mdu_unit'];
                           $service = new Service($row['service_id'], $row['location_id'], $row['product_id'], $row['organization_id'], $row['isp_order_number'], $row['order_type'], $row['network_id'], $row['isp_modem_mac'], $row['service_status'], $newDate, $row['vlan'], $location, $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'],$row['order_number']);
                            array_push($services, $service);
                        }
                        echo json_encode($services);
                        $connection->close();
                    }
                    break;
                case 2:
                    # Service search using FSAN
                    $services = array();

                    $query = "SELECT *,mdu_orders.client_name,mdu_orders.order_number,mdu_orders.client_surname,mdu_orders.client_email,mdu_orders.client_contact_number,mdu_orders.client_name,mdu_orders.client_surname,mdu_orders.client_email,mdu_orders.client_contact_number,mdu_services.network_id, mdu_locations.mdu_unit, mdu_locations.mdu_name,mdu_locations.mdu_street_name,mdu_locations.mdu_surburb from (mdu_services  inner join mdu_locations on mdu_services.location_id = mdu_locations.location_id AND mdu_services.network_id like '%$searchString%') inner JOIN mdu_orders on mdu_services.location_id= mdu_orders.location_id ";
                    $result = mysqli_query($connection, $query);

                    if (!$result) {
                        echo "false";
                        exit();
                    } else {
                        $date = date('Y:m:d');
                        while ($row = mysqli_fetch_array($result)) {
                            $location = $row['mdu_unit'] . ", " . $row['mdu_name'] . " ," . $row['mdu_street_name'] . ", " . $row['mdu_surburb']." UNIT ".$row['mdu_unit'];
                            $service = new Service($row['service_id'], $row['location_id'], $row['product_id'], $row['organization_id'], $row['isp_order_number'], $row['order_type'], $row['network_id'], $row['isp_modem_mac'], $row['service_status'], $newDate, $row['vlan'], $location, $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'],$row['order_number']);
                            //  echo json_encode($row);
                            array_push($services, $service);
                        }
                        echo json_encode($services);
                        $connection->close();
                    }
                    break;
            }
        } else if ($locationType == 'sdu') {
            switch ($searchType) {
                case 1:
                    # Service search via location_id
                    $services = array();

                    $query = "SELECT * ,sdu_orders.client_name,sdu_orders.order_number,sdu_orders.client_surname,sdu_orders.client_email,sdu_orders.client_contact_number,sdu_services.network_id,sdu_locations.sdu_unit,sdu_locations.sdu_street_name,sdu_locations.sdu_surburb from (sdu_services inner join sdu_locations on sdu_services.location_id = sdu_locations.location_id AND sdu_services.location_id='$searchString') inner JOIN sdu_orders on sdu_services.location_id= sdu_orders.location_id ";
                    $result = mysqli_query($connection, $query);
                    if (!$result) {
                        echo "false";
                        exit();
                    } else {
                        $date = date('Y:m:d');
                        while ($row = mysqli_fetch_array($result)) {
                            $location =  $row['sdu_unit'] . "," . $row['sdu_street_name'] . " ," . $row['sdu_surburb'];

                            $service = new Service($row['service_id'], $row['location_id'], $row['product_id'], $row['organization_id'], $row['isp_order_number'], $row['order_type'], $row['network_id'], $row['isp_modem_mac'], $row['service_status'], $date, $row['vlan'], $location, $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'],$row['order_number']);
                            array_push($services, $service);
                        }
                        echo json_encode($services);
                        $connection->close();
                        exit();
                    }
                    break;

                case 2:
                    # Service search using FSAN

                    //echo json_encode($searchString);
                    $services = array();
                    $query = "SELECT * ,sdu_orders.client_name,sdu_orders.order_number,sdu_orders.client_surname,sdu_orders.client_email,sdu_orders.client_contact_number,sdu_services.network_id,sdu_locations.sdu_unit,sdu_locations.sdu_street_name,sdu_locations.sdu_surburb from (sdu_services inner join sdu_locations on sdu_services.location_id =sdu_locations.location_id AND   sdu_services.network_id like '%$searchString%') inner JOIN sdu_orders on sdu_services.location_id= sdu_orders.location_id";
                    $result = mysqli_query($connection, $query);
                    if (!$result) {
                        echo "false";
                        exit();
                    } else {
                        $date = date('Y:m:d');
                        while ($row = mysqli_fetch_array($result)) {
                            $location = $row['sdu_unit'] . ", " . $row['sdu_street_name'] . " ," . $row['sdu_surburb'];

                            $service = new Service($row['service_id'], $row['location_id'], $row['product_id'], $row['organization_id'], $row['isp_order_number'], $row['order_type'], $row['network_id'], $row['isp_modem_mac'], $row['service_status'], $date, $row['vlan'], $location, $row['client_name'], $row['client_surname'], $row['client_email'], $row['client_contact_number'],$row['order_number']);
                            array_push($services, $service);
                        }
                        echo json_encode($services);
                        $connection->close();
                    }
                    exit();
                    break;
            }
        }
        exit();
    } else {
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['regrade'])) {
    $postdata = file_get_contents("php://input");
    $product_id = mysqli_real_escape_string($connection, json_decode($postdata)->product_id);
    $ext_reference = mysqli_real_escape_string($connection, json_decode($postdata)->ext_reference);
    $service_id = mysqli_real_escape_string($connection, json_decode($postdata)->service_id);
    $location_type = mysqli_real_escape_string($connection, json_decode($postdata)->location_type);
    $order_status = mysqli_real_escape_string($connection, json_decode($postdata)->order_status);
    $order_type = mysqli_real_escape_string($connection, json_decode($postdata)->order_type);
    $date = date('Y:m:d');
    $newDate = str_replace(":","-",$date);

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        // check for pending orders based on service_id and location type
        $duplicateChecker = "SELECT * from service_changes where service_id ='$service_id' AND location_type ='$location_type' AND order_status ='$order_status'";
        $dupResult = mysqli_query($connection, $duplicateChecker);
        if ($dupResult->num_rows != 0) {
            while ($row = mysqli_fetch_array($dupResult)) {
                $pending_regrade = new Regrade($row['request_id'], $row['product_id'], $row['ext_reference'], $row['service_id'], $row['location_type'], $row['order_status'], $row['order_type'], $row['request_date'], $row['order_number']);
            }
            http_response_code(409);
            echo json_encode($pending_regrade);
            exit();
        } else {

            $record_count = mysqli_query($connection, "SELECT COUNT(*) from service_changes ");
            $totalEntries = mysqli_fetch_row($record_count);
            $tracker = ($totalEntries[0]) + 1;
            $processedDate = "CAR" . str_replace(':', '', $date);
            $serialized_order_number = $processedDate . "-" . str_pad($tracker, 6, '0', STR_PAD_LEFT);
            $query = "INSERT INTO service_changes(product_id,ext_reference,service_id,location_type,order_status,order_type,request_date,order_number) ";
            $query .= "VALUES('$product_id','$ext_reference','$service_id','$location_type','$order_status','$order_type','$newDate','$serialized_order_number')";
            $result = mysqli_query($connection, $query);
            if ($result) {
                http_response_code(200);
                echo json_encode($serialized_order_number);
                exit();
            }
        }
    }
    echo "false";
    exit();
}

if (isset($_REQUEST['service-history'])) {


    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $data = $_REQUEST['service-history'];
    $location_id = mysqli_real_escape_string($connection, json_decode($data)->location_id);
    $location_type = mysqli_escape_string($connection, json_decode($data)->location_type);
    $service_id = mysqli_real_escape_string($connection, json_decode($data)->service_id);
    //  echo $location_id . " ". $location_type ." ". $service_id;
    if ($token_valid) {
        $service_history = array();
        $query = "SELECT * from service_changes ";
        $query .= "WHERE location_type like '%$location_type%' AND service_id='$service_id' ORDER BY order_number DESC";
        $result = mysqli_query($connection, $query);

        if ($result) {
            while ($row = mysqli_fetch_array($result)) {
                $history_record = new Regrade($row['request_id'], $row['product_id'], $row['ext_reference'], $row['service_id'], $row['location_type'], $row['order_status'], $row['order_type'], $row['request_date'], $row['order_number']);
                array_push($service_history, $history_record);
            }
            http_response_code(200);
            echo json_encode($service_history);
            exit();
        } else {
            echo "false";
        }
    } else {
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['cancel-regrade'])) {
    $postdata = file_get_contents("php://input");
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $order_status = mysqli_real_escape_string($connection, json_decode($postdata)->order_status);
        $order_number = mysqli_real_escape_string($connection, json_decode($postdata)->order_number);
        $query = "UPDATE service_changes SET order_status='$order_status'";
        $query .= "WHERE order_number like '%$order_number%'";
        $result = mysqli_query($connection, $query);
        if ($result) {
            http_response_code(200);
            echo json_encode($result);
            exit();
        } else {
            http_response_code(409);
            $connection->close();
            exit();
        }
    } else {
        echo "false";
        exit();
    }
}
