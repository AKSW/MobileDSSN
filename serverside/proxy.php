<?php

ob_start();

$url = $_REQUEST['url'];

$curl_handle = curl_init($url);
curl_setopt($curl_handle, CURLOPT_HEADER, 0);
curl_setopt($curl_handle, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);

$content = curl_exec($curl_handle);
$content_type = curl_getinfo($curl_handle, CURLINFO_CONTENT_TYPE);
curl_close($curl_handle);

header("Content-Type: $content_type");

echo $content;

ob_flush();

?>