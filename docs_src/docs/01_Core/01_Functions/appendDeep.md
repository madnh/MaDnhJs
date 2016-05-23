title: _.M.appendDeep
-----

Thêm giá trị cho một đường dẫn của object.

Nếu giá trị hiện tại là chuỗi hoặc số thì thực hiện nối chuỗi.

Nếu giá trị hiện tại là mảng thì thực hiện thêm giá trị vào mảng.

Các trường hợp còn lại chuyển giá trị hiện tại thành một phần tử của mảng và thêm giá trị mới vào mảng đó.

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
var obj = {a: 1, b: 2, c :{}, x: [456], y: true}
_.M.defineDeep(obj, 'c.d.e', 123);
console.log(obj.c.d.e);//123
_.M.appendDeep(obj, 'c.d.e', 'yahoo');
console.log(obj.c.d.e); //123yahoo
_.M.appendDeep(obj, 'x', 'ahihi');
console.log(obj.x); //[456, "ahihi"]
_.M.appendDeep(obj, 'y', 789);
console.log(obj.y); //[true, 789]
```