title: _.M.Dialog.alert
-----

<script src="/test_files/dialog.js"></script>

Tạo một dialog với nội dung và một button để đóng dialog đó

### Parameters

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
        <td><code>options</code></td>
        <td>{}</td>
        <td>Options mặc định</td>
        <td>Options của dialog</td>
    </tr>
    </tbody>
</table>

### Default options

<p><strong>Pre Options key constant</strong>: <code>_.M.DIALOG_ALERT_PRE_OPTIONS_NAME</code></p>
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
        <td>'Alert'</td>
        <td>Tiêu đề dialog</td>
    </tr>
    <tr>
        <td><code>button</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Options cho button close</td>
    </tr>
    </tbody>
</table>

### Examples
Default
```js
_.M.Dialog.alert('Xin chào');
```

<div class="well">
    <a href="javascript: testDialogHelperAlert()" class="btn btn-info">Test</a>
</div>

Alert with custom title
```js
_.M.Dialog.alert('Xin chào :)', 'Ahihi');
```

<div class="well">
    <a href="javascript: testDialogHelperAlertCustomTitle()" class="btn btn-info">Test</a>
</div>