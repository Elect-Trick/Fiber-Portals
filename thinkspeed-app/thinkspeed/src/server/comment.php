<?php 

class Comment{


    public $comment_id;
    public $ticket_id;
    public $service_id;
    public $replier_email;
    public $comment;
    public $location_id;
    public $location_type;
    public $reply_date;

    function __construct($comment_id,$ticket_id,$service_id,$replier_email,$comment,$location_id,$location_type,$reply_date)
    {
        $this ->comment_id = $comment_id; 
        $this ->ticket_id = $ticket_id; 
        $this ->service_id = $service_id; 
        $this ->replier_email = $replier_email; 
        $this ->comment = $comment; 
        $this ->location_id = $location_id; 
        $this ->location_type = $location_type; 
        $this ->reply_date = $reply_date; 



        
    }

    
}
