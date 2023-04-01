<?php
include './headers.php';
include './jwt.php';
include './complex.php';
include './mdu.php';
include './sdu.php';
include './single-unit.php';
include './location.php';
include './location-entity.php';

if (isset($_REQUEST['paginated-mdus'])) {
    $items_per_page = 2;
    $page =  mysqli_real_escape_string($connection, $_REQUEST['paginated-mdus']);
    ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;


    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        // Find Distinct complex /Estate names
        $query = "SELECT DISTINCT mdu_name from mdu_locations limit $limiter,$items_per_page ";
        $result = mysqli_query($connection, $query);
        $complexes = array();
        $complex_post;

        if ($result) {
            $totalEntries = mysqli_fetch_array(mysqli_query($connection, "SELECT  count(DISTINCT mdu_name) from mdu_locations "))[0];
            // echo $totalEntries;
            $data = array();
            while ($row = mysqli_fetch_array($result)) {
                $complex = $row['mdu_name'];
                array_push($data, $complex);
            }
            for ($i = 0; $i < sizeof($data); $i++) {
                $units = array();
                // Populate object containing complex name and its respective units
                $query = "SELECT * from mdu_locations where mdu_name ='$data[$i]'";
                $unit_result = mysqli_query($connection, $query);
                if ($unit_result) {
                    while ($row = mysqli_fetch_array($unit_result)) {
                        $complex_pre = new Mdu($row['location_id'], $row['mdu_unit'], $row['mdu_name'], $row['mdu_street_name'], $row['mdu_surburb'], $row['mdu_country'], $row['mdu_postal_code'], $row['network_id'], $row['is_active']);
                        array_push($units, $complex_pre);
                    }
                    $complex_post = new Complex($i, $data[$i], $units);
                    array_push($complexes, $complex_post);
                    $final = new stdClass();
                    $final->totalEntries = (int)$totalEntries;
                    $final->complexes = $complexes;
                }
            }

            echo json_encode($final);
        }
    } else {
        echo "false";
        exit();
        // Token expired
    }
}
if (isset($_REQUEST['paginated-sdus'])) {
    $items_per_page = 2;
    $page =  mysqli_real_escape_string($connection, $_REQUEST['paginated-sdus']);
    ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        // Find Distinct complex /Estate names
        $query = "SELECT DISTINCT sdu_surburb from sdu_locations limit $limiter,$items_per_page ";
        $result = mysqli_query($connection, $query);
        $streets = array();
        $complex_post;

        if ($result) {
            $totalEntries = mysqli_fetch_array(mysqli_query($connection, "SELECT count(location_id) from sdu_locations "))[0];

            $data = array();
            while ($row = mysqli_fetch_array($result)) {
                $street = $row['sdu_surburb'];
                array_push($data, $street);
            }

            for ($i = 0; $i < sizeof($data); $i++) {
                $units = array();
                // Populate object containing complex name and its respective units
                $query = "SELECT * from sdu_locations where sdu_surburb like '%$data[$i]%'";
                $unit_result = mysqli_query($connection, $query);
                if ($unit_result) {
                    while ($row = mysqli_fetch_array($unit_result)) {
                        $complex_pre = new Sdu($row['location_id'], $row['sdu_unit'], $row['sdu_street_name'], $row['sdu_surburb'], $row['sdu_country'], $row['sdu_postal_code'], $row['network_id'], $row['is_active']);
                        array_push($units, $complex_pre);
                    }
                    $complex_post = new SingleUnit($i, $complex_pre->street_name, $units);
                    array_push($streets, $complex_post);
                    $final = new stdClass();
                    $final->totalEntries = $totalEntries;
                    $final->streets = $streets;
                }
            }

            echo json_encode($final);
        }
    } else {
        echo "false";
        exit();
        // Token expired
    }
}
if (isset($_REQUEST['fetch-all-sdus'])) {
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $query = "SELECT * from sdu_locations";
        $result = mysqli_query($connection, $query);
        $sdus = array();
        if (!$result) {
            // Nothing found 
            http_response_code(400);
            exit();
        } else {
            while ($row = mysqli_fetch_array($result)) {
                $data = new Sdu($row['location_id'], $row['sdu_unit'], $row['sdu_street_name'], $row['sdu_surburb'], $row['sdu_country'], $row['sdu_postal_code'], $row['network_id'], $row['is_active']);

                // $data = new User($row['user_id'], $row['user_account_name'], $row['user_email'], $row['organization_id'], $row['role_id']);
                array_push($sdus, $data);
            }
            echo json_encode($sdus);
            exit();
        }
    } else {
        echo "false";
        // Token invalid
    }
}
if (isset($_REQUEST['fetch-all-mdus'])) {
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $query = "SELECT * from mdu_locations";
        $result = mysqli_query($connection, $query);
        $mdus = array();
        if (!$result) {
            // Nothing found 
            http_response_code(400);
            exit();
        } else {
            while ($row = mysqli_fetch_array($result)) {
                $data = new Mdu($row['location_id'], $row['mdu_unit'], $row['mdu_name'], $row['mdu_street_name'], $row['mdu_surburb'], $row['mdu_country'], $row['mdu_postal_code'], $row['network_id'], $row['is_active']);

                // $data = new User($row['user_id'], $row['user_account_name'], $row['user_email'], $row['organization_id'], $row['role_id']);
                array_push($mdus, $data);
            }
            echo json_encode($mdus);
            exit();
        }
    } else {
        echo "false";
        // Token invalid
    }
}
// Find Location By Name
if (isset($_REQUEST['find-location'])) {

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $content = array();
    // if ($token_valid) {
    //     $data = $_REQUEST['find-location'];
    //     $location_type = mysqli_real_escape_string($connection, json_decode($_REQUEST['find-location'])->type);
    //     $search_string = mysqli_real_escape_string($connection, json_decode($_REQUEST['find-location'])->searchString);

    //     switch ($location_type) {
    //         case 'sdu':
    //             # code...
    //             $i=0;
    //             $sdus = array();
    //             $query = "SELECT * from sdu_locations where sdu_street_name like '%$search_string%'";
    //             $result = mysqli_query($connection, $query);
    //             if ($result) {

    //                 while ($row = mysqli_fetch_array($result)) {
    //                     $sdu = new Sdu($row['location_id'], $row['sdu_unit'], $row['sdu_street_name'], $row['sdu_surburb'], $row['sdu_country'], $row['sdu_postal_code'], $row['network_id'], $row['is_active']);
    //                     array_push($sdus, $sdu);
    //                 }
    //                 $complex_post = new SingleUnit($i++, $sdu->street_name, $sdus);
    //                 array_push($sdus, $complex_post);
    //                 $final = new stdClass();
    //                 // $final->totalEntries = $totalEntries;
    //                 $final->streets = $sdus;
    //                 echo json_encode($final);
    //             }
    //             break;

    //         default:
    //             # code...
    //             break;
    //     }
    // } else {
    //     echo "false";
    //     exit();
    // }
    // Data clean up before using values in DB
    $location_type = mysqli_real_escape_string($connection, json_decode($_REQUEST['find-location'])->type);
    $search_string = mysqli_real_escape_string($connection, json_decode($_REQUEST['find-location'])->searchString);
    $locations = array();
    $units = array();
    if ($token_valid) {
        // Find Distinct complex /Estate names

        switch ($location_type) {
            case 'sdu':
                # code...
                // 
                $query = "SELECT DISTINCT sdu_surburb,sdu_street_name from sdu_locations  where sdu_street_name like '%$search_string%' ";
                $result = mysqli_query($connection, $query);
                if ($result) {
                    // Populate an array of the surburbs along with one of the associated street Name we are looking for.

                    while ($row = mysqli_fetch_array($result)) {
                        array_push($content, $row['sdu_surburb']);
                        array_push($units, $row['sdu_street_name']);
                    }
                    // echo json_encode($streets);
                    for ($i = 0; $i < sizeof($content); $i++) {
                        $location = new LocationEntity($i, $units[$i], $content[$i]);
                        array_push($locations, $location);
                    }
                    echo json_encode($locations);
                    exit();
                } else {
                }

                break;

            case 'mdu':
                # code...
                $query = "SELECT DISTINCT mdu_surburb,mdu_name from mdu_locations  where mdu_name like '%$search_string%' ";
                $result = mysqli_query($connection, $query);
                if ($result) {
                    // Populate an array of the surburbs along with one of the associated street Name we are looking for.

                    while ($row = mysqli_fetch_array($result)) {
                        array_push($content, $row['mdu_surburb']);
                        array_push($units, $row['mdu_name']);
                    }
                    // echo json_encode($streets);
                    for ($i = 0; $i < sizeof($content); $i++) {
                        $location = new LocationEntity($i, $units[$i], $content[$i]);
                        array_push($locations, $location);
                    }
                    echo json_encode($locations);
                    exit();
                } else {
                }
                break;
        }
    } else {
        echo "false";
        exit();
        // Token expired
    }
}

if (isset($_REQUEST['retrieve-sdunits'])) {

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $data = $_REQUEST['retrieve-sdunits'];
        $location_type = json_decode($_REQUEST['retrieve-sdunits'])->type;
        $name = json_decode($_REQUEST['retrieve-sdunits'])->name;
        $surburb = json_decode($_REQUEST['retrieve-sdunits'])->surburb;
        switch ($location_type) {
            case 'sdu':
                # code...
                $units = array();
                $streets = array();
                $query = "SELECT * from sdu_locations where sdu_street_name='$name' AND sdu_surburb='$surburb'";
                $result = mysqli_query($connection, $query);
                if ($result) {
                    # code...
                    while ($row = mysqli_fetch_array($result)) {
                        $unit = new Sdu($row['location_id'], $row['sdu_unit'], $row['sdu_street_name'], $row['sdu_surburb'], $row['sdu_country'], $row['sdu_postal_code'], $row['network_id'], $row['is_active']);
                        array_push($units, $unit);
                    }
                    $complex_post = new SingleUnit(1, $name, $units);
                    array_push($streets, $complex_post);
                    $final = new stdClass();
                    $final->streets = $streets;

                    echo json_encode($final);
                } else {
                    # code...
                }


                break;

            case 'mdu':
                $units = array();
                $complexes = array();
                $query = "SELECT * from mdu_locations where mdu_name='$name' AND mdu_surburb='$surburb'";
                $result = mysqli_query($connection, $query);
                if ($result) {
                    # code...
                    while ($row = mysqli_fetch_array($result)) {
                $unit = new Mdu($row['location_id'], $row['mdu_unit'], $row['mdu_name'], $row['mdu_street_name'], $row['mdu_surburb'], $row['mdu_country'], $row['mdu_postal_code'], $row['network_id'], $row['is_active']);
                        array_push($units, $unit);
                    }
                    $complex_post = new Complex(1, $name, $units);
                    array_push($complexes, $complex_post);
                    $final = new stdClass();
                    $final->complexes = $complexes;

                    echo json_encode($final);
                    break;
                }
        }
    } else {
        // Token Expired
        echo "false";
        exit();
    }
}
