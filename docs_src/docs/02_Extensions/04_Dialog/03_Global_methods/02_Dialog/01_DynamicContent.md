title: _.M.Dialog.dynamicContent
-----
<script src="/test_files/dialog.js"></script>
Cập nhật content dialog động

<div class="alert alert-warning">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <strong>Chú ý!</strong> dialog sẽ được đặt vào quá trình <code>pending</code> trong quá trình load, chỉ <code>resolved</code>
    khi quá trình load kết thúc
</div>

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
        <td><code>options</code></td>
        <td>{}</td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Default options
<p><strong>Pre Options key constant</strong>: <code>_.M.DIALOG_DYNAMIC_CONTENT_PRE_OPTIONS_NAME</code></p>
<p><strong>Options:</strong> Dynamic content sử dụng class <code>_.M.AJAX</code> để thực hiện request. Các options này
    là option của <code>_.M.AJAX</code>, ngoại trừ các options sau</p>
<dl class="dl-horizontal">
    <dt>loading</dt>
    <dd>Loading content, dùng làm nội dung của dialog trong quá trình load</dd>
</dl>

### Events
<table class="table table-striped">
    <thead>
    <tr>
        <th>Tên</th>
        <th>Parameters</th>
        <th>Mô tả</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><strong><i>load_content</i></strong></td>
        <td></td>
        <td>Bắt đầu thực hiện load content</td>
    </tr>
    <tr>
        <td><strong><i>load_content_failed</i></strong></td>
        <td></td>
        <td>Load content thất bại</td>
    </tr>
    <tr>
        <td><strong><i>load_content_complete</i></strong></td>
        <td></td>
        <td>Load content kết thúc</td>
    </tr>
    </tbody>
</table>


### Examples
```js
var dialog = new _.M.Dialog();

dialog.option('content', _.M.Dialog.dynamicContent({
    url: '/examples/ajax.php',
    method: 'POST',
    data: {
        name: 'Manh',
        sleep: 2
    }
}));

dialog.open();
```

<div class="well">
    <a href="javascript: testDialogDynamicContent()" class="btn btn-info">Test</a>
</div>

