<script src="/test_files/dialog.js"></script>
## Dynamic content

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

## _.M.Dialog.alert

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

## _.M.Dialog.confirm
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

## _.M.Dialog.iFrame

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

## _.M.Dialog.form

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


## _.M.Dialog.prompt

Giống như method <code>prompt</code> của Javascript. Sử dụng global method `_.M.Dialog.form`

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
        <td><code>callback</code></td>
        <td>function</td>
        <td></td>
        <td>Callback nhận parameter là value mà người dùng input. Trường hợp người dùng đóng dialog bằng button close thì sẽ nhận parameter là <code>false</code></td>
    </tr>
    <tr>
        <td><code>options</code></td>
        <td>string|{}</td>
        <td>Options mặc định</td>
        <td>Nếu là string sẽ dùng như title của dialog</td>
    </tr>
    </tbody>
</table>

### Default options

<p><strong>Pre Options key constant</strong>: <code>_.M.DIALOG_PROMPT_PRE_OPTIONS_NAME</code></p>
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
        <td>'Prompt'</td>
        <td>Tiêu đề dialog</td>
    </tr>
    <tr>
        <td><code>default_value</code></td>
        <td>string</td>
        <td>''</td>
        <td>Giá trị mặc định</td>
    </tr>
    <tr>
        <td><code>placeholder</code></td>
        <td>string</td>
        <td>''</td>
        <td>Placeholder input tag</td>
    </tr>
    <tr>
        <td><code>input_type</code></td>
        <td>string</td>
        <td>'text'</td>
        <td>attribute <code>type</code> của tag input</td>
    </tr>
    <tr>
        <td><code>input_classes</code></td>
        <td>string</td>
        <td>'form-control'</td>
        <td>Chuỗi tên các class của tag input</td>
    </tr>
    <tr>
        <td><code>buttons_extend_options</code></td>
        <td>{}</td>
        <td>
<pre><code class="javascript">{
    submit: {
        label: 'Ok'
    }
}</code></pre></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Examples

```js
_.M.Dialog.prompt('Tên của bạn là gì?', function (name) {
        if (false === name) {
            alert('Xin chào ai đó');
        } else {
            alert('Xin chào ' + name);
        }
    }, {
        default_value: 'Mạnh'
    });
```

<div class="well">
    <a href="javascript: testDialogHelperPrompt()" class="btn btn-info">Test</a>
</div>