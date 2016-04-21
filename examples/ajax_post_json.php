<?php
echo json_encode([
    'name' => !empty($_POST['name']) ? $_POST['name'] : 'client'
]);