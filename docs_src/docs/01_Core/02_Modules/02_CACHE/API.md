## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>set</strong></div>
    <div class="panel-body">
        Đặt giá trị cache. Nếu cache đã có sẽ bị ghi đè
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
                    <td>Tên cache</td>
                </tr>
                <tr>
                    <td><code>value</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Giá trị của cache</td>
                </tr>
                <tr>
                    <td><code>live_time</code></td>
                    <td>number</td>
                    <td><code>_.M.CACHE_MEDIUM</code></td>
                    <td>Thời gian tồn tại của cache, tính từ thời điểm khởi tạo</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.CACHE.set('user_selected', [1,2,3]);
_.M.CACHE.set('group_count', 6, _.M.CACHE.CACHE_LONG);</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>has</strong></div>
    <div class="panel-body">
        Kiểm tra 1 cache có tồn tại và chưa hết hạn
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
                    <td>Tên cache</td>
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
        Trả về giá trị của 1 cache
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
                    <td>Tên cache</td>
                </tr>
                <tr>
                    <td><code>default_value</code></td>
                    <td>*</td>
                    <td>undefined</td>
                    <td>Giá trị mặc định trả về khi không tồn tại cache</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <p>Giá trị của cache hoặc <code>default_value</code> nếu cache không tồn tại hoặc đã hết hạn.</p>
            <div class="alert alert-warning">Để đảm bảo không bị nhầm lẫn giữa giá trị thật của cache và giá trị mặc
                định khi
                cache không tồn tại, thì cần phải kiểm tra sự tồn tại của cache bằng method <code>has</code>, trước khi
                dùng method <code>get</code></div>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.CACHE.get('group_count');
=> 6 hoặc undefined khi cache đã hết hạn
_.M.CACHE.get('group_count', 0);
=> 6 hoặc 0 khi cache đã hết hạn</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>touch</strong></div>
    <div class="panel-body">
        <p>Gia hạn thời gian tồn tại cho cache.
            Thời hạn tồn tại tiếp theo sẽ là giá trị lớn nhất giữa thời hạn tồn tại hiện tại và thời hạn tồn tại sau khi
            gia hạn
        </p>
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
                    <td>Tên cache</td>
                </tr>
                <tr>
                    <td><code>live_time</code></td>
                    <td>number</td>
                    <td>live_time của cache</td>
                    <td>Thời gian gia hạn. Mặc định là live_time hiện tại của cache</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>false</dt>
                <dd>Cache không tồn tại hoặc đã hết hạn</dd>
                <dt>true</dt>
                <dd>Cache được lưu vĩnh viễn</dd>
                <dt>number</dt>
                <dd>Thời gian hết hạn tiếp theo</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Example</h4>
<pre><code class="javascript">//Current time is 09:15
_.M.CACHE.set('a', 123, CACHE_MIN);
=> Set cache with expire time is 10s, expire at 09:25

//Next, in 09:20
_.M.CACHE.touch('a', 2);
=> Next expire time still is 09:25, because added time is 09:22, less than current expire time: 09:25
_.M.CACHE.touch('a', 30);
=> Next expire time is 09:50, because added time is 09:50, greater than current expire time: 09:25</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>list</strong></div>
    <div class="panel-body">
        Trả về danh sách các cache hợp lệ
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
                    <td><code>name_only</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Chỉ trả về tên cache</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string[]</dt>
                <dd>Mảng tên các cache, khi parameter <code>name_only</code> là <strong>true</strong></dd>
                <dt>{}</dt>
                <dd>Cache và giá trị, khi <code>name_only</code> là <strong>false</strong></dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>clean</strong></div>
    <div class="panel-body">
        <p>Gọi method xóa các cache đã hết hạn.</p>
        <div class="alert alert-info"><code>_.M.CACHE</code> sẽ tự động xóa các cache đã hết hạn mỗi 10 giây</div>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
            <div class="alert alert-info">Không có parameters</div>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <div class="alert alert-info">Không có giá trị trả về</div>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>expire</strong></div>
    <div class="panel-body">
        Xóa cache
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
                    <td><code>cache_name*</code></td>
                    <td>
                        <ul>
                            <li>string*</li>
                            <li>string[]*</li>
                        </ul>
                    </td>
                    <td></td>
                    <td>Số lượng không hạn chế các chuỗi, mảng các chuỗi là tên của các cache cần xóa</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <div class="alert alert-info">Không có giá trị trả về</div>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.CACHE.expire('user_selected');
_.M.CACHE.expire('user_selected', 'group_count');
_.M.CACHE.expire(['user_selected', 'group_count'], 'yahoo');</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>increment</strong></div>
    <div class="panel-body">
        <p>Tăng giá trị của một cache.</p>
        <p>Nếu cache không tồn tại sẽ tạo một cache mới, với giá trị là giá trị cần tăng</p>
        <div class="alert alert-danger">
            <strong>Chú ý!</strong> Chỉ thay đổi giá trị của cache mà không làm thay đổi thời hạn tồn tại của nó
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
                    <td><code>name</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên cache</td>
                </tr>
                <tr>
                    <td><code>value</code></td>
                    <td>number</td>
                    <td>1</td>
                    <td>Giá trị cần tăng</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>number</dt>
                <dd>Giá trị mới của cache</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.CACHE.increment('group_count'); //7
_.M.CACHE.increment('group_count', 2); //9
_.M.CACHE.increment('non_exists', 2); //2</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>decrement</strong></div>
    <div class="panel-body">
        Tương tự như <code>_.M.CACHE.increment</code> nhưng làm giảm giá trị của cache
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>arrayPush</strong></div>
    <div class="panel-body">
        Tương tự như <code>_.M.CACHE.increment</code> nhưng dành cho mảng - thêm giá trị vào mảng
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>arrayWithout</strong></div>
    <div class="panel-body">
        Tương tự như <code>_.M.CACHE.arrayPush</code> nhưng xóa giá trị khỏi mảng
    </div>
</div>