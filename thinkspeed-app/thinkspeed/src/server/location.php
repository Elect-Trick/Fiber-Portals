<?php 

class Location
{ public $location_id ;
  public $location_string;
  
  function __construct($location_id,$location_string){
    $this ->location_id = $location_id;
	  $this ->location_string = $location_string;


  }


}
?>