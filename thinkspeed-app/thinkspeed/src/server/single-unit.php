<?php
class SingleUnit
{
    public $location_id;
    public $street_name;
    public $units;

    function __construct($location_id,$street_name, $units)
    {
        $this->location_id = $location_id;
        $this->street_name = $street_name;
        $this->units = $units;
    }
}
