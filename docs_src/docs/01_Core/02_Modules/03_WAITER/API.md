## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>add</strong></div>
    <div class="panel-body">
        Thêm callback
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td>function</td>
                    <td></td>
                    <td>Callback</td>
                </tr>
                <tr>
                    <td><code>once</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Chỉ chạy callback một lần</td>
                </tr>
                <tr>
                    <td><code>description</code></td>
                    <td>string</td>
                    <td>''</td>
                    <td>Ghi chú cho callback, nhằm mục đích kiểm tra về sau
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string</dt>
                <dd>waiter key</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var key = _.M.WAITER.add(function(name){
    console.log('Hi,', name);
});
=> "waiter_key_0"</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>has</strong></div>
    <div class="panel-body">
        Kiểm tra một waiter key có tồn tại không
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td><code>waiter_key</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Key cần kiểm tra</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>boolean</dt>
                <dd></dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>createFunc</strong></div>
    <div class="panel-body">
        <p>Tương tự như <code>.M.WAITER.add</code> nhưng đồng thời cũng tạo một function của window tương ứng với waiter
            key trả về.</p>
        <p>Thường dùng khi muốn tạo callback có thể được gọi từ DOM</p>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            <div class="alert alert-info">
                Xem <code>_.M.WAITER.add</code>
            </div>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <div class="alert alert-info">
                Xem <code>_.M.WAITER.add</code>
            </div>
        </li>
        <li class="list-group-item">
            <h4>Example</h4>
<pre><code class="javascript">var key = _.M.WAITER.createFunc(function(name){
console.log('Hi,', name);
});
var tag_a = ['<a href="javascript:', key,"('Manh')\">Yahoo</a>"].join('');
$('body').html(tag_a);
=> Khi click lên tag a sẽ chạy callback</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>remove</strong></div>
    <div class="panel-body">
        Xóa các waiter key
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td><code>key*</code></td>
                    <td>
                        <ul>
                            <li>string</li>
                            <li>string[]</li>
                        </ul>
                    </td>
                    <td></td>
                    <td>Số lượng không hạn chế các waiter key</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string[]</dt>
                <dd>Mảng các waiter key đã xóa</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.WAITER.remove('waiter_key_0');
=> ['waiter_key_0']
_.M.WAITER.remove('waiter_key_0', 'waiter_key_2');
=> ['waiter_key_0', 'waiter_key_2']
_.M.WAITER.remove('waiter_key_0', ['waiter_key_2', 'waiter_key_6']);
=> ['waiter_key_0', 'waiter_key_2'] (waiter_key_6 không tồn tại)</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>run</strong></div>
    <div class="panel-body">
        Gọi một waiter key
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td><code>waiter_key</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Waiter key cần chạy</td>
                </tr>
                <tr>
                    <td><code>args</code></td>
                    <td>[]</td>
                    <td></td>
                    <td>Mảng các argument của callback</td>
                </tr>
                <tr>
                    <td><code>thisArg</code></td>
                    <td>object</td>
                    <td>null</td>
                    <td>đối tượng <code>this</code> của callback</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>*</dt>
                <dd>Callback result</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var key = _.M.WAITER.add(function(name){
    console.log('Hi,', name);
});
//"waiter_key_0"
_.M.WAITER.run(key, 'Manh');
=> Hi, Manh</code></pre>
<pre><code class="javascript">var key2 = _.M.WAITER.add(function(name, old){
    console.log('Hi,', name, ' (', old, ' years old)');
});
//"waiter_key_1"
_.M.WAITER.run(key2, ['Manh', 10]);
=> Hi, Manh (10 years old)</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>list</strong></div>
    <div class="panel-body">
        Trả về danh sách các waiter
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td><code>description</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Kết quả trả về bao gồm cả description của waiter</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string[]</dt>
                <dd>Mảng các waiter key</dd>
                <dt>{}</dt>
                <dd>Object bao gồm waiter key và description tương ứng</dd>
            </dl>
        </li>
    </ul>
</div>