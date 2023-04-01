<?php 

class OrderStatus{
    public $order_number;
    public $order_status;
    public $product;
    public $creation_date;
    public $location_id;
    public $client_name;
    public $client_surname;
    public $client_email;
    public $contact_number;
    public $order_type;
    public $isp_reference;
    public $organization_id;
    public $network_id;
    public $location_type;
    public $technician_id;
    public $order_fullfilled;
    public $scheduled_date;
    

    
    function __construct($order_number,$order_status,$product,$creation_date,$location_id,$client_name,$client_surname,$client_email,$contact_number,$order_type,$isp_reference,$organization_id,$network_id,$location_type,$technician_id,$order_fullfilled,$scheduled_date){
        $this ->order_number =$order_number;
        $this ->order_status = $order_status; 
        $this ->product = $product; 
        $this ->creation_date = $creation_date; 
        $this ->location_id = $location_id; 
        $this ->client_name = $client_name; 
        $this ->client_surname = $client_surname; 
        $this ->client_email = $client_email; 
        $this ->contact_number = $contact_number; 
        $this ->order_type = $order_type; 
        $this ->isp_reference = $isp_reference; 
        $this ->organization_id = $organization_id; 
        $this ->network_id = $network_id; 
        $this ->location_type = $location_type; 
        $this ->technician_id = $technician_id; 
        $this ->order_fullfilled = $order_fullfilled; 
        $this ->scheduled_date = $scheduled_date; 
    }
   

}
?>