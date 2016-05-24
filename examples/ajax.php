<?php
if (!empty($_POST['sleep'])) {
    sleep((int)$_POST['sleep']);
}

$name = 'Client';
if (!empty($_POST['name'])) {
    $name = $_POST['name'];
}

echo 'Hello, ' . $name;
?>