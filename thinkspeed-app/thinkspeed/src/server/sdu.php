<?php

class Sdu
{
    public $unit_id;
    public $unit;
    public $street_name;
    public $surburb;
    public $country;
    public $postal_code;
    public $fsan;
    public $active_service;

    function __construct($unit_id,$unit, $street_name, $surburb, $country, $postal_code, $fsan, $active_service)
    {
        $this->unit_id = $unit_id;
        $this->unit = $unit;
        $this->street_name = $street_name;
        $this->surburb = $surburb;
        $this->country = $country;
        $this->postal_code = $postal_code;
        $this->fsan = $fsan;
        $this->active_service = $active_service;
    }
}
?>