## Properties
<div class="alert alert-info">
    Không có property
</div>

## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>has</strong></div>
    <div class="panel-body">
        Kiểm tra 1 flag có tồn tại
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h3>Parameters</h3>
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
            <h3>Returns</h3>
            <ul>
                <li>boolean</li>
            </ul>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>flag</strong></div>
    <div class="panel-body">
        Đặt giá trị cho 1 flag
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h3>Parameters</h3>
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
                    <td><code>is_active</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Tình trạng của flag</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>flags</strong></div>
    <div class="panel-body">
        Lấy danh sách flag
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h3>Parameters</h3>
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
                    <td>
                        <dl class="dl-horizontal">
                            <dt>true</dt><dd>danh sách flag và tình trạng</dd>
                            <dt>false</dt><dd>danh sách flag</dd>
                        </dl>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h3>Returns</h3>
            <dl class="dl-horizontal">
                <dt>array</dt><dd>Chỉ tên flag</dd>
                <dt>object</dt><dd>Flag và tình trạng</dd>
            </dl>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>get</strong></div>
    <div class="panel-body">
        Lấy tình trạng của flag
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h3>Parameters</h3>
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
            <h3>Returns</h3>
            <dl class="dl-horizontal">
                <dt>true</dt><dd>Flag đang bật</dd>
                <dt>false</dt><dd>Flag đang tắt hoặc không tồn tại</dd>
            </dl>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>isFlagged</strong></div>
    <div class="panel-body">
       Kiểm tra một flag có tồn tại và tình trạng là bật
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h3>Parameters</h3>
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
                        <ul>
                            <li>string</li>
                            <li>string[]</li>
                        </ul>
                    </td>
                    <td></td>
                    <td>Tên hoặc mảng tên flag</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h3>Returns</h3>
            <dl class="dl-horizontal">
                <dt>boolean</dt>
                <dd>Tình trạng của flag khi parameter truyền vào chỉ có tên 1 flag</dd>
                <dt>array</dt>
                <dd>Mảng tình trạng của flag</dd>
            </dl>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>toggle</strong></div>
    <div class="panel-body">
        Chuyển tình trạng của flag
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h3>Parameters</h3>
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
                        <ul>
                            <li>string</li>
                            <li>string[]</li>
                        </ul>
                    </td>
                    <td></td>
                    <td>Tên hoặc mảng tên flag</td>
                </tr>
                <tr>
                    <td><code>status</code></td>
                    <td>
                        <ul>
                            <li>boolean</li>
                            <li>undefined</li>
                        </ul>
                    </td>
                    <td>undefined</td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>boolean</dt>
                            <dd>On/off when status is true/false</dd>
                            <dt>undefined</dt>
                            <dd>
                                On/off when current flag's status is off/on <br>
                            </dd>
                        </dl>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
