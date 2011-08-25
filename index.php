<?php
header('Access-Control-Allow-Origin: *');
include_once("phplibs/graphite/arc/ARC2.php");
include_once("phplibs/graphite/Graphite.php");

if (isset($_REQUEST['url'])){
    $url = $_REQUEST['url'];
    $graph = new Graphite();
    $graph->load( $url );
    header('Content-type: application/json');
    print $graph->serialize( "RDFJSON" );
} else {
    print "no url parameter, so I do not know where to fetch the rdf data from.";
}

