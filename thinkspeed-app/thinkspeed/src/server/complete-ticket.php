<?php 
class CompleteTicket{ 
    public $ticket;
    public $location_string;

    function __construct($ticket,$location_string)
    {
        $this ->ticket = $ticket;
        $this ->location_string = $location_string;
    }
}

?>