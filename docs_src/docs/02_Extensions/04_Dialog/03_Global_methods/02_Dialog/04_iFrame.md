title: _.M.Dialog.iFrame
-----

<script src="/test_files/dialog.js"></script>

Hiện thị một iFrame trong dialog

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
        <td><code>url</code></td>
        <td>string</td>
        <td></td>
        <td>URL của iframe</td>
    </tr>
    <tr>
        <td><code>options</code></td>
        <td>string|{}</td>
        <td>Options mặc định</td>
        <td>Nếu là chuỗi sẽ dùng như title của dialog</td>
    </tr>
    </tbody>
</table>

### Default Options

<p><strong>Pre Options key constant</strong>: <code>_.M.DIALOG_IFRAME_PRE_OPTIONS_NAME</code></p>
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
        <td>'iFrame'</td>
        <td>Tiêu đề dialog</td>
    </tr>
    <tr>
        <td><code>attributes</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Object chứa thông tin các attribute của tag <code>iframe</code></td>
    </tr>
    </tbody>
</table>

### Examples

Trong các ví dụ sau chúng ta sẽ tạo một dialog iFrame từ link Youtube sau: [https://www.youtube.com/watch?v=oofSnsGkops](https://www.youtube.com/watch?v=oofSnsGkops)

Mã HTML mà Youtube cho chúng ta để có thể nhúng vào trang web khác

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/oofSnsGkops" frameborder="0" allowfullscreen></iframe>
```

<strong>Các ví dụ:</strong>

```js
_.M.Dialog.iFrame('https://www.youtube.com/embed/oofSnsGkops');
```

<div class="well">
    <a href="javascript: testDialogIFrame()" class="btn btn-info">Test</a>
</div>

Thêm vào các attribute cho iFrame
```js
//Allow fullscreen
_.M.Dialog.iFrame('https://www.youtube.com/embed/oofSnsGkops?autoplay=1', {
    attributes: {
        allowfullscreen: true
    }
});
```
<div class="well">
    <a href="javascript: testDialogIFrameWithAttributes()" class="btn btn-info">Test</a>
</div>
