Mỗi dialog có thể bao gồm các button, class `_.M.DialogButton` chính là những button đó.

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
        <td><code>DIALOG_BUTTON_PRE_OPTIONS_NAME</code></td>
        <td><code>_.M.DialogButton</code></td>
        <td>Tên Pre Options của <code>_.M.DialogButton</code></td>
    </tr>
    <tr>
        <td><code>DIALOG_BUTTON_TEMPLATE_TYPE</code></td>
        <td><code>DialogButton</code></td>
        <td>Tên loại template của <code>_.M.DialogButton</code>. Xem <code>_.M.Template</code></td>
    </tr>
    <tr>
        <td><code>BUTTON_INFO</code></td>
        <td>info</td>
        <td>Tính chất button</td>
    </tr>
    <tr>
        <td><code>BUTTON_PRIMARY</code></td>
        <td>primary</td>
        <td>Tính chất button</td>
    </tr>
    <tr>
        <td><code>BUTTON_SUCCESS</code></td>
        <td>success</td>
        <td>Tính chất button</td>
    </tr>
    <tr>
        <td><code>BUTTON_WARNING</code></td>
        <td>warning</td>
        <td>Tính chất button</td>
    </tr>
    <tr>
        <td><code>BUTTON_DANGER</code></td>
        <td>danger</td>
        <td>Tính chất button</td>
    </tr>
    <tr>
        <td><code>BUTTON_OK</code></td>
        <td>ok</td>
        <td>Tên loại button</td>
    </tr>
    <tr>
        <td><code>BUTTON_CANCEL</code></td>
        <td>cancel</td>
        <td>Tên loại button</td>
    </tr>
    <tr>
        <td><code>BUTTON_YES</code></td>
        <td>yes</td>
        <td>Tên loại button</td>
    </tr>
    <tr>
        <td><code>BUTTON_NO</code></td>
        <td>no</td>
        <td>Tên loại button</td>
    </tr>
    <tr>
        <td><code>BUTTON_RETRY</code></td>
        <td>retry</td>
        <td>Tên loại button</td>
    </tr>
    <tr>
        <td><code>BUTTON_CLOSE</code></td>
        <td>close</td>
        <td>Tên loại button</td>
    </tr>
    <tr>
        <td><code>BUTTON_SUBMIT</code></td>
        <td>submit</td>
        <td>Tên loại button</td>
    </tr>
    <tr>
        <td><code>DIALOG_BUTTON_OK_ONLY</code></td>
        <td>['ok']</td>
        <td>Các button dùng cho method <code>_.M.DialogButton.factory</code></td>
    </tr>
    <tr>
        <td><code>DIALOG_BUTTON_OK_CANCEL</code></td>
        <td>['ok, 'cancel']</td>
        <td>Các button dùng cho method <code>_.M.DialogButton.factory</code></td>
    </tr>
    <tr>
        <td><code>DIALOG_BUTTON_YES_NO</code></td>
        <td>['yes', 'no']</td>
        <td>Các button dùng cho method <code>_.M.DialogButton.factory</code></td>
    </tr>
    <tr>
        <td><code>DIALOG_BUTTON_YES_NO_CANCEL</code></td>
        <td>['yes', 'no', 'cancel']</td>
        <td>Các button dùng cho method <code>_.M.DialogButton.factory</code></td>
    </tr>
    <tr>
        <td><code>DIALOG_BUTTON_RETRY_CANCEL</code></td>
        <td>['retry', 'cancel']</td>
        <td>Các button dùng cho method <code>_.M.DialogButton.factory</code></td>
    </tr>
    <tr>
        <td><code>DIALOG_BUTTON_SUBMIT_CANCEL</code></td>
        <td>['submit', 'cancel']</td>
        <td>Các button dùng cho method <code>_.M.DialogButton.factory</code></td>
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
        <td>dialog_button</td>
        <td></td>
    </tr>
    <tr>
        <td><code>options</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Options</td>
    </tr>
    </tbody>
</table>

# Options
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
        <td><code>label</code></td>
        <td>string</td>
        <td>Untitled</td>
        <td>Nhãn button</td>
    </tr>
    <tr>
        <td><code>icon</code></td>
        <td>string</td>
        <td>''</td>
        <td>class icon của button. VD: <code>fa fa-check</code></td>
    </tr>
    <tr>
        <td><code>type</code></td>
        <td>string</td>
        <td><code>_.M.BUTTON_INFO</code></td>
        <td>Tính chất của button</td>
    </tr>
    <tr>
        <td><code>size</code></td>
        <td>number</td>
        <td>1</td>
        <td>Kích thước của button: <code><strong>1 <= number <= 5</strong></code>, dùng để xác định các khoảng trắng thêm vào trước và sau label của button</td>
    </tr>
    <tr>
        <td><code>handler</code></td>
        <td>function</td>
        <td>null</td>
        <td>Callback khi button được click</td>
    </tr>
    <tr>
        <td><code>clickable</code></td>
        <td>
            <ul>
                <li>boolean</li>
                <li>function: callback với <code>this</code> variable là button, có 1 parameter là: button instance</li>
            </ul>
        </td>
        <td>Mặc định là callback kiểm tra dialog có thể click? button có đang được hiện ra và enable?</td>
        <td>Kiểm tra button có thể được click hay không</td>
    </tr>
    <tr>
        <td><code>template_name</code></td>
        <td>string</td>
        <td>Template mặc định</td>
        <td>Tên template</td>
    </tr>
    <tr>
        <td><code>template</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Options cho template</td>
    </tr>
    </tbody>
</table>

# Constructor
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
        <td><code>options</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Options của button. Có thể assign các event của button vào thuộc tính có tên <code>events</code></td>
    </tr>
    </tbody>
</table>

# Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>setTemplate</strong></div>
    <div class="panel-body">
        Đặt template cho button
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
            <p><strong>Dialog button default template not found</strong></p>
            <p>Loại template Dialog Button không có template nào cả</p>
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
    <div class="panel-heading"><strong>setHandler</strong></div>
    <div class="panel-body">
        Đặt click handler cho button
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
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getDialog</strong></div>
    <div class="panel-body">
        Trả về dialog instance
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>false</dt>
                <dd>Chưa connect vào dialog nào</dd>
                <dt><code>_.M.Dialog</code> instance</dt>
                <dd>Dialog instance</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isClickable</strong></div>
    <div class="panel-body">
        Kiểm tra button có thể được click hay không
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isVisible</strong></div>
    <div class="panel-body">
        Kiểm tra button có đang visible
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
        Kiểm tra tình trạng của button có đang là enable
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>click</strong></div>
    <div class="panel-body">
        <p>Click vào button nếu button có thể click (xem method <code>isClickable</code>). Chạy function <code>options.handler</code>
        </p>
        <div class="alert alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> Method này phát sinh 2 event:
            <dl class="dl-horizontal">
                <dt>click</dt>
                <dd>Phát sinh trước khi chạy handler của button</dd>
                <dt>clicked</dt>
                <dd>Phát sinh sau khi chạy handler của button</dd>
            </dl>
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
    <div class="panel-heading"><strong>toggle</strong></div>
    <div class="panel-body">
        Chuyển đổi tình trạng hiện/ẩn của button
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
                    <td><code>show</code></td>
                    <td>boolean</td>
                    <td>undefined</td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>true</dt>
                            <dd>hiện</dd>
                            <dt>false</dt>
                            <dd>ẩn</dd>
                            <dt>undefined</dt>
                            <dd>Ngược lại tình trạng hiện tại</dd>
                        </dl>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Events</h4>
            <dl class="dl-horizontal">
                <dt>show</dt>
                <dd>Nếu button sẽ show</dd>
                <dt>hide</dt>
                <dd>Nếu button sẽ hide</dd>
                <dt>toggle</dt>
                <dd>Button thay đổi tình trạng, 1 parameter: is show</dd>
            </dl>
            <div class="alert alert-info">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                <strong>Chú ý!</strong> Event <code>toggle</code> sẽ phát sinh sau các event <code>show</code> và <code>hide</code>
            </div>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>show</strong></div>
    <div class="panel-body">
        Hiển thị button. Thật ra là lối tắt của method <code>toggle</code> với parameter <code>show</code> là <strong>true</strong>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>hide</strong></div>
    <div class="panel-body">
        Ẩn button. Thật ra là lối tắt của method <code>toggle</code> với parameter <code>show</code> là
        <strong>false</strong>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>toggleEnable</strong></div>
    <div class="panel-body">
        Chuyển đổi tình trạng enable/disable của button
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
                    <td><code>is_enable</code></td>
                    <td>boolean</td>
                    <td>undefined</td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>true</dt>
                            <dd>Enable</dd>
                            <dt>false</dt>
                            <dd>Disable</dd>
                            <dt>undefined</dt>
                            <dd>Ngược lại tình trạng hiện tại</dd>
                        </dl>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Events</h4>
            <dl class="dl-horizontal">
                <dt>enabled</dt>
                <dd>Nếu button sẽ enable</dd>
                <dt>hide</dt>
                <dd>Nếu button sẽ disable</dd>
                <dt>toggle_enable</dt>
                <dd>Button thay đổi tình trạng, 1 parameter: is enabled</dd>
            </dl>
            <div class="alert alert-info">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                <strong>Chú ý!</strong> Event <code>toggle_enable</code> sẽ phát sinh sau các event <code>enabled</code>
                và <code>disabled</code>
            </div>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>enable</strong></div>
    <div class="panel-body">
        Enable button. Thật ra là lối tắt của method <code>toggleEnable</code> với parameter <code>is_enable</code> là
        <strong>true</strong>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>enable</strong></div>
    <div class="panel-body">
        Disable button. Thật ra là lối tắt của method <code>toggleEnable</code> với parameter <code>is_enable</code> là
        <strong>false</strong>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>render</strong></div>
    <div class="panel-body">
        Trả về template HTML content của button
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            string
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>reDraw</strong></div>
    <div class="panel-body">
        Vẽ lại button
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getDOM</strong></div>
    <div class="panel-body">
        Trả về DOM của button
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            <ul>
                <li>false</li>
                <li>jQuery DOM selected</li>
            </ul>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getOtherButton</strong></div>
    <div class="panel-body">
        Lấy button khác của dialog
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
            <code>_.M.DialogButton</code>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getCloseKey</strong></div>
    <div class="panel-body">
        Trả về key dùng khi close dialog
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            string
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>closeDialog</strong></div>
    <div class="panel-body">
        Đóng dialog bằng button này
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>wasCloseDialog</strong></div>
    <div class="panel-body">
        Kiểm tra dialog có phải đã được đóng bởi button này hay không
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>