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

```js
var dialog = new _.M.Dialog();

dialog.option({
    content: 'Xin chào!'
});

dialog.open();
```
![Demo 1](/imgs/dialog_test_1.png)

# Một số ví dụ
![Alert](/imgs/dialog_alert.png)

![Alert](/imgs/dialog_confirm.png)

![Prompt](/imgs/dialog_prompt.png)

![Form](/imgs/dialog_form.png)