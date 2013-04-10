<?php

if($_GET['file'] == 'data'){
  $file = 'testdata.json';
}
else{
  $file = 'shots.json';
}

if ($_GET['action'] == 'add') {
  $entry = $_GET;
  unset($entry['action']);
  $entry['time'] = time();

  file_put_contents($file, json_encode($entry). "\n", FILE_APPEND);

  print "Result saved!";

}

if ($_GET['action'] == 'readAll') {
  if($file == 'testdata.json'){
    print file_get_contents($file);
    return;
  }
  $lines = explode("\n",file_get_contents($file));
//$lines = array_reverse($lines);
  foreach ($lines as $value) {
    $json[] = json_decode($value);
  }
  print json_encode($json);
}
