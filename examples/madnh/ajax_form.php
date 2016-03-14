<?php
sleep(2);
$name = '';
$password = '';
if (!empty($_POST)) {
    $_POST = array_merge(array(
        'name' => 'Client',
        'password' => '123456'
    ), $_POST);

    $name = $_POST['name'];
    $password = $_POST['password'];
}
?>
<div class="form-group">
    <label for="3">Tên</label>
    <input type="text" class="form-control" name="name" id="3" value="<?php echo $name; ?>"/>
</div>

<div class="form-group">
    <label for="1">Password</label>
    <input type="password" class="form-control" name="password" id="1" value="<?php echo $password; ?>"/>
</div>
