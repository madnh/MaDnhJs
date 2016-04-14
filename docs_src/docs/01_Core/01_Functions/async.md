title: _.M.async
-----

Gọi callback với các tham số, bất đồng bộ. Tương tự [`_.M.callFunc`](!Core/Functions/callFunc)

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
        <td><code>delay</code></td>
        <td>number</td>
        <td>1</td>
        <td>Delay milliseconds</td>
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
    <dt></dt>
    <dd></dd>
</dl>

### Ví dụ
Similar to [`_.M.callFunc`](!Core/Functions/callFunc)