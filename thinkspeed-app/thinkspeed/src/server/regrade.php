<?php 

class Regrade{
    public $request_id;
    public $product_id;
    public $ext_reference;
    public $service_id;
    public $location_type;
    public $order_status;
    public $order_type;
   public $date;
   public $order_number;

    

    
   function __construct($request_id,$product_id,$ext_reference,$service_id,$location_type,$order_status,$order_type,$date,$order_number){
        $this ->request_id =$request_id;
        $this ->product_id = $product_id; 
        $this ->ext_reference = $ext_reference; 
        $this ->service_id = $service_id; 
        $this ->location_type = $location_type; 
        $this ->order_status = $order_status; 
        $this ->order_type = $order_type; 
        $this ->date = $date; 
        $this ->order_number = $order_number; 
     
    }
   

}
?>