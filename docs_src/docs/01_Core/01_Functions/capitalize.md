title: _.M.capitalize
-----

Capitalize a string

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
        <td><code>str</code></td>
        <td>string</td>
        <td></td>
        <td></td>
    </tr>
<tr>
    <td><code>all</code></td>
    <td>boolean</td>
    <td>true</td>
    <td>
        <dl class="dl-horizontal">
            <dt>true</dt><dd>all of words</dd>
            <dt>false</dt><dd>Only first word</dd>
        </dl>
    </td>
</tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>string</dt><dd></dd>
</dl>

### Ví dụ
```js
var str = 'xin chao';

_.M.capitalize(str); //'Xin Chao'
_.M.capitalize(str, false); //'Xin chao'
```
