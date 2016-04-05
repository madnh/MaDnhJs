title: _.M.setup
-----

Đặt giá trị cho object với tên và giá trị của field hoặc object chứa các field và giá trị.

### Tham số
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
        <td><code>object</code></td>
        <td>object</td>
        <td></td>
        <td>Object sẽ lưu các giá trị</td>
    </tr>
    <tr>
        <td><code>option</code></td>
        <td>
            <dl class="dl-horizontal">
                <dt>object</dt>
                <dd>Object chứa field và giá trị</dd>
                <dt>string</dt>
                <dd>Tên field</dd>
            </dl>
        </td>
        <td></td>
        <td>Tên field hoặc object chứa field và giá trị hoặc. Nếu là object thì parameter <code>value</code> sẽ được bỏ
            qua
        </td>
    </tr>
    <tr>
        <td><code>value</code></td>
        <td>*</td>
        <td>*</td>
        <td>Giá trị, chỉ được dùng khi parameter <code>option</code> là <code>string</code></td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>object</dt>
    <dd></dd>
</dl>

### Ví dụ
```js

var obj = {a: 'A', b: 'B'}
_.M.setup(obj, 'a', '123'); //obj -> {a: '123', b: 'B'}
_.M.setup(obj, {b: 'Yahoo', c: 'ASD'}); //obj -> {a: 123, b: 'Yahoo', c: 'ASD'}
```