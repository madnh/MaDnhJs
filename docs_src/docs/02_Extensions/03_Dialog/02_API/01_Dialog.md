<div class="alert alert-info">
    <strong>Chú ý!</strong> _.M.Dialog kế thừa class <code>_.M.EventEmitter</code>
</div>

# Constant
<table class="table table-striped">
    <thead>
    <tr>
        <th>Constant</th>
        <th>Value</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>DIALOG_PRE_OPTIONS_NAME</code></td>
        <td><code>_.M.Dialog</code></td>
        <td>Tên Pre Options của _.M.Dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_TEMPLATE_TYPE</code></td>
        <td>Dialog</td>
        <td>Tên loại template của _.M.Dialog, xem <code>_.M.Template</code></td>
    </tr>
    <tr>
        <td><code>DIALOG_STATUS_INITIAL</code></td>
        <td>initial</td>
        <td>Tình trạng của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_STATUS_OPENED</code></td>
        <td>opened</td>
        <td>Tình trạng của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_STATUS_HIDING</code></td>
        <td>hiding</td>
        <td>Tình trạng của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_STATUS_CLOSED</code></td>
        <td>removed</td>
        <td>Tình trạng của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_INFO</code></td>
        <td>info</td>
        <td>Tính chất của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_SUCCESS</code></td>
        <td>success</td>
        <td>Tính chất của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_PRIMARY</code></td>
        <td>primary</td>
        <td>Tính chất của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_WARNING</code></td>
        <td>warning</td>
        <td>Tính chất của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_DANGER</code></td>
        <td>info</td>
        <td>Tính chất của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_SIZE_SMALL</code></td>
        <td>small</td>
        <td>Kích thước của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_SIZE_NORMAL</code></td>
        <td>normal</td>
        <td>Kích thước của dialog</td>
    </tr>
    <tr>
        <td><code>DIALOG_SIZE_LARGE</code></td>
        <td>large</td>
        <td>Kích thước của dialog</td>
    </tr>
    </tbody>
</table>

# Properties
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
        <td>string</td>
        <td>dialog</td>
        <td>Chuỗi loại object</td>
    </tr>
    <tr>
        <td><code>options</code></td>
        <td>
            {}
        </td>
        <td></td>
        <td>Các tùy chọn của object</td>
    </tr>
    <tr>
        <td><code>closed_by</code></td>
        <td>string</td>
        <td>''</td>
        <td>Tên button đã close dialog</td>
    </tr>
    <tr>
        <td><code>data</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Data của dialog</td>
    </tr>
    <tr>
        <td><code>buttons</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Chứa các button của dialog</td>
    </tr>
    </tbody>
</table>

# Options
Các option của dialog
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
        <td><code>title</code></td>
        <td>string</td>
        <td>Dialog</td>
        <td>Tiêu đề dialog</td>
    </tr>
    <tr>
        <td><code>type</code></td>
        <td>string</td>
        <td>Constant <code>_.M.DIALOG_INFO</code></td>
        <td>Tính chất của dialog</td>
    </tr>
    <tr>
        <td><code>content</code></td>
        <td>
            <dl class="dl-horizontal">
                <dt>string</dt>
                <dd>Chuỗi template</dd>
                <dt>function</dt>
                <dd>
                    Callback trả về nội dung của template. Callback có các parameter:
                    <ol>
                        <li>callback update content, với đối số là content của dialog</li>
                        <li>dialog instance</li>
                    </ol>
                </dd>
            </dl>
        </td>
        <td>''</td>
        <td>Nội dung của dialog</td>
    </tr>
    <tr>
        <td><code>content_handler</code></td>
        <td>function</td>
        <td>null</td>
        <td>callback sẽ xử lý content trước khi gán vào dialog</td>
    </tr>
    <tr>
        <td><code>template_name</code></td>
        <td>string</td>
        <td>''</td>
        <td>Tên template của dialog. Nếu không định rõ sẽ dùng template mặc định</td>
    </tr>
    <tr>
        <td><code>template</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Các options dành cho template</td>
    </tr>
    <tr>
        <td><code>closable</code></td>
        <td>
            <dl class="dl-horizontal">
                <dt>boolean</dt>
                <dd>true - có thể đóng dialog, false - không thể</dd>
                <dt>function</dt>
                <dd>callback nhận vào một parameter là <code>dialog instance</code>, trả về kết quả dạng boolean để
                    quyết định có thể đóng dialog hay không
                </dd>
            </dl>
        </td>
        <td>callback kiểm tra tình trạng dialog có đang là enable hay không. Xem method <code>isEnable</code></td>
        <td>Kiểm tra dialog có thể đóng hay không</td>
    </tr>
    <tr>
        <td><code>clickable</code></td>
        <td>
            <dl class="dl-horizontal">
                <dt>boolean</dt>
                <dd>true - có thể click, false - không thể</dd>
                <dt>function</dt>
                <dd>callback nhận vào một parameter là <code>dialog instance</code>, trả về kết quả dạng boolean để
                    quyết định có thể click hay không
                </dd>
            </dl>
        </td>
        <td>callback kiểm tra tình trạng của dialog là enabled và không pending</td>
        <td>Kiểm tra các button dialog có thể được click hay không</td>
    </tr>
    </tbody>
</table>

# Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>getContent</strong></div>
    <div class="panel-body">
        Trả về nội dung của dialog, là giá trị của property <code>options.content</code> sau khi đã qua xử lý của <code>options.content_handler</code>
        <div class="alert alert-info">
            <strong>Chú ý</strong> Nếu <code>options.content</code> là function thì sẽ phát sinh event <code>load_content</code>
            trước khi bắt đầu load content
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            Không có parameter
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            string
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>updateContent</strong></div>
    <div class="panel-body">
        Cập nhật content của dialog. Giá trị sẽ được gán vào <code>options.content</code>
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Nếu dialog đang được mở thì ngoài việc cập nhật content mới sẽ phát sinh sự kiện
            <code>update_content</code>. Các template dựa vào event này để update content của dialog trên DOM
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
                    <td><code>new_content</code></td>
                    <td>string|function</td>
                    <td></td>
                    <td>Content mới của dialog</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setTemplate</strong></div>
    <div class="panel-body">
        Đặt template cho dialog
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Nếu dialog đã connect với một template nào đó rồi thì sẽ thực hiện disconnect trước
            khi kết nối với template mới.
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
                    <td><code>template_instance</code></td>
                    <td><code>_.M.Template</code> instance</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <p><strong>Dialog is opened</strong></p>
            <p>Chỉ có thể set template cho dialog khi dialog còn trong quá trình khởi tạo hoặc đã đóng</p>
            <p><strong>Invalid Template instance</strong></p>
            <p>Parameter truyền vào không phải là một <code>_.M.Template</code> instance</p>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getTemplate</strong></div>
    <div class="panel-body">
        Lấy template của dialog. Tên của template được lưu ở <code>options.template_name</code>. Nếu không có template
        nào được chỉ định sẽ dùng template mặc định
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            <code>_.M.Template</code> instance
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <p><strong>Dialog default template not found</strong></p>
            <p>Dialog không có template nào cả</p>
        </li>
    </ul>
</div>
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
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>status</strong></div>
    <div class="panel-body">
        Trả về tình trạng của dialog
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Khi cần kiểm tra tình trạng của dialog, nên dùng các constant như <code>_.M.DIALOG_STATUS_INITIAL</code>,
            <code>_.M.DIALOG_STATUS_OPENED</code>, <code>DIALOG_STATUS_REMOVED</code>
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            string
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isIniting</strong></div>
    <div class="panel-body">
        Kiểm tra dialog có phải đang trong quá trình khởi tạo, định nghĩa (chưa hiển thị lần nào)
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isClosed</strong></div>
    <div class="panel-body">
        Kiểm tra dialog đã đóng lại hay chưa
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isEnable</strong></div>
    <div class="panel-body">
        Kiểm tra dialog có đang trong trạng thái không khóa?
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isPending</strong></div>
    <div class="panel-body">
        Kiểm tra dialog có đang trong quá trình xử lý tác vụ nào đó không
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>disable</strong></div>
    <div class="panel-body">
        Đặt tình trạng của dialog là đang khóa, điều này có thể ngăn các click vào các button hoặc các tác vụ khác
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Nếu dialog có thể khóa thì sẽ phát sinh các event: <code>disabled</code>, <code>toggle_enable</code>
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>enable</strong></div>
    <div class="panel-body">
        Mở khóa nếu dialgo đang trong tình trạng khóa
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Nếu dialog có mở khóa thì sẽ phát sinh các event: <code>enabled</code>, <code>toggle_enable</code>
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>pending</strong></div>
    <div class="panel-body">
        Dialog đang trong quá trình xử lý
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Việc chuyển tình trạng của dialog về pending sẽ phát sinh các event:
            <code>pending</code>, <code>toggle_pending</code>
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>resolved</strong></div>
    <div class="panel-body">
        Quá trình xử lý đã hoàn tất
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Method này sẽ phát sinh các event: <code>resolved</code>,
            <code>toggle_pending</code>
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>attachButton</strong></div>
    <div class="panel-body">
        Thêm button vào dialog
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
                    <td><code>button</code></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string</dt>
                            <dd>chuỗi tên loại dialog: <code>_.M.BUTTON_OK</code>, <code>_.M.BUTTON_CANCEL</code>,
                                <code>_.M.BUTTON_YES</code>,...
                            </dd>
                            <dt><code>_.M.DialogButton</code> instance</dt>
                            <dd>Button instance</dd>
                            <dt>{}</dt>
                            <dd>Dialog sẽ tạo một instance của <code>_.M.DialogButton</code> và dùng parameter này như
                                là options của button đó
                            </dd>
                        </dl>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Button đã thêm/tạo
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <p><strong>Invalid button</strong></p>
            <p>Parameter không hợp lệ</p>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>hasButton</strong></div>
    <div class="panel-body">
        Kiểm tra dialog có một button nào đó hay không
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
                    <td>Tên button cần kiểm tra</td>
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
    <div class="panel-heading"><strong>getButton</strong></div>
    <div class="panel-body">
        Trả về một button của dialog
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
                    <td>Tên button cần lấy</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <code>_.M.DialogButton</code> instance cần lấy
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <p><strong>Get unattached button</strong></p>
            <p>Lấy về một button chưa được thêm vào dialog</p>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>removeButton</strong></div>
    <div class="panel-body">
        Gỡ một button ra khỏi dialog
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
                    <td>Tên button cần gỡ</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <p><strong>Remove unattached button</strong></p>
            <p>Dialog không có button cần gỡ</p>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isClickable</strong></div>
    <div class="panel-body">
        Kiểm tra các button của dialog có thể được click hay không bằng các dùng options <code>clickable</code>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isCloseable</strong></div>
    <div class="panel-body">
        Kiểm tra dialog có thể được đóng lại hay không bằng cách dùng option <code>closable</code>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>open</strong></div>
    <div class="panel-body">
        Mở dialog
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Khi dialog mở sẽ phát sinh event: <code>open</code>
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>hide</strong></div>
    <div class="panel-body">
        Ẩn dialog nếu đang mở
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Khi dialog mở sẽ phát sinh event: <code>hide</code>
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>show</strong></div>
    <div class="panel-body">
        Hiện dialog nếu đang ẩn
        <div class="alert alert-info">
            <strong>Chú ý!</strong> Khi dialog mở sẽ phát sinh event: <code>show</code>
        </div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>close</strong></div>
    <div class="panel-body">
        <p>Đóng dialog nếu đang mở (dù đang bị ẩn)
        <p>
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
                    <td><code>force</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Bỏ qua bước kiểm tra có thể đóng dialog hay không</td>
                </tr>
                <tr>
                    <td><code>by</code></td>
                    <td>string</td>
                    <td>''</td>
                    <td>Tên button đã đóng dialog</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
        <li class="list-group-item">
            <h4>Events</h4>
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Tên</th>
                    <th>Parameters</th>
                    <th>Mô tả</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><strong><i>close</i></strong></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>force</dt>
                            <dd>Force close?</dd>
                            <dt>by</dt>
                            <dd>Closed source name</dd>
                        </dl>
                    </td>
                    <td>Đóng dialog</td>
                </tr>
                <tr>
                    <td><strong><i>closed</i></strong></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>force</dt>
                            <dd>Force close?</dd>
                            <dt>by</dt>
                            <dd>Closed source name</dd>
                        </dl>
                    </td>
                    <td>Sau khi dialog đã đóng</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setClosedBy</strong></div>
    <div class="panel-body">
        Cập nhật tên button đã đóng dialog
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
                    <td><code>button</code></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string</dt>
                            <dd>Tên button</dd>
                            <dt><code>_.M.DialogButton</code> instance</dt>
                            <dd>Button instance</dd>
                        </dl>
                    </td>
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
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isClosedBy</strong></div>
    <div class="panel-body">
        Kiểm tra dialog có phải đã bị đóng bởi một button nào đó hay không
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
                    <td><code>button</code></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string</dt>
                            <dd>Tên button</dd>
                            <dt><code>_.M.DialogButton</code> instance</dt>
                            <dd>Button instance</dd>
                        </dl>
                    </td>
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
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getDOM</strong></div>
    <div class="panel-body">
        Get DOM của dialog
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            <ul>
                <li>jQuery DOM selected</li>
                <li>false</li>
            </ul>
        </li>
    </ul>
</div>