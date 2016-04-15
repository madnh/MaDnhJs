<?php
sleep(5);
$name = 'Client';
if (!empty($_POST['name'])) {
    $name = $_POST['name'];
}

echo 'Hello, ' . $name;
?>