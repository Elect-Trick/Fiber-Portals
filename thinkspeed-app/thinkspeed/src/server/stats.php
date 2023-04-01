<?php 
class Stats {

    public $active_services;
    public $pending_services;
    public $cancelled_services;
    public $rejected_orders;
    public $pending_orders;
    public $closed_tickets;
    public $open_tickets;


    function __construct($active_services,$pending_services,$cancelled_services,$rejected_orders,$pending_orders,$open_tickets,$closed_tickets)
    {
        $this ->active_services =$active_services;
        $this ->pending_services = $pending_services; 
        $this ->cancelled_services = $cancelled_services; 
        $this ->rejected_orders = $rejected_orders; 
        $this ->closed_tickets = $closed_tickets; 
        $this ->open_tickets = $open_tickets; 
        $this ->pending_orders = $pending_orders; 
     
     
        
    }

}