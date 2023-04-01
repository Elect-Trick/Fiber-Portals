<?php

class Ticket
{
    public $ticket_id;
    public $ticket_reference;
    public $ticket_status;
    public $location_id;
    public $location_type;
    public $service_id;
    public $fault_id;
    public $fault_description;
    public $client_name;
    public $client_surname;
    public $client_contact_number;
    public $client_email;
    public $creation_date;
    public $network_id;
    public $alternative_contact_name;
    public $alternatice_number;
    public $last_updated;
    public $organization_id;
    public $technician;
  


    function __construct($ticket_id, $ticket_reference, $ticket_status, $location_id, $location_type,$client_surname, $service_id,$network_id, $fault_description, $client_name, $fault_id,$client_contact_number,$client_email,$creation_date,$alternative_contact_name,$alternatice_number,$last_updated,$organization_id,$technician)
    {
        $this->ticket_id = $ticket_id;
        $this->ticket_reference = $ticket_reference;
        $this->ticket_status = $ticket_status;
        $this->location_id = $location_id;
        $this->location_type = $location_type;
        $this->service_id = $service_id;
        $this->fault_description = $fault_description;
        $this->client_name = $client_name;
        $this->fault_id = $fault_id;
        $this->client_surname = $client_surname;
        $this->client_contact_number = $client_contact_number;
        $this->client_email = $client_email;
        $this->creation_date = $creation_date;
        $this->network_id = $network_id;
        $this->alternative_contact_name = $alternative_contact_name;
        $this->alternatice_number = $alternatice_number;
        $this->last_updated = $last_updated;
        $this->organization_id = $organization_id;
        $this->technician = $technician;

    }
}
