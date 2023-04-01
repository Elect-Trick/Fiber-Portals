<?php 

class LocationEntity
{ public $location_id ;
  public $name;
  public $surburb;
  
  function __construct($location_id,$name,$surburb){
    $this ->location_id = $location_id;
	  $this ->name = $name;
	  $this ->surburb = $surburb;


  }


}
?>