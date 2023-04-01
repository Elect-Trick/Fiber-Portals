<?php 
class OutageComment{ 
    public $comment_id;
    public $outage_id;
    public $comment;
    public $comment_date;


    function __construct($comment_id,$outage_id,$comment,$comment_date)
    {
        $this ->comment_id = $comment_id;
        $this ->outage_id = $outage_id;
        $this ->comment= $comment;
        $this ->comment_date= $comment_date;
    }
}

?>