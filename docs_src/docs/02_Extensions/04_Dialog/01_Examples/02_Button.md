<script src="/test_files/button.js"></script>
Thêm các button vào dialog bằng cách sử dụng class `_.M.DialogButton`

# Button đầu tiên

```js
var dialog = new _.M.Dialog({content: 'Demo buttons'});
var button_1 = new _.M.DialogButton();

dialog.attachButton(button_1);
dialog.open();
```

<div class="well">
    <a href="javascript: testDialogButton(1)" class="btn btn-info">Test</a>
</div>

# Button với tính chất khác

```js
var button_2 = new _.M.DialogButton({name: 'btn2', type: _.M.BUTTON_SUCCESS, label: 'Button 2'});

dialog.attachButton(button_2);
```

<div class="well">
    <a href="javascript: testDialogButton(2)" class="btn btn-info">Test</a>
</div>

# Button với icon

```js
var button_3 = new _.M.DialogButton({name: 'btn3', label: 'Button 3', icon: 'glyphicon glyphicon-ok'});
dialog.attachButton(button_3);
```

<div class="well">
    <a href="javascript: testDialogButton(3)" class="btn btn-info">Test</a>
</div>

# Button với kích thước khác

```js
var button_4 = new _.M.DialogButton({name: 'btn4', label: 'Button 4', size: 10});
dialog.attachButton(button_4);
```

<div class="well">
    <a href="javascript: testDialogButton(4)" class="btn btn-info">Test</a>
</div>

# Handle click event của button

```js
var button_5 = new _.M.DialogButton({name: 'btn5', label: 'Click me'});

button_5.setHandler(function() {
  alert('Clicked');
});
```
<div class="well">
    <a href="javascript: testButtonCallback()" class="btn btn-info">Test</a>
</div>

# Đóng dialog

```js
var button = new _.M.DialogButton({label: 'Close'});

button.setHandler(function() {
  this.closeDialog();
});
```
<div class="well">
    <a href="javascript: testButtonCallbackCloseDialog()" class="btn btn-info">Test</a>
</div>


