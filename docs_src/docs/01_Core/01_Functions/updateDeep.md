title: _.M.updateDeep
-----

Cập nhật giá trị cho một đường dẫn của object

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
        <td><code>callback</code></td>
        <td>function</td>
        <td></td>
        <td>Callback thay đổi giá trị của deep</td>
    </tr>
    </tbody>
</table>

### Ví dụ
```js
var obj = {a: 1, b: 2, c :{}}
_.M.defineDeep(obj, 'c.d.e', 123);
console.log(obj.c.d.e);//123
_.M.updateDeep(obj, 'c.d.e', function(current_value) {
    current_value = _.M.asArray(current_value);
    current_value.push('yahoo');
    return current_value;
});
console.log(obj.c.d.e); //[123, "yahoo"]
```