title: _.M.Dialog.form
-----
<script src="/test_files/dialog.js"></script>

Show form trong dialog

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
        <td><code>content</code></td>
        <td>string|function</td>
        <td></td>
        <td>Nội dung của dialog</td>
    </tr>
    <tr>
        <td><code>callback</code></td>
        <td>function</td>
        <td></td>
        <td>Callback khi submit form hoặc khi dialog bị đóng</td>
    </tr>
    <tr>
        <td><code>options</code></td>
        <td>{}</td>
        <td>Options mặc định</td>
        <td>Options của dialog</td>
    </tr>
    </tbody>
</table>

### Callback
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
        <td><code>button_name</code></td>
        <td>string</td>
        <td></td>
        <td>Tên button</td>
    </tr>
    <tr>
        <td><code>form</code></td>
        <td>jQuery selected DOM</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>button</code></td>
        <td><code>_.M.DialogButton</code> instance</td>
        <td></td>
        <td>Button</td>
    </tr>
    <tr>
        <td><code>dialog_instance</code></td>
        <td><code>_.M.Dialog</code></td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Default options

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
        <td>'Form'</td>
        <td>Tiêu đề dialog</td>
    </tr>
    <tr>
        <td><code>form_classes</code></td>
        <td>string</td>
        <td>''</td>
        <td>Chuỗi tên các class của tag <code>form</code></td>
    </tr>
    <tr>
        <td><code>message_classes</code></td>
        <td>string</td>
        <td>'dialog_form_message'</td>
        <td>Chuỗi tên class của div chứa thông điệp của dialog</td>
    </tr>
    <tr>
        <td><code>validator</code></td>
        <td>function</td>
        <td>null</td>
        <td>
            <p>Validator callback của form. Parameters:</p>
            <dl class="dl-horizontal">
                <dt>form</dt>
                <dd>jQuery selected DOM</dd>
                <dt>dialog_instance</dt>
                <dd>Dialog instance</dd>
            </dl>
        </td>
    </tr>
    <tr>
        <td><code>auto_focus</code></td>
        <td>boolean</td>
        <td>true</td>
        <td>Tự động focus vào input/textarea đầu tiên của form (input/textarea) đó phải visible</td>
    </tr>
    <tr>
        <td><code>submit_button_name</code></td>
        <td>string</td>
        <td>'submit'</td>
        <td>Tên button sẽ dùng để trigger khi form submit không phải do click button, vd như nhấn <code>enter</code> khi
            đang ở trong một input
        </td>
    </tr>
    <tr>
        <td><code>cancel_button_name</code></td>
        <td>sting</td>
        <td>'cancel'</td>
        <td>Tên butotn sẽ dùng để trigger khi dialog bị đóng không bởi do một button nào đó trong form</td>
    </tr>
    <tr>
        <td><code>buttons</code></td>
        <td>Mảng các <code>_.M.DialogButton</code> instance</td>
        <td>2 button <code>submit</code> và <code>cancel</code></td>
        <td>Các button cho form</td>
    </tr>
    <tr>
        <td><code>buttons_extend_options</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Object chứa các options cho các button: key là tên button, value là options của button đó</td>
    </tr>
    </tbody>
</table>

### Examples

```js
var template = '<form class="form-horizontal"><div class="form-group"><label for="inputEmail3" class="col-sm-2 control-label">Email</label><div class="col-sm-10"><input type="email" name="email" class="form-control" id="inputEmail3" placeholder="Email"></div></div><div class="form-group"><label for="inputPassword3" class="col-sm-2 control-label">Password</label><div class="col-sm-10"><input type="password" name="password" class="form-control" id="inputPassword3" placeholder="Password"></div></div><div class="form-group"><div class="col-sm-offset-2 col-sm-10"><select name="groups" id="groups" class="form-control" multiple><option value="a">A</option><option value="b">B</option><option value="c">C</option></select></div></div><div class="form-group"><div class="col-sm-offset-2 col-sm-10"><div class="checkbox"><label><input type="checkbox" name="remember_me"> Remember me</label></div></div></div></form>';

function callback(form) {
    console.log(_.M.jForm.getFormValue(form));
}

_.M.Dialog.form(template, callback, {
    title: 'Re-login',
    type: _.M.DIALOG_SUCCESS
});
```

<div class="well">
    <a href="javascript: testDialogHelperForm()" class="btn btn-info">Test</a>
</div>