<?php
header('Access-Control-Allow-Origin: *');
define('MORIARTY_ARC_DIR', 'phplibs/graphite/arc/');

include_once("phplibs/moriarty/simplegraph.class.php");

if (isset($_REQUEST['url'])){
    $url = $_REQUEST['url'];

	$g = new SimpleGraph();
	$g->read_data($url);
    
    header('Content-type: application/json');
    print $g->to_json();
} else {
    print "no url parameter, so I do not know where to fetch the rdf data from.";
}

