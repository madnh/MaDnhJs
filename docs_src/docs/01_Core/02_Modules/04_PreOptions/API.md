## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>define</strong></div>
    <div class="panel-body">
        Định nghĩa một PreOptions
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
                    <td><code>name</code></td>
                    <td><code>string</code></td>
                    <td></td>
                    <td>Tên của PreOptions</td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td><code>{}</code></td>
                    <td></td>
                    <td>Các option</td>
                </tr>
                <tr>
                    <td><code>override</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Ghi đè PreOptions đã khai báo</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
            <ul>
                <li>true: define success</li>
                <li>false: define failed</li>
            </ul>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.PreOptions.define('test', {name: 'M'});</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>has</strong></div>
    <div class="panel-body">
        Kiểm tra một PreOptions đã được khai báo hay chưa
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
                    <td><code>name</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">alert(_.M.PreOptions.has('test'));</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>update</strong></div>
    <div class="panel-body">
        Cập nhật một PreOptions đã được định nghĩa từ trước
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
                    <td><code>name</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td></td>
                    <td>Các options cần cập nhật, sẽ merge với options hiện có</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.PreOptions.update('test', {old: 123});</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>get</strong></div>
    <div class="panel-body">
        Trả về PreOptions, hỗ trợ merge options mới
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
                    <td><code>name</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>custom</code></td>
                    <td>{}</td>
                    <td></td>
                    <td>Options mới, merge vào giá trị của PreOptions</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Object
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            "'Pre Options "[PreOptions name]" is undefined'" => PreOptions không tồn tại
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.PreOptions.get('test'); //{name: 'M', old: 123}
_.M.PreOptions.get('test', {old: 20, id: 55}); //{name: 'M', old: 20, id: 55}
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>extend</strong></div>
    <div class="panel-body">
        Khai báo một PreOptions bằng cách kế thừa các PreOptions khác.
        Giá trị của PreOptions dựa vào giá trị hiện tại của các PreOptions khác.
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
                    <td><code>sources</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Source PreOptions name</td>
                </tr>
                <tr>
                    <td><code>dest_name</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Destination PreOptions name</td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Các options mới</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <dl>
                <dt>Không tìm thấy source PreOptions</dt>
                <dd>"PreOptions are not defined:"</dd>
                <dt>PreOption đích đã tồn tại</dt>
                <dd>"Destination Pre Options is already exists"</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.PreOptions.define('test', {name: 'M'});
_.M.PreOptions.extend('test', 'test2', {from: 'VN'});
_.M.PreOptions.get('test2'); //{name: 'M', from: 'VN'}
_.M.PreOptions.update('test', {name: 'Manh'});
_.M.preOptions.get('test2'); //{name: 'Manh', from: 'VN'}
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>baseOn</strong></div>
    <div class="panel-body">
        Khai báo một PreOptions, giá trị dựa trên giá trị hiện tại lúc khai báo của các PreOptions khác
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
                    <td><code>sources</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Source PreOptions name</td>
                </tr>
                <tr>
                    <td><code>dest_name</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Destination PreOptions name</td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Các options mới</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <dl>
                <dt>Không tìm thấy source PreOptions</dt>
                <dd>"PreOptions are not defined:"</dd>
                <dt>PreOption đích đã tồn tại</dt>
                <dd>"Destination Pre Options is already exists"</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.PreOptions.define('test', {name: 'M'});
_.M.PreOptions.baseOn('test', 'test2', {from: 'VN'});
_.M.PreOptions.get('test2'); //{name: 'M', from: 'VN'}
_.M.PreOptions.update('test', {name: 'Manh'});
_.M.preOptions.get('test2'); //{name: 'M', from: 'VN'}
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>list</strong></div>
    <div class="panel-body">
        Danh sách các PreOptions
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
                    <td><code>detail</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Trả về chi tiết của PreOptions thay vì chỉ tên</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl>
                <dt>string[]</dt>
                <dd>Danh sách tên các PreOptions</dd>
                <dt>Object</dt>
                <dd>Tên các PreOptions và giá trị</dd>
            </dl>
        </li>
    </ul>
</div>