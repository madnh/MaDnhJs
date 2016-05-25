title: _.M.Dialog.confirm
-----

<script src="/test_files/dialog.js"></script>

Giống như method <code>confirm</code> của Javascript

<table class="table table-striped">
    <thead>
    <tr>
        <th>Tên</th>
        <th>Kiểu dữ liệu</th>
        <th>Tham số tùy chọn và giá trị mặc định</th>
        <th>Mô tả</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>message</code></td>
        <td>string|function</td>
        <td></td>
        <td>Nội dung của dialog</td>
    </tr>
    <tr>
        <td><code>callback</code></td>
        <td>function</td>
        <td></td>
        <td>Callback nhận vào tên button đã click</td>
    </tr>
    <tr>
        <td><code>options</code></td>
        <td>string|{}</td>
        <td>Options mặc định</td>
        <td>Nếu là chuỗi sẽ dùng như title của dialog</td>
    </tr>
    </tbody>
</table>

### Default options

<p><strong>Pre Options key constant</strong>: <code>_.M.DIALOG_CONFIRM_PRE_OPTIONS_NAME</code></p>
<p><strong>Options:</strong></p>
<table class="table table-striped">
    <thead>
    <tr>
        <th>Tên</th>
        <th>Kiểu dữ liệu</th>
        <th>Tham số tùy chọn và giá trị mặc định</th>
        <th>Mô tả</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>title</code></td>
        <td>string</td>
        <td>'Confirm'</td>
        <td>Tiêu đề dialog</td>
    </tr>
    <tr>
        <td><code>default_button</code></td>
        <td>string</td>
        <td>null</td>
        <td>Tên button sẽ được gửi cho callback trong trường hợp dialog được đóng mà không do click các button</td>
    </tr>
    <tr>
        <td><code>buttons</code></td>
        <td>Mảng các <code>_.M.DialogButton</code> instance</td>
        <td>[]</td>
        <td>Mảng các button, nếu rỗng sẽ dùng 2 button <code>YES</code> và <code>NO</code></td>
    </tr>
    </tbody>
</table>

### Examples

```js
_.M.Dialog.confirm('Bạn có chắc muốn xóa các file này?', function(button_name) {
  alert('Bạn chọn: ' + button_name);
});
```

<div class="well">
    <a href="javascript: testDialogHelperConfirm()" class="btn btn-info">Test</a>
</div>
