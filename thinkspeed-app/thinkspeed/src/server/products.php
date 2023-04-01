<?php 
class Products{ 
    public $product_id;
    public $product_name;
    public $product_price;


    function __construct($product_id,$product_name,$product_price)
    {
        $this ->product_id = $product_id;
        $this ->product_name = $product_name;
        $this ->product_price = $product_price;
    }
}

?>