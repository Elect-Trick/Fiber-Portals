<?php

class Outage
{
    public $outage_id;
    public $outage_reference;
    public $affected_areas;
    public $date;
    public $incident_type;
    public $severity;
    public $outage_status;
    public $last_updated;

    function __construct($outage_id,$outage_reference, $affected_areas, $date, $incident_type, $severity, $outage_status, $last_updated)
    {
        $this->outage_id = $outage_id;
        $this->outage_reference = $outage_reference;
        $this->affected_areas = $affected_areas;
        $this->date = $date;
        $this->incident_type = $incident_type;
        $this->severity = $severity;
        $this->outage_status = $outage_status;
        $this->last_updated = $last_updated;
    }
}
