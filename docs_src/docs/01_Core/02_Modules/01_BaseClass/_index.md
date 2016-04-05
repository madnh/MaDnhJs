Class nền tảng cho đa số các class của <code>_.M</code>

## Properties
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
        <td><code>type_prefix</code></td>
        <td>
            <ul>
                <li>string</li>
                <li>number</li>
            </ul>
        </td>
        <td>constructor name</td>
        <td>Tiền tố của instance ID</td>
    </tr>
    <tr>
        <td><code>id</code></td>
        <td>string</td>
        <td>&lt;constructor_name&gt;_&lt;id&gt;</td>
        <td>ID của instance, sử dụng <code>type_prefix</code> làm tiền tố</td>
    </tr>
    </tbody>
</table>

## Methods
<div class="alert alert-info">
	<strong>Chú ý</strong> <code>_.M.BaseClass</code> không có method
</div>



## Examples
Do BaseClass không có method nên khi cần extend chỉ cần call BaseClass ở constructor của class extend.

Kế thừa class
```js
function MyClass(){
_.M.BaseClass.call(this);
}

var obj = new MyClass();

console.log(obj);
//obj.type_prefix => 'MyClass'
//obj.id => 'MyClass_1'
```

Kế thừa, đổi type_prefix
```js
function MyClass2(){
this.type_prefix = 'yahoo';
_.M.BaseClass.call(this);
}

var obj2 = new MyClass2();

console.log(obj2);
//obj2.type_prefix => 'yahoo'
//obj2.id => 'yahoo_1'