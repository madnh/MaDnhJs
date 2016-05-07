title: _.M.defineDeep
-----

Định nghĩa giá trị cho một đường dẫn của object

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
        <td>*</td>
        <td></td>
        <td>Object chứa</td>
    </tr>
    <tr>
        <td><code>deep</code></td>
        <td>string|string[]</td>
        <td></td>
        <td>Đường dẫn</td>
    </tr>
    <tr>
        <td><code>value</code></td>
        <td>*</td>
        <td></td>
        <td>Giá trị cần định nghĩa</td>
    </tr>
    <tr>
        <td><code>separator</code></td>
        <td>string</td>
        <td>dấu chấm <code>.</code></td>
        <td>Ký tự dùng để phân tách chuỗi nếu parameter <code>deep</code> là chuỗi</td>
    </tr>
    </tbody>
</table>

### Ví dụ
```js
var obj = {a: 1, b: 2, c :{}}
_.M.defineDeep(obj, 'c.d.e', 123);
alert(obj.c.d.e);//123
```