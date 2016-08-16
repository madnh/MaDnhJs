title: _.M.callFunc
-----
Gọi callback với các tham số

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
        <td><code>callback</code></td>
        <td>
            <ul>
                <li>string: <code>_.M.WAITER</code> key, hoặc tên function</li>
                <li>function</li>
                <li>array: mảng các string/function</li>
            </ul>
        </td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>args</code></td>
        <td>*</td>
        <td>[]</td>
        <td>Mảng các đối số của <code>callback</code></td>
    </tr>
    <tr>
        <td><code>context</code></td>
        <td>object</td>
        <td>null</td>
        <td>Ngữ cảnh của context ("this" keyword)</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>*</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
_.M.callFunc(alert, 123);
//Call func, get result
function test(old) {
    return old + 1;
}
console.log(_.M.callFunc(test, 10));
//
_.M.callFunc(function(name, old){
    alert('My name is ' + name + ', ' + old + 'years old');
    }, ['Manh', 10]);

var obj = {name: 'Manh', old: 10};

_.M.callFunc(function(say_hi){
    alert((say_hi ? 'Hi' : 'Hello') + '! my name is ' + this.name + ', ' + this.old + ' years old');
}, true, obj);
```
