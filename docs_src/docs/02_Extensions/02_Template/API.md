# Class _.M.Template
`_.M.Template` kế thừa class `_.M.EventEmitter`

## Constructor
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
        <td><code>sections</code></td>
        <td>Object</td>
        <td>{}</td>
        <td>Object với tên và nội dung của các sections</td>
    </tr>
    <tr>
        <td><code>layout</code></td>
        <td>string|function</td>
        <td>''</td>
        <td>Layout. Xem method <code>setLayout</code></td>
    </tr>
    </tbody>
</table>

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
        <td><code>dataSource</code></td>
        <td>*</td>
        <td>null</td>
        <td>Đối tượng cần hiển thị</td>
    </tr>
    <tr>
        <td><code>options</code></td>
        <td>Object</td>
        <td>{}</td>
        <td>Các tùy chọn của template</td>
    </tr>
    </tbody>
</table>

## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>option</strong></div>
    <div class="panel-body">
        Cài đặt instance
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
                    <td><code>option</code></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string</dt>
                            <dd>Tên option</dd>
                            <dt>object</dt>
                            <dd>Object với tên và value của các option. Dùng khi cần đặt nhiều option cùng lúc</dd>
                        </dl>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>value</code></td>
                    <td>*</td>
                    <td>null</td>
                    <td>Giá trị của option. Chỉ dùng khi parameter <code>option</code> là <strong>string</strong></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var template = new _.M.Template();
template.option('type', 'success');
template.option({type: 'success', active: true});</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>connect</strong></div>
    <div class="panel-body">
        <p>Kết nối template vào object cần thể hiện</p>
        <div class="alert alert-info">
        	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        	<strong>Chú ý!</strong> Nếu template đã connect vào một đối tượng nào đó thì sẽ disconnect với đối tượng đó trước khi lập kết nối mới
        </div>
        <div class="alert alert-info">
        	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        	<strong>Chú ý!</strong> Method này sẽ phát sinh event có tên <code>connected</code>, event này không có data đi kèm
        </div>
        <div class="alert alert-warning">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> nếu đối tượng cần kết nối là instance của <code>_.M.EventEmitter</code> thì có sẽ phát sinh nhiều sự kiện khác
        </div>
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
                    <td><code>data_source</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Đối tượng cần thể hiện</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>disconnect</strong></div>
    <div class="panel-body">
        <p>Chấm dứt kết nối tới đối tượng đang thể hiện</p>
        <div class="alert alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> Method này phát sinh các sự kiện sau:
            <dl class="dl-horizontal">
                <dt><code>before_disconnect</code></dt>
                <dd>Trước khi thực sự chấm dứt kết nối</dd>
                <dt>disconnected</dt>
                <dd>Chấm dứt kết nối thành công</dd>
            </dl>
        </div>
        <div class="alert alert-warning">
        	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        	<strong>Chú ý!</strong> nếu đối tượng cần chấm dứt kết nối là instance của <code>_.M.EventEmitter</code> thì có sẽ phát sinh nhiều sự kiện khác
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            Không có parameter
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getDataSource</strong></div>
    <div class="panel-body">
        Trả về đối tượng đang thể hiện
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            Không có parameter
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>null</dt>
                <dd>Template chưa kết nối tới đối tượng nào</dd>
                <dt>*</dt>
                <dd>Đối tượng đã connect</dd>
            </dl>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>isConnected</strong></div>
    <div class="panel-body">
        Kiểm tra đã kết nối tới một đối tượng nào đó hay chưa
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            Không có parameter
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>setLayout</strong></div>
    <div class="panel-body">
        Đặt layout
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
                    <td><code>layout</code></td>
                    <td>string|function</td>
                    <td></td>
                    <td>
                        Nếu là function thì func đó sẽ có các parameters:
                        <dl class="dl-horizontal">
                            <dt>instance</dt>
                            <dd>Template instance</dd>
                            <dt>dataSource</dt>
                            <dd>Đối tượng cần thể hiện</dd>
                            <dt>data</dt>
                            <dd>Data của quá trình render. Xem method <code>render</code></dd>
                        </dl>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>getLayout</strong></div>
    <div class="panel-body">
        Trả về layout
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance layout
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setSection</strong></div>
    <div class="panel-body">
        Đặt section cho instance
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
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string</dt>
                            <dd>Tên section</dd>
                            <dt>object</dt>
                            <dd>Object chứa tên và nội dung của các section</dd>
                        </dl>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>content</code></td>
                    <td>string|function</td>
                    <td>Bỏ qua nếu parameter <strong>name</strong> là object</td>
                    <td>
                        <p>Nội dung của section</p>
                        <p>Nếu là function thì func đó sẽ có các parameters:</p>
                        <dl class="dl-horizontal">
                            <dt>instance</dt>
                            <dd>Template instance</dd>
                            <dt>dataSource</dt>
                            <dd>Đối tượng cần thể hiện</dd>
                            <dt>data</dt>
                            <dd>Data của quá trình render. Xem method <code>render</code></dd>
                        </dl>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>currentDraw</strong></div>
    <div class="panel-body">
        ID của lần draw hiện tại
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            number
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getDOMID</strong></div>
    <div class="panel-body">
        Trả về ID của template trong DOM
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            ID của template trong DOM
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>prepareData</strong></div>
    <div class="panel-body">
        <p>Chuẩn bị data cho quá trình render.</p>
        <p>Thường dùng để phân tích đối tượng cần thể hiện, lấy các thông tin cần thiết, VD như tính số phần trăm đã hoàn thành của biến <code>process_bar</code> ở các ví dụ trước</p>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            Không có parameter
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Object chứa các thông tin sẽ được ánh xạ vào template
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>render</strong></div>
    <div class="panel-body">
        <p>Xuất template dưới dạng chuỗi</p>
        <div class="alert alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Dữ liệu được gán vào template:</strong> Các dữ liệu được gán vào template bao gồm:
            <dl class="dl-horizontal">
                <dt>dom_id</dt>
                <dd>ID của DOM cần thể hiện của template. Template phải gán ID vào DOM khi xuất ra, nếu không sẽ không
                    thể update template khi cần thiết
                </dd>
                <dt>draw</dt>
                <dd>ID của lần draw hiện tại</dd>
                <dt>option</dt>
                <dd>Các options của instance</dd>
                <dt>data_source</dt>
                <dd>Đối tượng cần thể hiện</dd>
            </dl>
            Ngoài ra còn có các data được gán vào khi gọi method render
        </div>
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
                    <td><code>data</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Dữ liệu tùy chọn cho quá trình render</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Chuỗi HTML của template
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>rendered</strong></div>
    <div class="panel-body">
        Method sẽ được gọi sau khi template render được gán vào DOM thành công hoặc là vẽ lại DOM thành công
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            Không có parameter
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>reDraw</strong></div>
    <div class="panel-body">
        <p>Vẽ lại DOM</p>
        <div class="alert alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> Method này phát sinh các event:
            <dl class="dl-horizontal">
                <dt>re-draw</dt>
                <dd>Trước khi vẽ lại DOM</dd>
                <dt>draw</dt>
                <dd>Sau khi vẽ lại DOM</dd>
            </dl>
        </div>
        <div class="alert alert-warning">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> Method này sẽ gọi đến method <code>rendered</code> sau khi draw xong
        </div>
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
                    <td><code>data</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Dữ liệu tùy chọn cho quá trình render</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>true</dt>
                <dd>Vẽ lại DOM thành công</dd>
                <dt>false</dt>
                <dd>Vẽ lại DOM không thành công vì không tìm thấy DOM</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getDOM</strong></div>
    <div class="panel-body">
        Tìm và trả về DOM của template đã render, thêm vào trong page
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            Không có parameter
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            jQuery selected DOM
        </li>
    </ul>
</div>

# Global method
## Template dạng callback
<div class="panel panel-info">
    <div class="panel-heading"><strong>compiler</strong></div>
    <div class="panel-body">
        Thêm compiler
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
                    <td>Tên compiler</td>
                </tr>
                <tr>
                    <td><code>compiler</code></td>
                    <td>function</td>
                    <td></td>
                    <td>Callback</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.Template.compiler('test', function(data) {
    _.defaults(data, {name: 'Client'});
    return '&lt;strong&gt;Hi, ' + data.name + '&lt;/strong&gt;';
    });</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>hasCompiler</strong></div>
    <div class="panel-body">
        Kiểm tra một callback có tồn tại hay không?
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
                    <td>Compiler name</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>compilers</strong></div>
    <div class="panel-body">
        Trả về mảng tên các compiler
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            string[]
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>render</strong></div>
    <div class="panel-body">
        Render một compiler
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
                    <td>Compiler name</td>
                </tr>
                <tr>
                    <td><code>data</code></td>
                    <td>*</td>
                    <td>{}</td>
                    <td>Data cho compiler, có thể là bất cứ giá trị nào, thường là object chứa các giá trị</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <ul>
                <li>Nội dung trả về của compiler</li>
                <li>false - compiler không tồn tại</li>
            </ul>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">['Tí', 'Tèo'].forEach(function(name) {
    $('body').append(_.M.Template.render('test', {name: name}) + '&lt;br&gt;');
    });
    $('body').append(_.M.Template.render('test') + '&lt;br&gt;');</code></pre>
        </li>
    </ul>
</div>

## Template dạng class
<div class="panel panel-info">
    <div class="panel-heading"><strong>register</strong></div>
    <div class="panel-body">
        Đăng ký template cho một loại template
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
                    <td><code>type</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên loại template</td>
                </tr>
                <tr>
                    <td><code>name</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên template</td>
                </tr>
                <tr>
                    <td><code>constructor</code></td>
                    <td>function</td>
                    <td></td>
                    <td>Template constructor</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>types</strong></div>
    <div class="panel-body">
        Danh sách các loại template
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
                    <td>Trả về bao gồm cả danh sách các template của các loại template</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string[]</dt>
                <dd>Mảng tên các loại template</dd>
                <dt>object</dt>
                <dd>Tên các loại template và mảng các template của loại đó</dd>
            </dl>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>hasType</strong></div>
    <div class="panel-body">
        Kiểm tra một loại template có tồn tại hay không
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
                    <td><code>type</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên loại template cần kiểm tra</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>templates</strong></div>
    <div class="panel-body">
        Trả về các template của một loại template
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
                    <td><code>type</code></td>
                    <td>string</td>
                    <td></td>
                    <td>tên loại template</td>
                </tr>
                <tr>
                    <td><code>name_only</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Chỉ trả về tên các template</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string[]</dt>
                <dd>Mảng tên các template</dd>
                <dt>object</dt>
                <dd>Tên và constructor của các template</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>hasTemplate</strong></div>
    <div class="panel-body">
        Kiểm tra một template của một loại template có tồn tại hay không
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
                    <td><code>type</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên loại template</td>
                </tr>
                <tr>
                    <td><code>name</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên template cần kiểm tra</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>defaultTemplate</strong></div>
    <div class="panel-body">
        Đặt / lấy tên template mặc định của một loại template.
        <p>Template mặc định </p>
        <div class="panel panel-info">
            <div class="panel-heading"><strong>hasTemplate</strong></div>
            <div class="panel-body">
                Kiểm tra một template của một loại template có tồn tại hay không
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
                            <td><code>type</code></td>
                            <td>string</td>
                            <td></td>
                            <td>Tên loại template</td>
                        </tr>
                        <tr>
                            <td><code>name</code></td>
                            <td>string</td>
                            <td></td>
                            <td>Tên template cần kiểm tra</td>
                        </tr>
                        </tbody>
                    </table>
                </li>
                <li class="list-group-item">
                    <h4>Returns</h4>
                    boolean
                </li>
            </ul>
        </div>
        <div class="panel panel-info">
            <div class="panel-heading"><strong>defaultTemplate</strong></div>
            <div class="panel-body">
                <p>Đặt / lấy tên template mặc định của một loại template</p>
                <div class="alert alert-info">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <strong>Chú ý!</strong> Nếu chưa đặt template nào là mặc định thì template mặc định là template đầu
                    tiên được thêm vào
                </div>
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
                            <td><code>type</code></td>
                            <td>string</td>
                            <td></td>
                            <td>tên loại template</td>
                        </tr>
                        <tr>
                            <td><code>default_template</code></td>
                            <td>string</td>
                            <td>Nếu parameter này không được gán, method sẽ trả về tên của template mặc định</td>
                            <td>Tên loại template cần đặt</td>
                        </tr>
                        </tbody>
                    </table>
                </li>
                <li class="list-group-item">
                    <h4>Returns</h4>
                    <dl class="dl-horizontal">
                        <dt>string</dt>
                        <dd>Tên của template mặc định</dd>
                        <dt>true</dt>
                        <dd>Đặt template mặc định thành công</dd>
                        <dt>false</dt>
                        <dd>Loại template không tồn tại</dd>
                    </dl>
                </li>
                <li class="list-group-item">
                    <h4>Throws</h4>
                    <strong>Set default template with invalid template name</strong>
                    <p>Đặt template mặc định nhưng template đó chưa khai báo</p>
                </li>
            </ul>
        </div>
        <div class="panel panel-info">
            <div class="panel-heading"><strong>templateInstance</strong></div>
            <div class="panel-body">
                Trả về instance của template
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
                            <td><code>type</code></td>
                            <td>string</td>
                            <td></td>
                            <td>Tên loại template</td>
                        </tr>
                        <tr>
                            <td><code>name</code></td>
                            <td>string</td>
                            <td>Nếu bỏ qua sẽ dùng template mặc định</td>
                            <td>Tên template</td>
                        </tr>
                        </tbody>
                    </table>
                </li>
                <li class="list-group-item">
                    <h4>Returns</h4>
                    Trả về instance của template
                </li>
                <li class="list-group-item">
                    <h4>Throws</h4>
                    <strong>Template with name isn't exists or invalid type</strong>
                    <p>Loại template hoặc template cần tạo không tồn tại</p>
                </li>
            </ul>
        </div>
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
                    <td><code>type</code></td>
                    <td>string</td>
                    <td></td>
                    <td>tên loại template</td>
                </tr>
                <tr>
                    <td><code>default_template</code></td>
                    <td>string</td>
                    <td>Nếu parameter này không được gán, method sẽ trả về tên của template mặc định</td>
                    <td>Tên loại template cần đặt</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string</dt>
                <dd>Tên của template mặc định</dd>
                <dt>true</dt>
                <dd>Đặt template mặc định thành công</dd>
                <dt>false</dt>
                <dd>Loại template không tồn tại</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <strong>Set default template with invalid template name</strong>
            <p>Đặt template mặc định nhưng template đó chưa khai báo</p>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>templateInstance</strong></div>
    <div class="panel-body">
        Trả về instance của tempate
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
                    <td><code>type</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên loại template</td>
                </tr>
                <tr>
                    <td><code>name</code></td>
                    <td>string</td>
                    <td>Nếu bỏ qua sẽ dùng template mặc định</td>
                    <td>Tên template</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Trả về instance của template
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <strong>Template with name isn't exists or invalid type</strong>
            <p>Loại template hoặc template cần tạo không tồn tại</p>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isTemplateInstance</strong></div>
    <div class="panel-body">
        Kiểm tra một object có là instance của một <code>_.M.Template</code> hoặc các class kế thừa nó không
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
                    <td><code>template</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Template cần kiểm tra</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>