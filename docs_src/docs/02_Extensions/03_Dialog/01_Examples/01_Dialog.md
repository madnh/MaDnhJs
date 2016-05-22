<script src="/test_files/dialog.js"></script>
## Dialog đầu tiên
```js
var dialog = new _.M.Dialog();

dialog.option({
    title: 'Dialog title',
    content: '<p>Dialog content</p><p>with <strong>HTML</strong></p>'
});

dialog.open();
```
<div class="well">
    <a href="javascript: testDialog1()" class="btn btn-info">Test</a>
</div>

## Cập nhật nội dung

Sử dụng method `updateContent` để cập nhật nội dung của dialog

<div class="alert alert-info">
	<strong>Chú ý!</strong> Trong phần ví dụ này có sử dụng button, phần chi tiết về button này sẽ được đề cập sau
</div>

```js
var dialog = new _.M.Dialog({
        content: 'Click button to change dialog content'
    });
var button = new _.M.DialogButton({
    label: 'Click me',
    handler: function () {
        this.getDialog().updateContent((new Date()).toString());
    }
});


dialog.attachButton(button);
dialog.open();
```
<div class="well">
    <a href="javascript: testDialog2()" class="btn btn-info">Test</a>
</div>

## Ẩn/hiện dialog

Sử dụng các method `hide`, `show` để ẩn và hiện dialog

```js
var dialog = new _.M.Dialog({
        content: 'Click button to hide this dialog'
    });
var button = new _.M.DialogButton({
    label: 'Hide',
    handler: function () {
        this.getDialog().hide();
    }
});

dialog.attachButton(button);
dialog.open();
```

<div class="well">
    <a href="javascript: openHideableDialog()" class="btn btn-info">Open dialog</a>
    <a href="javascript: showHideableDialog()" class="btn btn-info">Show it!</a>
</div>

## Close dialog

Sử dụng method `close` để đóng dialog

```js
var dialog = new _.M.Dialog({
        content: 'Click button to close this dialog'
    });

dialog.attachButton(new _.M.DialogButton({
    name:'ok',
    label: 'OK',
    type: _.M.BUTTON_PRIMARY,
    handler: function () {
        this.getDialog().close(false, this.getCloseKey());
    }
}));

dialog.attachButton(new _.M.DialogButton({
    name:'close',
    label: 'Close',
    handler: function () {
        this.closeDialog();
    }
}));

dialog.on('close', function (force, by) {
    alert('Ready to close by button ' + by);
});
dialog.on('closed', function (force, by) {
    alert('Dialog closed by button ' + by);
});

dialog.open();
```

<div class="well">
    <a href="javascript: closeableDialog()" class="btn btn-info">Test</a>
</div>

## Enable/Disable

Ở ví dụ này chúng ta khai báo 1 dialog, cứ mỗi giây sẽ chuyển đổi tình trạng enable một lần, mỗi lần thay đổi sẽ cập nhật nội dung của dialog, đóng dialog sẽ dừng thay đổi.

Dialog cũng có 2 button, tình trạng của các button sẽ dựa theo tình trạng của dialog

```js
var dialog = new _.M.Dialog({content: 'Ohoho'}),
    time_interval;

dialog.attachButton(new _.M.DialogButton({label: 'Button'}));
dialog.on('toggle_enable', function (is_enabled) {
    this.updateContent('Dialog is ' + (is_enabled ? 'enabling' : 'disabled'));
});
dialog.on('close', function () {
    clearInterval(time_interval);
});

dialog.open();
setTimeout(function () {
    time_interval = setInterval(function () {
        dialog.isEnable() ? dialog.disable() : dialog.enable();
    }, 1000);
}, 1000);
```

<div class="well">
    <a href="javascript: testToggleEnableDialog()" class="btn btn-info">Test</a>
</div>

## Pending/Resolved

```js
var dialog = new _.M.Dialog({content: 'Ohoho'});
var pending_btn = new _.M.DialogButton({
    name: 'pending',
    label: 'Pending',
    handler: function () {
        this.getDialog().pending();
        this.hide();
        this.getOtherButton('resolved').show();
    }
});
var resolved_btn = new _.M.DialogButton({
    name: 'resolved',
    label: 'Resolved',
    disable_on_pending: false,
    handler: function () {
        this.getDialog().resolved();
        this.hide();
        this.getOtherButton('pending').show();
    }
});
var close_btn = new _.M.DialogButton({
    label: 'Close',
    handler: function () {
        this.closeDialog();
    }
});

dialog.attachButton(pending_btn);
dialog.attachButton(resolved_btn);
dialog.attachButton(close_btn);

dialog.on('toggle_pending', function (is_pending) {
    this.updateContent('Dialog is ' + (is_pending ? 'pending' : 'resolved'));
});

dialog.open();
```

<div class="well">
    <a href="javascript: testTogglePendingDialog()" class="btn btn-info">Test</a>
</div>

