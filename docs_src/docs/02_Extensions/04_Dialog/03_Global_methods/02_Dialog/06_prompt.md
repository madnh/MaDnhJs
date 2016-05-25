title: _.M.Dialog.prompt
-----
<script src="/test_files/dialog.js"></script>

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