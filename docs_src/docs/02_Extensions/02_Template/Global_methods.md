# Template dạng callback
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

# Template dạng class
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