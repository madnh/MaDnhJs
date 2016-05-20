<button onclick="what_is_dialog()" class="btn btn-success"><i class="fa fa-question"></i> Dialog là gì?</button> <--- click me!
<script>
    function what_is_dialog(){
        _.M.Dialog.alert('Dialog là cái này này');
    }
</script>

- Content động
- Hệ thống template
- Mở/ẩn/hiện/đóng
- Enable/Disabled, Pending/resolved
- Các button

Các thành phần:
- Dialog
- Diable Button

Dialog và Dialog Buttons sử dụng template để làm giao diện hiển thị

# Dialog
## Class `_.M.Dialog`
**Tạo dialog**
```js
var dialog = new _.M.Dialog();

dialog.option({
    content: 'Xin chào!'
});

dialog.open();
```
![Demo 1](/imgs/dialog_test_1.png)

**Nội dung động**
```js
function dynamic_content(cb, dialog) {
    setTimeout(function () {
        cb('Dynamic content');
    }, 3000);

    return 'Loading...';
}
(new _.M.Dialog({ content: dynamic_content })).open();
```
![Demo 2](/imgs/dialog_test_2.png) ![Demo 3](/imgs/dialog_test_3.png)

**Thay đổi nội dung**
```js
var dialog = new _.M.Dialog();

dialog.option({
    content: 'Updating...'
});

dialog.open();

setTimeout(function () {
    setInterval(function () {
        dialog.isVisibling() && dialog.updateContent((new Date()) + '');
    }, 1000);
}, 3000);
```
Sau 3s sẽ bắt đầu hiển thị thời gian hiện tại

## Làm việc với button
**Button đầu tiên**
```js
var dialog = new _.M.Dialog({content: 'Demo buttons'});

var button_1 = new _.M.DialogButton({name: 'btn1', label: 'Button 1'});
dialog.attachButton(button_1);
```

**Button với tính chất khác**
```js
var button_2 = new _.M.DialogButton({name: 'btn2', type: _.M.BUTTON_SUCCESS, label: 'Button 2'});
dialog.attachButton(button_2);
```

**Button với icon**
```js
var button_3 = new _.M.DialogButton({name: 'btn3', label: 'Button 3', icon: 'glyphicon glyphicon-ok'});
dialog.attachButton(button_3);
```

**Button với icon và kích thước lớn**
```js
var button_4 = new _.M.DialogButton({name: 'btn4', label: 'Button 4', icon: 'glyphicon glyphicon-ok', size: 4});
dialog.attachButton(button_4);
```

**Test**

![Demo 4](/imgs/dialog_test_4.png)

# Các tình trạng của dialog
**Enable/Disable**
```js
var dialog = new _.M.Dialog({content: 'Ohoho'}),
    time_interval;
dialog.on('toggle_enable', function (is_enabled) {
    this.updateContent('Dialog is ' + (is_enabled ? 'enabling' : 'disabled'));
});
dialog.on('close', function () {
    clearInterval(time_interval);
});

var button_1 = new _.M.DialogButton({name: 'btn1', label: 'Button 1'});
dialog.attachButton(button_1);
var button_2 = new _.M.DialogButton({name: 'btn2', type: _.M.BUTTON_SUCCESS, label: 'Button 2'});
dialog.attachButton(button_2);

dialog.open();
setTimeout(function () {
    time_interval = setInterval(function () {
        dialog.isEnable() ? dialog.disable() : dialog.enable();
    }, 1000);
}, 1000);
```

Ở ví dụ này chúng ta khai báo 1 dialog, cứ mỗi giây sẽ chuyển đổi tình trạng enable một lần, mỗi lần thay đổi sẽ cập nhật nội dung của dialog, đóng dialog sẽ dừng thay đổi.

Dialog cũng có 2 button, tình trạng của các button sẽ dựa theo tình trạng của dialog

Kết quả

![Demo 5](/imgs/dialog_test_5.png) ![Demo 6](/imgs/dialog_test_6.png)
