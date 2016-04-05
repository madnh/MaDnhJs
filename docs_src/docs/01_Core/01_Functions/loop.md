title: _.M.loop
-----

Lặp qua các phần tử của mảng hoặc object, giống như `_.each` nhưng có thể thoát ra khỏi vòng lặp - `break` như vòng lặp `for`, `for-in`, `while`.

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
        <td><code>obj</code></td>
        <td>Object/Array</td>
        <td></td>
        <td>Object/Array cần lặp</td>
    </tr>
    <tr>
        <td><code>callback</code></td>
        <td>callback</td>
        <td></td>
        <td>
        Arguments: <code>item value</code>, <code>item key/index</code>, <code>object/array</code><br> 
        Callback trả về giá trị phù hợp với argument <code>break_on</code> sẽ thoát khỏi vòng lặp
        </td>
    </tr>
    <tr>
        <td><code>break_on</code></td>
        <td>mixed</td>
        <td><code>"break"</code></td>
        <td>Giá trị mà loop callback sẽ trả về khi muốn thoát khỏi vòng lặp</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về

### Ví dụ
```js
_.M.loop([1,2,3,4,5], function(item){
    console.log('Number', item);
    if(item > 3){
        return 'break';
    }
});
//Console will log:
// Number 1
// Number 2
// Number 3
```

```js
_.M.loop([1,2,3,4,5], function(item){
    console.log('Number', item);
    if(item > 3){
        return 'yahoo';
    }
}, 'yahoo');
//Console will log:
// Number 1
// Number 2
// Number 3
```