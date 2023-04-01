<?php

class Service
{
    public $service_id;
    public $location_id;
    public $product_id;
    public $organization_id;
    public $isp_order_number;
    public $network_id;
    public $vlan;
    public $isp_modem_mac;
    public $service_status;
    public $last_updated;
    public $order_type;
    public $location_string;
    public $client_name;
    public $client_surname;
    public $client_contact_number;
    public $client_email;
    public $order_number;

    function __construct($service_id, $location_id, $product_id, $organization_id, $isp_order_number,$order_type, $network_id, $isp_modem_mac, $service_status, $last_updated, $vlan,$location_string, $client_name,$client_surname,$client_email,$client_contact_number,$order_number)
    {
        $this->service_id = $service_id;
        $this->location_id = $location_id;
        $this->product_id = $product_id;
        $this->organization_id = $organization_id;
        $this->isp_order_number = $isp_order_number;
        $this->network_id = $network_id;
        $this->isp_modem_mac = $isp_modem_mac;
        $this->service_status = $service_status;
        $this->last_updated = $last_updated;
        $this->vlan = $vlan;
        $this->order_type = $order_type;
        $this->location_string = $location_string;
        $this->client_name = $client_name;
        $this->client_surname = $client_surname;
        $this->client_contact_number = $client_contact_number;
        $this->client_email = $client_email;
        $this->order_number = $order_number;
    }
}
