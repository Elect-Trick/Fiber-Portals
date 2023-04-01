<?php
class Complex
{
    public $location_id;
    public $complex_name;
    public $units;

    function __construct($location_id,$complex_name, $units)
    {
        $this->location_id = $location_id;
        $this->complex_name = $complex_name;
        $this->units = $units;
    }
}
