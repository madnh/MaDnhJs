## Properties
<table class="table table-striped">
    <thead>
    <tr>
        <th>Tên</th>
        <th>Kiểu dữ liệu</th>
        <th>Giá trị mặc định</th>
        <th>Mô tả</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>_contents</code></td>
        <td>object</td>
        <td>{}</td>
        <td>Object chứa dữ liệu</td>
    </tr>
    <tr>
        <td><code>_usesing</code></td>
        <td>Object</td>
        <td>{}</td>
        <td>Object lưu list các data key đang được sử dụng. Lưu bằng object thay vì array để truy xuất nhanh hơn</td>
    </tr>
    </tbody>
</table>

## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>hasType</strong></div>
    <div class="panel-body">
        Kiểm tra một kiểu dữ liệu có tồn tại?
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
                    <td>Kiểu dữ liệu</td>
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
    <div class="panel-heading"><strong>types</strong></div>
    <div class="panel-body">
        Trả về mảng tên các kiểu dữ liệu
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string[]</dt>
                <dd></dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>add</strong></div>
    <div class="panel-body">
        Thêm một dữ liệu
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
                    <td><code>content</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Dữ liệu cần thêm</td>
                </tr>
                <tr>
                    <td><code>meta</code></td>
                    <td>*</td>
                    <td>undefined</td>
                    <td>Meta info của dữ liệu</td>
                </tr>
                <tr>
                    <td><code>type</code></td>
                    <td>string</td>
                    <td>*</td>
                    <td>Kiểu dữ liệu của nội dung, tự động kiểm tra nếu không chỉ định rõ</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string</dt>
                <dd>Content key</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>addUnique</strong></div>
    <div class="panel-body">
        Thêm dữ liệu nếu chưa có. Nếu đã có trả về content key đầu tiên
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            <strong>Tương tự như method <code>add</code></strong>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string</dt>
                <dd>Content key của dữ liệu mới thêm hoặc của content đầu tiên tìm thấy</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isValidKey</strong></div>
    <div class="panel-body">
        Kiểm tra một key có hợp lệ.
        <strong>Chú ý:</strong> không kiểm tra key có tồn tại hay không
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
                    <td><code>key</code></td>
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
    <div class="panel-heading"><strong>filter</strong></div>
    <div class="panel-body">
        Lọc content bằng callback, trả về tất cả vị trí của content hợp lệ
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
                    <td>
                        Callback có các parameters
                        <ul>
                            <li>content</li>
                            <li>meta info</li>
                            <li>key dữ liệu</li>
                            <li>kiểu dữ liệu</li>
                        </ul>
                        Callback return:
                        <dl class="dl-horizontal">
                            <dt>true</dt>
                            <dd>dữ liệu hợp lệ</dd>
                            <dt>false</dt>
                            <dd>dữ liệu không hợp lệ</dd>
                        </dl>
                    </td>
                </tr>
                <tr>
                    <td><code>types</code></td>
                    <td>
                        <ul>
                            <li>string</li>
                            <li>string[]</li>
                        </ul>
                    </td>
                    <td>Tất cả kiểu dữ liệu</td>
                    <td>Kiểu dữ liệu cần lọc</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Mảng các vị trí, mỗi vị trí là một object với cấu trúc như sau:
                                <dl class="dl-horizontal">
                                    <dt>type</dt>
                                    <dd>kiểu dữ liệu</dd>
                                    <dt>key</dt>
                                    <dd>key dữ liệu</dd>
                                    <dt>content</dt>
                                    <dd>dữ liệu</dd>
                                    <dt>meta</dt>
                                    <dd>meta info</dd>
                                </dl>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <ul>
                <li>Kiểu dữ liệu không tồn tại</li>
            </ul>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>find</strong></div>
    <div class="panel-body">
        Tìm kiếm vị trí đầu tiên của content bằng callback
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
                    <td>
                        Callback có các parameters
                        <ul>
                            <li>content</li>
                            <li>meta info</li>
                            <li>key dữ liệu</li>
                            <li>kiểu dữ liệu</li>
                        </ul>
                        Callback return:
                        <dl class="dl-horizontal">
                            <dt>true</dt>
                            <dd>dữ liệu hợp lệ</dd>
                            <dt>false</dt>
                            <dd>dữ liệu không hợp lệ</dd>
                        </dl>
                    </td>
                </tr>
                <tr>
                    <td><code>types</code></td>
                    <td>
                        <ul>
                            <li>string</li>
                            <li>string[]</li>
                        </ul>
                    </td>
                    <td>Tất cả kiểu dữ liệu</td>
                    <td>Kiểu dữ liệu cần lọc</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>false</dt>
                <dd>Không tìm thấy</dd>
                <dt>object</dt>
                <dd>
                    object chỉ vị trí content với cấu trúc như sau:
                    <dl class="dl-horizontal">
                        <dt>type</dt>
                        <dd>kiểu dữ liệu</dd>
                        <dt>key</dt>
                        <dd>key dữ liệu</dd>
                        <dt>content</dt>
                        <dd>dữ liệu</dd>
                        <dt>meta</dt>
                        <dd>meta info</dd>
                    </dl>
                </dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <ul>
                <li>Kiểu dữ liệu không tồn tại</li>
            </ul>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>hasContent</strong></div>
    <div class="panel-body">
        Kiểm tra một nội dung có tồn tại?
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
                    <td><code>content</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Nội dung cần kiểm tra</td>
                </tr>
                <tr>
                    <td><code>type</code></td>
                    <td>string</td>
                    <td>undefined</td>
                    <td>Kiểu dữ liệu của nội dung. Tự động xác định kiểu từ parameter <code>content</code></td>
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
    <div class="panel-heading"><strong>hasKey</strong></div>
    <div class="panel-body">
        Kiểm tra một key có tồn tại
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
                    <td><code>key</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
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
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>using</strong></div>
    <div class="panel-body">
        Đặt tình trạng sử dụng của key
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
                    <td><code>key</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>is_using</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Key đang được sử dụng</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>true</dt>
                <dd>Key tồn tại và đặt tình trạng thành công</dd>
                <dt>false</dt>
                <dd>Key không tồn tại</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>unused</strong></div>
    <div class="panel-body">
        Đặt tình trạng cho các key là không sử dụng
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
                    <td><code>keys*</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>usingKeys</strong></div>
    <div class="panel-body">
        Các key đang được sử dụng
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
                    <td><code>grouped</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Nhóm các key đang được sử dụng theo kiểu dữ liệu</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string[]</dt>
                <dd>Mảng các key đang được sử dụng</dd>
                <dt>{}</dt>
                <dd>
                    Các key đang được sử dụng, đã gom nhóm
                    <ul>
                        <li>field key: string, tên kiểu dữ liệu</li>
                        <li>field value: string[], mảng các key</li>
                    </ul>
                </dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isUsing</strong></div>
    <div class="panel-body">
        Kiểm tra một key có đang được sử dụng
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
                    <td><code>key</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
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
    <div class="panel-heading"><strong>isUsingContent</strong></div>
    <div class="panel-body">
        Kiểm tra một dữ liệu có đang được sử dụng hay không
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
                    <td><code>content</code></td>
                    <td>*</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>type</code></td>
                    <td>string</td>
                    <td>Tự xác định kiểu dữ liệu</td>
                    <td>Kiểu dữ liệu</td>
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
    <div class="panel-heading"><strong>get</strong></div>
    <div class="panel-body">
        Lấy dữ liệu và meta info
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
                    <td><code>key</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Key cần lấy dữ liệu</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>{content: *, meta: *}</dt>
                <dd>Dữ liệu và meta info</dd>
                <dt>false</dt>
                <dd>Không tìm thấy key</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getType</strong></div>
    <div class="panel-body">
        Lấy về các dữ liệu của một kiểu dữ liệu
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
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>false</dt>
                <dd>Kiểu dữ liệu không tồn tại</dd>
                <dt>[]</dt>
                <dd>Mảng các dữ liệu, mỗi phần tử là một object, với cấu trúc:
                    <dl class="dl-horizontal">
                        <dt>content</dt>
                        <dd>dữ liệu</dd>
                        <dt>meta</dt>
                        <dd>meta info</dd>
                    </dl>
                </dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getContent</strong></div>
    <div class="panel-body">
        Lấy dữ liệu của key
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
                    <td><code>key</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>default_value</code></td>
                    <td>*</td>
                    <td>undefined</td>
                    <td>Dữ liệu mặc định trong trường hợp key không tồn tại</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <ul>
                <li>Dữ liệu hoặc giá trị mặc định</li>
            </ul>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getMeta</strong></div>
    <div class="panel-body">
        Lấy meta info của key
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
                    <td><code>key</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>default_value</code></td>
                    <td>*</td>
                    <td>undefined</td>
                    <td>Giá trị mặc định trong trường hợp key không tồn tại</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <ul>
                <li>Meta info hoặc giá trị mặc định</li>
            </ul>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>remove</strong></div>
    <div class="panel-body">
        Xóa dữ liệu bằng key
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
                    <td><code>keys*</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Các key cần xóa</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>[]</dt>
                <dd>Mảng chứa thông tin các key đã xóa, mỗi phần tử của mảng là môt object với cấu trúc như sau:
                    <dl class="dl-horizontal">
                        <dt>type</dt>
                        <dd>kiểu dữ liệu</dd>
                        <dt>key</dt>
                        <dd>key đã xóa</dd>
                    </dl>
                </dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>removeContent</strong></div>
    <div class="panel-body">
        Xóa dữ liệu
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
                    <td><code>content</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Dữ liệu cần xóa</td>
                </tr>
                <tr>
                    <td><code>type</code></td>
                    <td>string</td>
                    <td>Tự động xác định</td>
                    <td>Kiểu dữ liệu</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>[]</dt>
                <dd>Mảng chứa thông tin các key đã xóa, mỗi phần tử của mảng là môt object với cấu trúc như sau:
                    <dl class="dl-horizontal">
                        <dt>type</dt>
                        <dd>kiểu dữ liệu</dd>
                        <dt>key</dt>
                        <dd>key đã xóa</dd>
                    </dl>
                </dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>update</strong></div>
    <div class="panel-body">
        Cập nhật giá trị và meta info của dữ liệu
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
                    <td><code>key</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>content</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Dữ liệu mới</td>
                </tr>
                <tr>
                    <td><code>meta</code></td>
                    <td>*</td>
                    <td>Meta info cũ</td>
                    <td>Meta info mới</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>true</dt>
                <dd>Cập nhật thành công</dd>
                <dt>false</dt>
                <dd>Cập nhật không thành công</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>updateMeta</strong></div>
    <div class="panel-body">
        Cập nhật meta info của dữ liệu
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
                    <td><code>key</code></td>
                    <td>string</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>meta</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Meta info mới</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>true</dt>
                <dd>Cập nhật thành công</dd>
                <dt>false</dt>
                <dd>Cập nhật không thành công</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>removeUsing</strong></div>
    <div class="panel-body">
        Xóa các content đang được sử dụng
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            Mảng chứa thông tin các key đã xóa, mỗi phần tử của mảng là môt object với cấu trúc như sau:
                                <dl class="dl-horizontal">
                                    <dt>type</dt>
                                    <dd>kiểu dữ liệu</dd>
                                    <dt>key</dt>
                                    <dd>key đã xóa</dd>
                                </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>removeUnusing</strong></div>
    <div class="panel-body">
        Xóa các content không được sử dụng
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            Mảng chứa thông tin các key đã xóa, mỗi phần tử của mảng là môt object với cấu trúc như sau:
                                <dl class="dl-horizontal">
                                    <dt>type</dt>
                                    <dd>kiểu dữ liệu</dd>
                                    <dt>key</dt>
                                    <dd>key đã xóa</dd>
                                </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>status</strong></div>
    <div class="panel-body">
        Tình trạng của instance
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            Object với cấu trúc như sau:
                                <dl class="dl-horizontal">
                                    <dt>using</dt>
                                    <dd>Các key đang được sử dụng</dd>
                                    <dt>types</dt>
                                    <dd>Object với cấu trúc:
                                        <ul>
                                            <li>field key: string, kiểu dữ liệu</li>
                                            <li>field value: string[], mảng các key của kiểu dữ liệu</li>
                                        </ul>
                                    </dd>
                                </dl>
        </li>
    </ul>
</div>