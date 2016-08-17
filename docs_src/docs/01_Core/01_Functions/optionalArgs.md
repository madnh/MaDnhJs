title: _.M.optionalArgs
-----

Lấy các arguments tùy chọn phù hợp, bỏ qua các argument không cần thiết. Thường dùng khi function có nhiều argument mặc định/tùy chọn

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
        <td><code>args</code></td>
        <td>Array</td>
        <td></td>
        <td>Mảng các option arguments</td>
    </tr>
    <tr>
        <td><code>order</code></td>
        <td>string[]</td>
        <td></td>
        <td>Thứ tự các arguments</td>
    </tr>
    <tr>
        <td><code>rules</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>
            <p>Các kiểu dữ liệu cho phép của từng argument.</p>
            <p>Object key là tên argument, value là kiểu dữ liệu cho phép hoặc là callback, vd:</p>
<pre><code class="javascript">{id: 'number', force_update: 'boolean', callback: ['string', 'function'], anyway: true, selector: function(arg){return _.isString(arg) || arg instanceof $;}}</code></pre>
            <div class="alert alert-info">Kiểu dữ liệu là <strong>true</strong> thì phù hợp với tất cả argument</div>
            <div class="alert alert-info">Nếu value là callback thì callback đó phải trả về true/false - parameter phù hợp/không phù hợp. Callback có một parameter là giá trị cần kiểm tra</div>
        </td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
Object chứa tên và value của các argument tìm thấy
<div class="alert alert-info">Nếu số lượng argument bằng hoặc lớn hơn số lượng khai báo ở parameter <code>order</code> thì trả về các argument có trong parameter order</div>
<div class="alert alert-info">Nếu có parameter không phù hợp với các mô tả thì trả về parameter <code>arguments</code> theo đúng thứ tự xuất hiện </div>

### Ví dụ
<pre><code class="javascript">var order = ['int', 'bool', 'str'],
    rules = {int: 'number', bool: 'boolean', str: 'string'};

_.M.optionalArgs([1, true, 'A'], order, rules); //{int: 1, bool: true, str: "A"}
_.M.optionalArgs([true, 'A'], order, rules);//{bool: true, str: "A"}
_.M.optionalArgs(['A'], order, rules); //{str: "A"}
_.M.optionalArgs(['A', 'V'], order, rules); //{int: "A", bool: "V"}
_.M.optionalArgs([1, []], order, rules); //{int: 1, bool: []}
_.M.optionalArgs([true, []], order, rules); //{int: true, bool: []}
_.M.optionalArgs(['A', []], order, rules); //{int: "A", bool: []}
_.M.optionalArgs([[], []], order, rules); //{int: Array[0], bool: []}

_.M.optionalArgs(['A', 'V'], ['int', 'bool', 'str', 'str2'], {int: 'number', bool: 'boolean', str: 'string', str2: 'string'});
//=> {str: "A", str2: "V"}
</code></pre>
