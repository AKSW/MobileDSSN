<?php

//include_once("phplibs/graphite/arc/ARC2.php");
//include_once("phplibs/graphite/Graphite.php");
define('MORIARTY_ARC_DIR', 'phplibs/graphite/arc/');

include_once("phplibs/moriarty/simplegraph.class.php");

$url = $_REQUEST['url'];

$g = new SimpleGraph();
$g->read_data($url);
print $g->to_json();

//$graph = new Graphite();
//$graph->load( $url );
//print $graph->serialize( "RDFJSON" );

?>
