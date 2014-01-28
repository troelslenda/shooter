<?php

if ($_GET['action'] == 'add') {
  $entry = $_GET;
  unset($entry['action']);
  $entry['time'] = time();

  file_put_contents('shots.json', json_encode($entry). "\n", FILE_APPEND);

  print "Result saved!";

}
if ($_GET['action'] == 'add_shooter') {
  $entry = $_GET;
  unset($entry['action']);
  $entry['time'] = time();

  file_put_contents('shooters.json', json_encode($entry). "\n", FILE_APPEND);

  print "Skytte gemt!";
}

if ($_GET['action'] == 'readAll') {
$lines = explode("\n",file_get_contents('shots.json'));
$lines = array_reverse($lines);
foreach ($lines as $value) {
  $json[] = json_decode($value);
}
print json_encode($json);
}

if ($_GET['action'] == 'readAll_shooter') {
  $lines = explode("\n",file_get_contents('shooters.json'));
  $lines = array_reverse($lines);
  foreach ($lines as $value) {
    $json[] = json_decode($value);
  }
  print json_encode($json);
}
