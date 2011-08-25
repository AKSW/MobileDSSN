<?php

include_once("phplibs/graphite/arc/ARC2.php");
include_once("phplibs/graphite/Graphite.php");

$url = $_REQUEST['url'];

$graph = new Graphite();
$graph->load( $url );
print $graph->serialize( "RDFJSON" );

?>
