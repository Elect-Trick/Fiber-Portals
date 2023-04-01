<?php 
class FaultType{ 
    public $fault_id;
    public $fault_name;


    function __construct($fault_id,$fault_name)
    {
        $this ->fault_id = $fault_id;
        $this ->fault_name = $fault_name;
    }
}

?>