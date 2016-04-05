title: _.M.inherit
-----

Kế thừa một constructor prototype cho một constructor khác.
Thêm vào prototype của destination constructor một thuộc tính tham chiếu ngược về source constructor prototype.

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
        <td><code>destination</code></td>
        <td>function</td>
        <td></td>
        <td>Constructor đích</td>
    </tr>
    <tr>
        <td><code>source</code></td>
        <td>function</td>
        <td></td>
        <td>Constructor nguồn</td>
    </tr>
    <tr>
        <td><code>addSuper</code></td>
        <td>boolean</td>
        <td>true</td>
        <td>Thêm một property vào constructor đích, tham chiếu về constructor nguồn</td>
    </tr>
    </tbody>
</table>

<div class="alert alert-info">
    <strong>Cách dùng property tham chiếu ngược về constructor nguồn</strong><br>
    &lt;destination_class_instance&gt;.constructor.prototype._super
</div>

### Ví dụ
SourceApp constructor
```js
function SourceClass(){
    this.foo = 'bar';
}

SourceClass.prototype.test = function(){
    console.log('SourceClass.foo: ', this.foo);
}
```

Kế thừa
```js
function DestClass(){
    SourceClass.call(this)
}
_.M.inherit(DestClass, SourceClass);

var obj = new DestClass();

obj.test(); //SourceClass.foo: bar
obj.foo = 'Ohoho';
obj.test(); //SourceClass.foo: Ohoho
```

Kế thừa, ghi đè, sử dụng tham chiếu
```js
function FooClass(){
    SourceClass.call(this)
}

_.M.inherit(FooClass, SourceClass);

FooClass.prototype.test = function(){
    console.log('FooClass.foo: ', this.foo);
}

var obj_foo = new FooClass();

obj_foo.test(); //FooClass.foo: bar
obj_foo.foo = 'Ohoho';
obj_foo.test(); //FooClass.foo: Ohoho
obj_foo.constructor.prototype._super.test.call(obj_foo); //SourceClass.foo: Ohoho
```

