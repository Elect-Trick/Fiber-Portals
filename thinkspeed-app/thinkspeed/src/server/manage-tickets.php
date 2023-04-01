
<?php
include './headers.php';
include './jwt.php';
include './ticket.php';
include './complete-ticket.php';
include './fault-type.php';
include './comment.php';
include './user.php';
include './outage.php';
include './outage-comment.php';

if (isset($_REQUEST['log-ticket'])) {
    $postdata = file_get_contents("php://input");
    $ticket_status = mysqli_real_escape_string($connection, json_decode($postdata)->ticket_status);
    $location_id = mysqli_real_escape_string($connection, json_decode($postdata)->location_id);
    $location_type = mysqli_real_escape_string($connection, json_decode($postdata)->location_type);
    $service_id = mysqli_real_escape_string($connection, json_decode($postdata)->service_id);
    $fault_id = mysqli_real_escape_string($connection, json_decode($postdata)->fault_id);
    $fault_description = mysqli_real_escape_string($connection, json_decode($postdata)->fault_description);
    $client_name = mysqli_real_escape_string($connection, json_decode($postdata)->client_name);
    $client_surname = mysqli_real_escape_string($connection, json_decode($postdata)->client_surname);
    $client_contact_number = mysqli_real_escape_string($connection, json_decode($postdata)->client_contact_number);
    $client_email = mysqli_real_escape_string($connection, json_decode($postdata)->client_email);
    $creation_date = mysqli_real_escape_string($connection, json_decode($postdata)->creation_date);
    $network_id = mysqli_real_escape_string($connection, json_decode($postdata)->network_id);
    $alternative_contact_name = mysqli_real_escape_string($connection, json_decode($postdata)->alternative_contact_name);
    $alternative_number = mysqli_real_escape_string($connection, json_decode($postdata)->alternative_number);
    $organization_id = mysqli_real_escape_string($connection, json_decode($postdata)->organization_id);
    $ticketReference;
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {

        $duplicateCheck = "SELECT * FROM tickets ";
        $duplicateCheck .= "WHERE ((status_id != '5')AND(location_id ='$location_id') AND (service_id ='$service_id') AND (location_type like '%$location_type%'))";
        $dupResult = mysqli_query($connection, $duplicateCheck);
        if ($dupResult->num_rows != 0) {
            while ($row = mysqli_fetch_array($dupResult)) {
                $existing_order = $row['ticket_reference'];
            }
            echo json_encode($existing_order);
            http_response_code(409);
            exit();
            // Duplicate found

        } else {
            $date = date('Y-m-d');
            $newDate = str_replace(":", "-", $date);
            $processedDate = "FLT";
            $counterQuery = mysqli_query($connection, "SELECT COUNT(*) from tickets ");
            $totalEntries = mysqli_fetch_row($counterQuery);
            $tracker = ($totalEntries[0]) + 1;
            $ticketReference = "FLT" . "-" . str_pad($tracker, 7, '0', STR_PAD_LEFT);
            $query = "INSERT INTO tickets(ticket_reference,status_id,network_id,location_id,location_type,service_id,fault_id,fault_description,client_name,client_surname,client_contact_number,client_email,alternative_contact_name,alternative_number,creation_date, last_updated, organization_id,technician) ";
            $query .= "VALUES('$ticketReference','$ticket_status','$network_id','$location_id','$location_type','$service_id','$fault_id','$fault_description','$client_name','$client_surname','$client_contact_number','$client_email','$alternative_contact_name','$alternative_number','$newDate', '$newDate','$organization_id','')";
            $result = mysqli_query($connection, $query);
            if ($result) {
                echo "";
                http_response_code(200);
                echo json_encode($ticketReference);
                exit();
            } else {
                echo mysqli_error($connection);
                http_response_code(400);
                exit();
            }
        }
    } else {
        echo "false";
        exit();
    }
}



if (isset($_REQUEST['fetch-fault-types'])) {
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $query = "SELECT * from fault_types ";
        $result = mysqli_query($connection, $query);
        if ($result) {
            $fault_types = array();
            while ($row = mysqli_fetch_array($result)) {
                $fault_type = new FaultType($row['fault_id'], $row['fault_name']);
                array_push($fault_types, $fault_type);
            }
            http_response_code(200);
            echo json_encode($fault_types);
            exit();
        }
    } else {
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['location-tickets'])) {
    $date = date('Y-m-d H:i:s');
    //   $newDate = $date->date;

    $data = $_REQUEST['location-tickets'];
    $location_id = mysqli_real_escape_string($connection, json_decode($data)->location_id);
    $location_type = mysqli_real_escape_string($connection, json_decode($data)->location_type);
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {

        $query = "SELECT * from tickets ";
        $query .= "WHERE location_id='$location_id' AND location_type like '%$location_type%' ORDER BY status_id ASC";
        $result = mysqli_query($connection, $query);
        if ($result) {
            $tickets = array();
            while ($row = mysqli_fetch_array($result)) {
                $ticket = new Ticket($row['ticket_id'], $row['ticket_reference'], $row['status_id'], $row['location_id'], $row['location_type'], $row['client_name'], $row['service_id'], $row['network_id'], $row['fault_description'], $row['client_name'], $row['fault_id'], $row['client_contact_number'], $row['client_email'], $row['creation_date'], $row['alternative_contact_name'], $row['alternative_number'], $row['last_updated'], $row['organizatin_id'], $row['technician']);
                array_push($tickets, $ticket);
            }


            http_response_code(200);
            echo json_encode($tickets);
        } else {
            http_response_code(400);
            exit();
        }
    } else {
        // Token expired
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['post-comment'])) {
    $connection->autocommit(FALSE);

    $postdata = file_get_contents("php://input");
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $ticket_id = mysqli_real_escape_string($connection, json_decode($postdata)->ticket_id);
        $service_id = mysqli_real_escape_string($connection, json_decode($postdata)->service_id);
        $replier_email = mysqli_real_escape_string($connection, json_decode($postdata)->replier_email);
        $comment = mysqli_real_escape_string($connection, json_decode($postdata)->comment);
        $location_id = mysqli_real_escape_string($connection, json_decode($postdata)->location_id);
        $location_type = mysqli_real_escape_string($connection, json_decode($postdata)->location_type);
        $reply_date = mysqli_real_escape_string($connection, json_decode($postdata)->reply_date);
        // $reply_date = date('Y:m:d H:i:s');
        $timeZone = new DateTimeZone('Africa/Harare');
        $date = new DateTimeImmutable('now', $timeZone);
        $reply_date = date_format($date, 'Y-m-d H:i:s');
        // $reply_date->setTimezone('')
        // $timeStamp = $date->getTimestamp();
        // echo json_encode($final);
        $query = "INSERT INTO ticket_comments(ticket_id,service_id,replier_email,comment,location_id,location_type,reply_date) ";
        $query .= "VALUES('$ticket_id','$service_id','$replier_email','$comment','$location_id','$location_type','$reply_date')";


        $result =  mysqli_query($connection, $query);

        if ($result) {

            $updateQuery = "UPDATE tickets SET status_id='4' WHERE (ticket_id='$ticket_id' AND location_type='$location_type')";
            $updateResult = mysqli_query($connection, $updateQuery);
            if ($updateResult) {

                $connection->commit();

                echo "true";
                http_response_code(200);
                exit();
            } else {
                $connection->rollback();

                // Something went wrong
                http_response_code(400);
                exit();
            }
        } else {
            // First Query Failed
            http_response_code(401);
            exit();
        }
    } {
        //    Token Expired
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['fetch-comments'])) {

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {

        $data = $_REQUEST['fetch-comments'];
        $ticket_id = mysqli_real_escape_string($connection, json_decode($data)->ticket_id);
        $location_type = mysqli_real_escape_string($connection, json_decode($data)->location_type);

        $query = "SELECT * from ticket_comments ";
        $query .= "WHERE ticket_id ='$ticket_id' AND location_type like '%$location_type%' ORDER BY reply_date DESC";
        $result = mysqli_query($connection, $query);

        if ($result) {
            $comments = array();
            while ($row = mysqli_fetch_array($result)) {
                $comment = new Comment($row['comment_id'], $row['ticket_id'], $row['service_id'], $row['replier_email'], $row['comment'], $row['location_id'], $row['location_type'], $row['reply_date']);
                array_push($comments, $comment);
            }
            http_response_code(200);
            echo json_encode($comments);
            exit();
        } else {
            http_response_code(400);
            exit();
            // Something went wrong
        }
    } else {

        // Token Expired
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['accept-resolution'])) {

    $connection->autocommit(FALSE);
    $postdata = file_get_contents("php://input");

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);

    $ticket_id = mysqli_real_escape_string($connection, json_decode($postdata)->ticket_id);
    $location_id = mysqli_real_escape_string($connection, json_decode($postdata)->location_id);
    $location_type = mysqli_real_escape_string($connection, json_decode($postdata)->location_type);
    $ticket_reference = mysqli_real_escape_string($connection, json_decode($postdata)->ticket_reference);
    $network_id = mysqli_real_escape_string($connection, json_decode($postdata)->network_id);
    $timeZone = new DateTimeZone('Africa/Harare');
    $date = new DateTimeImmutable('now', $timeZone);
    $last_updated = date_format($date, 'Y-m-d H:i:s');
    // update ticket status and last_updated based on ticket_id, location_type
    if ($token_valid) {
        $query = "UPDATE tickets SET status_id=5, last_updated='$last_updated' ";
        $query .= "WHERE ticket_id='$ticket_id'";
        $result = mysqli_query($connection, $query);
        if ($result) {
            echo "true";
            http_response_code(200);
            $connection->commit();
            exit();
        } else {
            http_response_code(400);
            $connection->rollback();

            // something went wrong
            exit();
        }
    } else {
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['find-ticket'])) {
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $data = $_REQUEST['find-ticket'];
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $ticket_reference = mysqli_real_escape_string($connection, json_decode($data)->searchString);
    $location_type = mysqli_real_escape_string($connection, json_decode($data)->type);
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $tickets = array();
    $ticket;
    $complete_ticket;

    if ($token_valid) {


        $query = "SELECT * from tickets where ticket_reference like '%$ticket_reference%' ";
        $result = mysqli_query($connection, $query);

        if ($result) {


            while ($row = mysqli_fetch_array($result)) {
                $ticket = new Ticket($row['ticket_id'], $row['ticket_reference'], $row['status_id'], $row['location_id'], $row['location_type'], $row['client_name'], $row['service_id'], $row['network_id'], $row['fault_description'], $row['client_name'], $row['fault_id'], $row['client_contact_number'], $row['client_email'], $row['creation_date'], $row['alternative_contact_name'], $row['alternative_number'], $row['last_updated'], $row['organization_id'], $row['technician']);
            }
            switch ($ticket->location_type) {
                case 'sdu':
                    $location_query = "SELECT * from sdu_locations where location_id='$ticket->location_id'";
                    $location_result = mysqli_query($connection, $location_query);

                    if ($location_result) {

                        while ($location_row = mysqli_fetch_array($location_result)) {
                            $location_string = $location_row['sdu_unit'] . " " .  $location_row['sdu_street_name'] . ", " . $location_row['sdu_surburb'];
                            array_push($tickets, $ticket);

                            $complete_ticket = new CompleteTicket($tickets, $location_string);
                        }
                        http_response_code(200);

                        echo json_encode($complete_ticket);
                        exit();
                    } else {
                    }


                    # code...
                    break;

                default:
                    # code...
                    $location_query = "SELECT * from mdu_locations where location_id='$ticket->location_id'";
                    $location_result = mysqli_query($connection, $location_query);

                    if ($location_result) {

                        while ($location_row = mysqli_fetch_array($location_result)) {
                            $location_string = "unit " . $location_row['mdu_unit'] . " " . $location_row['mdu_name'] . " ," . $location_row['mdu_street_name'] . ", " . $location_row['mdu_surburb'];
                            array_push($tickets, $ticket);

                            $complete_ticket = new CompleteTicket($tickets, $location_string);
                        }
                        http_response_code(200);

                        echo json_encode($complete_ticket);
                        exit();
                    } else {
                    }
                    break;
            }
            // $connection->commit();
            http_response_code(200);
            echo json_encode($tickets);
            exit();
        } else {
            http_response_code(400);
            // $connection->rollback();

            // something went wrong
            exit();
        }
    } else {
        echo "false";
        exit();
    }
}


if (isset($_REQUEST['count-closed-tickets'])) {
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $totalEntries;
    if ($token_valid) {
        $query = mysqli_query($connection, "SELECT COUNT(*) from tickets where status_id  IN('5')");
        if ($query) {
            $totalEntries = mysqli_fetch_row($query)[0];
        } else {
        }
        echo $totalEntries;
    }
}
if (isset($_REQUEST['count-tickets'])) {
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $totalEntries;
    if ($token_valid) {
        $query = mysqli_query($connection, "SELECT COUNT(*) from tickets where status_id NOT IN('5','3')");
        if ($query) {
            $totalEntries = mysqli_fetch_row($query)[0];
        } else {
        }
        echo $totalEntries;
    }
}


if (isset($_REQUEST['paginated-tickets'])) {
    $items_per_page = 6;
    $page =  mysqli_real_escape_string($connection, $_REQUEST['paginated-tickets']);
    ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $totalEntries;
    if ($token_valid) {
        $totalEntries = mysqli_fetch_array(mysqli_query($connection, "SELECT  count(ticket_id) from tickets where status_id NOT IN('5','3') "))[0];
        $tickets = array();
        $query = "SELECT * from tickets WHERE status_id NOT IN('5','3') order by creation_date asc  limit $limiter,$items_per_page  ";
        $result =  mysqli_query($connection, $query);
        if ($result) {
            while ($row = mysqli_fetch_array($result)) {
                $ticket = new Ticket($row['ticket_id'], $row['ticket_reference'], $row['status_id'], $row['location_id'], $row['location_type'], $row['client_name'], $row['service_id'], $row['network_id'], $row['fault_description'], $row['client_name'], $row['fault_id'], $row['client_contact_number'], $row['client_email'], $row['creation_date'], $row['alternative_contact_name'], $row['alternative_number'], $row['last_updated'], $row['organization_id'], $row['technician']);
                array_push($tickets, $ticket);
            }
            $final = new stdClass;
            $final->totalEntries = $totalEntries;
            $final->tickets = $tickets;
            echo json_encode($final);
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
if (isset($_REQUEST['paginated-closed-tickets'])) {
    $items_per_page = 6;
    $page =  mysqli_real_escape_string($connection, $_REQUEST['paginated-closed-tickets']);
    ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $totalEntries;
    if ($token_valid) {
        $totalEntries = mysqli_fetch_array(mysqli_query($connection, "SELECT  count(ticket_id) from tickets where status_id  IN('5') "))[0];

        $tickets = array();
        $query = "SELECT * from tickets WHERE status_id  IN('5') order by creation_date asc  limit $limiter,$items_per_page  ";
        $result =  mysqli_query($connection, $query);
        if ($result) {
            while ($row = mysqli_fetch_array($result)) {
                $ticket = new Ticket($row['ticket_id'], $row['ticket_reference'], $row['status_id'], $row['location_id'], $row['location_type'], $row['client_name'], $row['service_id'], $row['network_id'], $row['fault_description'], $row['client_name'], $row['fault_id'], $row['client_contact_number'], $row['client_email'], $row['creation_date'], $row['alternative_contact_name'], $row['alternative_number'], $row['last_updated'], $row['organization_id'], $row['technician']);
                array_push($tickets, $ticket);
            }
            $final = new stdClass;
            $final->totalEntries = $totalEntries;
            $final->tickets = $tickets;
            echo json_encode($final);
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

if (isset($_REQUEST['all-open-tickets'])) {

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token) {
        $query = "SELECT * from tickets ";
        $query .= "WHERE status_id NOT IN ('5','3') ";
        $result = mysqli_query($connection, $query);
        $tickets = array();
        if ($result) {
            while ($row = mysqli_fetch_array($result)) {
                $ticket = new Ticket($row['ticket_id'], $row['ticket_reference'], $row['status_id'], $row['location_id'], $row['location_type'], $row['client_name'], $row['service_id'], $row['network_id'], $row['fault_description'], $row['client_name'], $row['fault_id'], $row['client_contact_number'], $row['client_email'], $row['creation_date'], $row['alternative_contact_name'], $row['alternative_number'], $row['last_updated'], $row['organization_id'], $row['technician']);
                array_push($tickets, $ticket);
            }
            echo json_encode($tickets);
        } else {
            http_response_code(400);
            exit();
        }
    } else {

        echo "false";
        exit();
    }
}
if (isset($_REQUEST['all-closed-tickets'])) {

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token) {
        $query = "SELECT * from tickets ";
        $query .= "WHERE status_id  IN ('5') ";
        $result = mysqli_query($connection, $query);
        $tickets = array();
        if ($result) {
            while ($row = mysqli_fetch_array($result)) {
                $ticket = new Ticket($row['ticket_id'], $row['ticket_reference'], $row['status_id'], $row['location_id'], $row['location_type'], $row['client_name'], $row['service_id'], $row['network_id'], $row['fault_description'], $row['client_name'], $row['fault_id'], $row['client_contact_number'], $row['client_email'], $row['creation_date'], $row['alternative_contact_name'], $row['alternative_number'], $row['last_updated'], $row['organization_id'], $row['technician']);
                array_push($tickets, $ticket);
            }
            echo json_encode($tickets);
        } else {
            http_response_code(400);
            exit();
        }
    } else {

        echo "false";
        exit();
    }
}

if (isset($_REQUEST['fetch-technicians'])) {
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $query = "SELECT * from users ";
        $query .= "WHERE role_id ='3'";
        $result = mysqli_query($connection, $query);
        $technicians = array();
        if ($result) {
            while ($row = mysqli_fetch_array($result)) {
                $technician = new User($row['user_id'], $row['user_account_name'], $row['user_email'], $row['organization_id'], $row['role_id']);
                array_push($technicians, $technician);
            }
            echo json_encode($technicians);
        } else {
        }
    } else {
        // Token expired
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['assign-ticket'])) {
    $postdata = file_get_contents("php://input");
    $technician = mysqli_real_escape_string($connection, json_decode($postdata)->technician);
    $ticket_id = mysqli_real_escape_string($connection, json_decode($postdata)->ticket_id);
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $updateQuery = "UPDATE tickets SET technician='$technician' WHERE ticket_id='$ticket_id'";
        $result = mysqli_query($connection, $updateQuery);
        if ($result) {
            echo "true";
            exit();
        } else {
            http_response_code(400);
            // Something went wrong

        }
    } else {
        // Token Expired
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['mark-as-resolved'])) {
    $postdata = file_get_contents("php://input");
    $technician = mysqli_real_escape_string($connection, json_decode($postdata)->technician);
    $ticket_id = mysqli_real_escape_string($connection, json_decode($postdata)->ticket_id);
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $updateQuery = "UPDATE tickets SET status_id='3' WHERE ticket_id='$ticket_id'";
        $result = mysqli_query($connection, $updateQuery);
        if ($result) {
            echo "true";
            exit();
        } else {
            http_response_code(400);
            // Something went wrong

        }
    } else {
        // Token Expired
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['log-outage'])) {
    $postdata = file_get_contents("php://input");
    $affected_areas = mysqli_real_escape_string($connection, implode(",", json_decode($postdata)->affected_areas));
    $date_logged = mysqli_real_escape_string($connection, json_decode($postdata)->date);
    $incident_report = mysqli_real_escape_string($connection, json_decode($postdata)->incident_report);
    $incident_type = mysqli_real_escape_string($connection, json_decode($postdata)->incident_type);
    $severity = mysqli_real_escape_string($connection, json_decode($postdata)->severity);
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);

    if ($token_valid) {
        $date = date('Y-m-d');
        $newDate = str_replace(":", "-", $date);
        $counterQuery = mysqli_query($connection, "SELECT COUNT(*) from outages ");
        $totalEntries = mysqli_fetch_row($counterQuery);
        $tracker = ($totalEntries[0]) + 1;
        switch ($incident_type) {
            case 1:
                $ticketReference = "OTG" . "-" . str_pad($tracker, 4, '0', STR_PAD_LEFT);
                break;

            default:
                # code...
                $ticketReference = "MTC" . "-" . str_pad($tracker, 4, '0', STR_PAD_LEFT);

                break;
        }

        // Submit to DB 
        $query = "INSERT INTO outages(outage_reference,affected_areas,date,incident_type,severity,last_updated) ";
        $query .= "VALUES('$ticketReference','$affected_areas','$date_logged','$incident_type', '$severity','$date_logged')";
        $result = mysqli_query($connection, $query);
        if ($result) {
            echo json_encode($ticketReference);
            exit();
        } else {
            // Something went wrong
            http_response_code(400);
            exit();
        }
    } else {
        // Token Invalid
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['paginated-outages'])) {
    $items_per_page = 6;
    $page =  mysqli_real_escape_string($connection, $_REQUEST['paginated-outages']);
    ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $totalEntries;
    if ($token_valid) {
        $outages = array();
        $query = "SELECT * from outages WHERE outage_status='1' order by date asc  limit $limiter,$items_per_page";
        $result =  mysqli_query($connection, $query);
        if ($result) {
            $totalEntries = mysqli_fetch_array(mysqli_query($connection, "SELECT count(outage_id) from outages WHERE outage_status='1'"))[0];
            while ($row = mysqli_fetch_array($result)) {

                $outage = new Outage($row['outage_id'], $row['outage_reference'], $row['affected_areas'], $row['date'], $row['incident_type'], $row['severity'], $row['outage_status'], $row['last_updated']);
                array_push($outages, $outage);
            }
            // array_push($outages, $row2);
            $complete = array($outages, $totalEntries);

            echo json_encode($complete);

            // echo json_encode($outages);
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
if (isset($_REQUEST['close-outage'])) {
    $postdata = file_get_contents("php://input");
    $technician = mysqli_real_escape_string($connection, json_decode($postdata)->technician);
    $outage_reference = mysqli_real_escape_string($connection, json_decode($postdata)->outage_reference);
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $updateQuery = "UPDATE outages SET outage_status='2' WHERE outage_reference='$outage_reference'";
        $result = mysqli_query($connection, $updateQuery);
        if ($result) {
            echo "true";
            exit();
        } else {
            http_response_code(400);
            // Something went wrong

        }
    } else {
        // Token Expired
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['post-incident-update'])) {
    // $connection->autocommit(FALSE);
    $postdata = file_get_contents("php://input");
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {
        $outage_id = mysqli_real_escape_string($connection, json_decode($postdata)->outage_id);
        $comment = mysqli_real_escape_string($connection, json_decode($postdata)->comment);
        $comment_by = mysqli_real_escape_string($connection, json_decode($postdata)->comment_by);
        $timeZone = new DateTimeZone('Africa/Harare');
        $date = new DateTimeImmutable('now', $timeZone);
        $comment_date = date_format($date, 'Y-m-d H:i:s');
        $query = "INSERT INTO outage_comments(outage_id,comment,comment_date,comment_by) ";
        $query .= "VALUES('$outage_id','$comment','$comment_date','$comment_by')";


        $result =  mysqli_query($connection, $query);

        if ($result) {
            echo "true";
            exit();
        } else {
            // First Query Failed
            http_response_code(401);
            exit();
        }
    } {
        //    Token Expired
        echo "false";
        exit();
    }
}
if (isset($_REQUEST['closed-outages'])) {
    $items_per_page = 6;
    $page =  mysqli_real_escape_string($connection, $_REQUEST['closed-outages']);
    ($page == "" || $page == 1) ? $limiter = 0 : $limiter = ($page - 1) * $items_per_page;

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $totalEntries;
    if ($token_valid) {
        $outages = array();
        $query = "SELECT * from outages WHERE outage_status='2' order by date asc  limit $limiter,$items_per_page";
        $result =  mysqli_query($connection, $query);
        if ($result) {
            $totalEntries = mysqli_fetch_array(mysqli_query($connection, "SELECT count(outage_id) from outages WHERE outage_status='2'"))[0];
            while ($row = mysqli_fetch_array($result)) {

                $outage = new Outage($row['outage_id'], $row['outage_reference'], $row['affected_areas'], $row['date'], $row['incident_type'], $row['severity'], $row['outage_status'], $row['last_updated']);
                array_push($outages, $outage);
            }
            // array_push($outages, $row2);
            $complete = array($outages, $totalEntries);

            echo json_encode($complete);

            // echo json_encode($outages);
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

if (isset($_REQUEST['fetch-incident-comments'])) {

    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    if ($token_valid) {

        $data = $_REQUEST['fetch-incident-comments'];
        $outage_id = mysqli_real_escape_string($connection, json_decode($data)->outage_id);

        $query = "SELECT * from outage_comments ";
        $query .= "WHERE outage_id ='$outage_id' ORDER BY comment_date DESC";
        $result = mysqli_query($connection, $query);

        if ($result) {
            $comments = array();
            while ($row = mysqli_fetch_array($result)) {
                $comment = new OutageComment($row['comment_id'], $row['outage_id'], $row['comment'], $row['comment_date']);
                array_push($comments, $comment);
            }
            echo json_encode($comments);
            exit();
        } else {
            http_response_code(400);
            exit();
            // Something went wrong
        }
    } else {

        // Token Expired
        echo "false";
        exit();
    }
}

if (isset($_REQUEST['find-outage'])) {

    $data = $_REQUEST['find-outage'];
    $outage_reference = mysqli_real_escape_string($connection, json_decode($data)->searchString);
    $jwtInstance = new JWT();
    $token = $jwtInstance->fetchJWT();
    $token_valid = $jwtInstance->is_jwt_valid($token);
    $outages = array();
    $outage;
    $complete_ticket;

    if ($token_valid) {


        $query = "SELECT * from outages where outage_reference like '%$outage_reference%' limit 5 ";
        $result = mysqli_query($connection, $query);

        if ($result) {


            while ($row = mysqli_fetch_array($result)) {
                $outage = new Outage($row['outage_id'], $row['outage_reference'], $row['affected_areas'], $row['date'], $row['incident_type'], $row['severity'], $row['outage_status'], $row['last_updated']);
                array_push($outages, $outage);
            }

            echo json_encode($outages);
            exit();
        } else {
            http_response_code(400);
            // $connection->rollback();

            // something went wrong
            exit();
        }
    } else {
        echo "false";
        exit();
    }
}


?>