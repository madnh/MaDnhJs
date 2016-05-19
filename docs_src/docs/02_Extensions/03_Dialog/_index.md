<button onclick="what_is_dialog()" class="btn btn-success"><i class="fa fa-question"></i> Dialog là gì?</button> <--- click me!
<script>
    function what_is_dialog(){
        _.M.Dialog.alert('Dialog là cái này này');
    }
</script>

MaDnh Dialog bao gồm các thành phần:
- Dialog
- Dialog Buttons

Dialog và Dialog Buttons sử dụng template để làm giao diện hiển thị

Một vài ví dụ:

**Alert**

![Alert](/imgs/dialog_alert.png)

**Confirm**

![Alert](/imgs/dialog_confirm.png)

**Prompt**

![Prompt](/imgs/dialog_prompt.png)

**Form**

![Form](/imgs/dialog_form.png)

## Các tính năng của `_.M.Dialog`:
- Content động
- Hệ thống template
- Mở/ẩn/hiện/đóng
- Enable/Disabled, Pending/resolved
- Các button