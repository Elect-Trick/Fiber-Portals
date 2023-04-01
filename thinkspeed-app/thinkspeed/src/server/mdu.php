<?php

class Mdu
{
    public $unit_id;
    public $unit;
    public $complex_name;
    public $complex_street;
    public $surburb;
    public $country;
    public $postal_code;
    public $fsan;
    public $active_service;

    function __construct($unit_id,$unit, $complex_name,$complex_street, $surburb, $country, $postal_code, $fsan, $active_service)
    {
        $this->unit_id = $unit_id;
        $this->unit = $unit;
        $this->complex_name = $complex_name;
        $this->complex_street = $complex_street;
        $this->surburb = $surburb;
        $this->country = $country;
        $this->postal_code = $postal_code;
        $this->fsan = $fsan;
        $this->active_service = $active_service;
    }
}
?>