## Properties
-----
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
        <td><code>type_prefix</code></td>
        <td>string</td>
        <td>"event_emitter"</td>
        <td></td>
    </tr>
    <tr>
        <td><code>_events</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Object chứa các event, với tên field là tên event
        </td>
    </tr>
    <tr>
        <td><code>_event_emitted</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Object chứa thông tin các event đã xảy ra</td>
    </tr>
    <tr>
        <td><code>_limit</code></td>
        <td>number</td>
        <td><code>_.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS</code></td>
        <td>Giới hạn số listener mỗi event, vượt quá số lượng này sẽ show warning ở console</td>
    </tr>
    <tr>
        <td><code>_event_followers</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Các <code>_.M.EventEmitter</code> instance đang theo dõi instance này</td>
    </tr>
    <tr>
        <td><code>_event_following</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Các <code>_.M.EventEmitter</code> instance mà instance này đang theo dõi</td>
    </tr>
    <tr>
        <td><code>_event_mimics</code></td>
        <td>string[]</td>
        <td>[]</td>
        <td>Nếu instance có theo dõi các <code>_.M.EventEmitter</code> instance khác thì các event có trong array này sẽ
            được xem như là event của instance này
        </td>
    </tr>
    <tr>
        <td><code>_event_privates</code></td>
        <td>[]</td>
        <td>[]</td>
        <td>Tên các event chỉ dành riêng cho instance này, khi phát sinh sẽ không thông báo cho các <code>_.M.EventEmitter</code>
            instance đang theo dõi
        </td>
    </tr>
    </tbody>
</table>


## Constructor
-----

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
        <td><code>limit</code></td>
        <td>number</td>
        <td><code>_.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS</code></td>
        <td>Giới hạn các listener của một event</td>
    </tr>
    </tbody>
</table>


## Method
-----
<div class="panel panel-info">
    <div class="panel-heading"><strong>addListener</strong></div>
    <div class="panel-body">
        <p>Thêm một hoặc nhiều listener</p>
        <div class="alert alert-warning">
            <strong>Chú ý!</strong> Khi số lượng listener của một event quá số lượng giới hạn sẽ show warning message ở
            console.
        </div>
        <div class="alert alert-warning">
            <strong>Chú ý!</strong> Khi thêm nhiều listener thì các listener này sẽ có cùng key. Nếu muốn các listener
            có key khác nhau thì phải thêm lần lượt với các key khác nhau
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
                    <td><code>event</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên event</td>
                </tr>
                <tr>
                    <td><code>listeners</code></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string/function</dt>
                            <dd><code>_.M.WAITER</code> key hoặc callback</dd>
                            <dt>string[]/function[]</dt>
                            <dd>Mảng các _.M.WAITER</code> key hoặc callback</dd>
                        </dl>
                    </td>
                    <td></td>
                    <td>Các callback cần thêm. Có thể là <code>_.M.WAITER</code> key</td>
                </tr>
                <tr>
                    <td><code>option</code></td>
                    <td>
                        <ul>
                            <li><strong>number</strong>: Listener priority</li>
                            <li>
                                {}:
                                <dl class="dl-horizontal">
                                    <dt>priority</dt>
                                    <dd>Listener priority</dd>
                                    <dt>times</dt>
                                    <dd>Số lần listener này được chạy. Mặc định là không giới hạn (-1)</dd>
                                    <dt>context</dt>
                                    <dd>Ngữ cảnh của callback (<strong>this</strong> context)</dd>
                                    <dt>key</dt>
                                    <dd>Key của listener, chủ yếu dùng để xóa listener</dd>
                                    <dt>async</dt>
                                    <dd>Listener sẽ được gọi bất đồng bộ. Mặc địn là false</dd>
                                </dl>
                            </li>
                        </ul>
                    </td>
                    <td>
<pre><code class="javascript">{
    priority: _.M.PRIORITY_DEFAULT,
    times: -1,
    context: null,
    key: 'event_emitter_listener_....', //Next ID với type là "event_emitter_listener"
    async: false
    }</code></pre>
                    </td>
                    <td>Các tùy chọn của listener</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string</dt>
                <dd>Key của các listener đã thêm</dd>
                <dt>false</dt>
                <dd>Thêm không thành công</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var obj = new _.M.EventEmitter();
    obj.addListener('test', function_1);
    => event_emitter_listener_0
    obj.addListener('test', [function_2, function_3], {
    key: 'foo',
    async: true
    });
    => foo</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>on</strong></div>
    <div class="panel-body">
        Alias của <code>addListener</code>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>addOnceListener</strong></div>
    <div class="panel-body">
        Tương tự như <code>addListener</code> nhưng các listener chỉ được sử dụng một lần
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>once</strong></div>
    <div class="panel-body">
        Alias của <code>addOnceListener</code>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>addListeners</strong></div>
    <div class="panel-body">
        Thêm nhiều listener cho nhiều event
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
                    <td><code>events</code></td>
                    <td>{}</td>
                    <td></td>
                    <td>
                        <p>Object với các field là tên event, value là mảng các listener cho event đó.
                            Các item của mảng listener có thể một listener hoặc array bao gồm 2 phần tử: phần tử đầu là listener (hoặc các listener), phần tử tiếp theo là option cho listener đó đó</p>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <div class="alert alert-info">
                Không trả về giá trị
            </div>
        </li>
        <li class="list-group-item">
<pre><code class="javascript">var obj = new _.M.EventEmitter();
    obj.addListeners({
    test_1: [function_1,
    [function_2, {key: 'yahoo'}]
    ],
    test_2: [
    [
    [function_2, function_1],
    {key: 'ohoho'}
    ]
    ]
    });
    => Ta sẽ có các key tương ứng với các listener như sau:
    => event_emitter_listener_0
    => yahoo
    => ohoho</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>emitEvent</strong></div>
    <div class="panel-body">
        Phát sinh một sự kiện
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
                    <td><code>events</code></td>
                    <td>
                        <ul>
                            <li>string</li>
                            <li>string[]</li>
                        </ul>
                    </td>
                    <td></td>
                    <td>Các event cần phát sinh</td>
                </tr>
                <tr>
                    <td><code>data</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Dữ liệu cho các event</td>
                </tr>
                <tr>
                    <td><code>final_cb</code></td>
                    <td>function</td>
                    <td>null</td>
                    <td>
                        Callback gọi sau khi các event đã được phát sinh
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <div class="alert alert-info">
                Không trả về dữ liệu
            </div>
        </li>
        <li class="list-group-item">
            <h4>Chú ý</h4>
            <div class="alert alert-info">
                <strong>Chú ý!</strong> Mỗi event khi được phát sinh cũng đồng thời phát sinh một event khác có tên <code>event_emitted</code>
            </div>
            <div class="alert alert-warning">
                Hàm <code>final_cb</code> có thể được thực thi trước hoặc sau các <code>_.M.EventEmitter</code> instance
                đang theo dõi.
            </div>
            <div class="alert alert-success">
                <strong>Chú ý</strong> Các <code>_.M.EventEmitter</code> instance đang theo dõi sẽ được thông báo về event
                (nếu không phải private event) sau khi các listener của từng event được thực thi (bao gồm cả event <code>event_emitted</code>).
            </div>
            <h5>Notice</h5>
            <p>
                Khi nhận được thông báo về một sự kiện, nếu sự kiện đó có trong list của property <code>_event_mimics</code> thì sẽ được thực thi như là một event của instance
            </p>
            <p>Một <code>_.M.EventEmitter</code> instance khi nhận được thông báo từ một instance mà nó đang theo dõi (<strong>không</strong> phải một mimic event) sẽ phát sinh các sự kiện sau:</p>
            <ul>
                <li><code>&lt;ID object thông báo&gt;.&lt;tên event&gt;</code></li>
                <li><code>&lt;type_prefix của object thông báo&gt;.&lt;tên event&gt;</code></li>
                <li><code>noticed.&lt;ID object thông báo&gt;.&lt;tên event&gt;</code></li>
                <li><code>noticed.&lt;ID object thông báo&gt;</code></li>
                <li><code>noticed.&lt;type_prefix của obejct thông báo&gt;.&lt;tên event&gt;</code></li>
                <li><code>noticed.&lt;type_prefix của object thông báo&gt;</code></li>
                <li><code>noticed</code></li>
            </ul>
            <p>Các event trên, mỗi event sẽ có data là một object có cấu trúc như sau</p>
            <dl class="dl-horizontal">
                <dt>id</dt><dd>ID object thông báo</dd>
                <dt>type</dt><dd><code>type_prefix</code> của object thông báo</dd>
                <dt>event</dt><dd>Tên event</dd>
                <dt>data</dt><dd>Event data</dd>
            </dl>
            <div class="alert alert-info">
                <strong>Chú ý!</strong> Mỗi event khi được phát sinh và notice các followers sẽ phát sinh một event khác có tên <code><strong>&lt;tên event&gt;</strong>_complete</code>
            </div>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
            <p>Các sự kiện của instance</p>
<pre><code class="javascript">var obj = new _.M.EventEmitter();
    obj.on('event_1', function(){
    console.log('Event 1, Callback 1');
    });
    obj.on('event_1', function(){
    console.log('Event 1, Callback 2');
    });
    obj.emit('event_1');
    => 'Event 1, Callback 1'
    => 'Event 1, Callback 2'</code></pre>
            <p>Các sự kiện, có các <code>_.M.EventEmitter</code> instance khác đang theo dõi</p>
<pre><code class="javascript">var obj2 = new _.M.EventEmitter();
    obj.attach(obj2); // hoặc obj2.attachTo(obj)
    obj2.on('noticed', function(data){
    console.log('EventEmitter instance 2 noticed', data);
    });
    obj.emit('event_1');
    => 'Event 1, Callback 1'
    => 'Event 1, Callback 2'
    => 'EventEmitter instance 2 noticed'</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>emit</strong></div>
    <div class="panel-body">
        Alias của <code>emitEvent</code>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>removeListener</strong></div>
    <div class="panel-body">
        Xóa các listener
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
                    <td><code>key_or_listener</code></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string</dt>
                            <dd>Listener key</dd>
                            <dt>callback</dt>
                            <dd>Listener callback. Chỉ dùng được khi là một function có tên gọi hoặc là một variable,
                                không phải là func ảo
                            </dd>
                        </dl>
                    </td>
                    <td></td>
                    <td>Listener hoặc callback cần xóa</td>
                </tr>
                <tr>
                    <td><code>priority</code></td>
                    <td>number</td>
                    <td>undefined</td>
                    <td>
                        <p>Priority của listener. Nếu chỉ định sẽ chỉ xóa các listener ở priority này</p>
                        <div class="alert alert-warning">
                            Chỉ dùng khi parameter <code>key_or_listener</code> là callback
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <div class="alert alert-info">
                Không trả về dữ liệu
            </div>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <dl class="dl-horizontal">
                <dt>parameter <code>key_or_listener</code> không hợp lệ</dt>
                <dd>"Invalid remover, it must be key of added listener or listener it self"</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>off</strong></div>
    <div class="panel-body">
        Alias của <code>removeListener</code>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>mimic</strong></div>
    <div class="panel-body">
        Thêm một mimic event.
        <dl class="dl-horizontal">
            <dt>Tên event</dt>
            <dd>Tên cụ thể của event</dd>
            <dt>[noticed event type].*</dt>
            <dd>Tất cả event của một event emitter instance mà instance này đang theo dõi. VD: Dialog.*</dd>
            <dt>[noticed event type].[tên event]</dt>
            <dd>Event emitter instance mà instance này đang theo dõi và tên cụ thể của event</dd>
        </dl>
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
                    <td><code>mimic event</code></td>
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
    <div class="panel-heading"><strong>attach</strong></div>
    <div class="panel-body">
        Attach một <code>_.M.EventEmitter</code> instance khác
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
                    <td><code>eventEmitter</code></td>
                    <td>_.M.EventEmitter</td>
                    <td></td>
                    <td>Instance cần attach</td>
                </tr>
                <tr>
                    <td><code>only</code></td>
                    <td>string[]</td>
                    <td>[]</td>
                    <td>Tên các event sẽ thông báo khi có sự kiện phát sinh</td>
                </tr>
                <tr>
                    <td><code>excepts</code></td>
                    <td>string[]</td>
                    <td>[]</td>
                    <td>Tên các event sẽ <strong>KHÔNG</strong> được thông báo khi có sự kiện phát sinh</td>
                </tr>
                <tr>
                    <td><code>async</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Thông báo nhưng không đồng bộ với các sự kiện đang phát sinh</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>boolean</dt>
                <dd>True - attach thành công. False - instance đã được attach rồi</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Chú ý</h4>
            <div class="alert alert-info">
                <strong>Chú ý!</strong> Khi attach thành công sẽ phát sinh sự kiện <code>"attach"</code> với các thông
                tin bao gồm
                <ul>
                    <li>Event Emitter instance</li>
                    <li>only value</li>
                    <li>excepts value</li>
                </ul>
            </div>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <dl class="dl-horizontal">
                <dt>Instance không hợp lệ</dt>
                <dd>"Invalid _.M.EventEmitter instance"</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>attachHard</strong></div>
    <div class="panel-body">
        Tương tự như <code>attach</code> nhưng khi có sự kiện phát sinh thì instance được attach sẽ được thông báo tuyến
        tính với xử lý của instance
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
                    <td><code>eventEmitter</code></td>
                    <td>_.M.EventEmitter</td>
                    <td></td>
                    <td>Instance cần attach</td>
                </tr>
                <tr>
                    <td><code>only</code></td>
                    <td>string[]</td>
                    <td>[]</td>
                    <td>Tên các event sẽ thông báo khi có sự kiện phát sinh</td>
                </tr>
                <tr>
                    <td><code>excepts</code></td>
                    <td>string[]</td>
                    <td>[]</td>
                    <td>Tên các event sẽ <strong>KHÔNG</strong> được thông báo khi có sự kiện phát sinh</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>attachTo</strong></div>
    <div class="panel-body">
        Attach instance vào một <code>_.M.EventEmitter</code> instance khác
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
                    <td><code>eventEmitter</code></td>
                    <td>_.M.EventEmitter</td>
                    <td></td>
                    <td>Instance đích để attach vào</td>
                </tr>
                <tr>
                    <td><code>only</code></td>
                    <td>string[]</td>
                    <td>[]</td>
                    <td>Tên các event sẽ thông báo khi instance đích có sự kiện phát sinh</td>
                </tr>
                <tr>
                    <td><code>excepts</code></td>
                    <td>string[]</td>
                    <td>[]</td>
                    <td>Tên các event sẽ <strong>KHÔNG</strong> được thông báo khi instance đích có sự kiện phát sinh
                    </td>
                </tr>
                <tr>
                    <td><code>hard</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Instance được đính kèm vào instance đích, khi có thông báo sẽ được gọi bất đối xứng với những gì
                        đang xử lý ở instance đích
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>boolean</dt>
                <dd>True - attach thành công. False - instance đã được attach rồi</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Chú ý</h4>
            <div class="alert alert-info">
                <strong>Chú ý!</strong> Khi attach thành công sẽ phát sinh sự kiện <code>"attached"</code> với các thông
                tin bao gồm
                <ul>
                    <li>instance đích</li>
                    <li>only value</li>
                    <li>excepts value</li>
                </ul>
            </div>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <dl class="dl-horizontal">
                <dt>Instance đích không hợp lệ</dt>
                <dd>"Invalid _.M.EventEmitter instance"</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>attachHardTo</strong></div>
    <div class="panel-body">
        Tương tự như <code>attachTo</code> nhưng khi có sự kiện phát sinh thì instance sẽ được thông báo tuyến
        tính với xử lý của instance đích
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
                    <td><code>eventEmitter</code></td>
                    <td>_.M.EventEmitter</td>
                    <td></td>
                    <td>Instance đích</td>
                </tr>
                <tr>
                    <td><code>only</code></td>
                    <td>string[]</td>
                    <td>[]</td>
                    <td>Tên các event sẽ thông báo khi có sự kiện phát sinh</td>
                </tr>
                <tr>
                    <td><code>excepts</code></td>
                    <td>string[]</td>
                    <td>[]</td>
                    <td>Tên các event sẽ <strong>KHÔNG</strong> được thông báo khi có sự kiện phát sinh</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>notice</strong></div>
    <div class="panel-body">
        Thông báo cho instance có một sự kiện phát sinh ở một instance mà instance này đang theo dõi
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
                    <td><code>sourceID</code></td>
                    <td>string</td>
                    <td></td>
                    <td>ID của instance mà instance này đang theo dõi</td>
                </tr>
                <tr>
                    <td><code>eventName</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên sự kiện phát sinh</td>
                </tr>
                <tr>
                    <td><code>data</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Dữ liệu của sự kiện</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <div class="alert alert-info">
                Không có dữ liệu trả về
            </div>
        </li>
        <li class="list-group-item">
            <h4>Chú ý</h4>
            <div class="alert alert-info">
                Chỉ nhận các sự kiện trong list <strong>only</strong> như khi cấu hình theo dõi 1 instance
            </div>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>detach</strong></div>
    <div class="panel-body">
        Gỡ một <code>_.M.EventEmitter</code> instance đã được attach
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
                    <td><code>eventEmitter</code></td>
                    <td><code>_.M.EvenEmitter</code></td>
                    <td></td>
                    <td>Instance đã attach</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>boolean</dt><dd></dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Chú ý</h4>
            <div class="alert alert-info">
            	Khi detach thành công sẽ phát sinh sự kiện <code>detach</code> với parameters như sau:
                <ul>
                    <li>instance đã detach</li>
                </ul>
            </div>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <dl class="dl-horizontal">
                <dt>Instance không hợp lệ</dt><dd>"Invalid _.M.EventEmitter instance"</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>detachFrom</strong></div>
    <div class="panel-body">
        Gỡ instance khỏi một instance đang theo dõi khác
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
                    <td><code>eventEmitter</code></td>
                    <td><code>_.M.EvenEmitter</code></td>
                    <td></td>
                    <td>Instance đích</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>boolean</dt><dd></dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Chú ý</h4>
            <div class="alert alert-info">
                Khi detach thành công sẽ phát sinh sự kiện <code>detach</code> với parameters như sau:
                <ul>
                    <li>instance đã detach</li>
                </ul>
            </div>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <dl class="dl-horizontal">
                <dt>Instance không hợp lệ</dt><dd>"Invalid _.M.EventEmitter instance"</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>resetEvents</strong></div>
    <div class="panel-body">
        Xóa các listener của một event
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
                    <td><code>event</code></td>
                    <td>string</td>
                    <td>undefined</td>
                    <td>Tên event cần xóa. Nếu không chỉ định rõ sẽ xóa toàn bộ các event</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <div class="alert alert-info">
                Không có dữ liệu trả về
            </div>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>reset</strong></div>
    <div class="panel-body">
        Alias của <code>resetEvents</code>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>events</strong></div>
    <div class="panel-body">
        Trả về danh sách các event
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
                    <td><code>count</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Kết quả trả về sẽ bao gồm số lượng các listener mỗi event</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>string[]</dt><dd>Mảng tên các event</dd>
                <dt>{}</dt><dd>Object với key là tên event, value là số lượng listener của event đó</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>emitted</strong></div>
    <div class="panel-body">
        Trả về số lần đã phát sinh của các sự kiện
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
                    <td><code>event</code></td>
                    <td>string</td>
                    <td>undefined</td>
                    <td>Nếu chỉ định sẽ trả về số lần phát sinh của sự kiện này. Nếu chưa phát sinh lần nào hoặc sự kiện không tồn tại sẽ trả về <strong>0</strong></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>number</dt><dd>Số lần phát sinh của một event cụ thể</dd>
                <dt>{}</dt><dd>Object với key là tên sự kiện, value là số lần đã phát sinh của sự kiện đó</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>limit</strong></div>
    <div class="panel-body">
        Đặt số lượng giới hạn của các listener cho mỗi event. Nếu vượt quá số lượng này thì khi thêm listener sẽ show warning ở console
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
                    <td><code>limit</code></td>
                    <td>number</td>
                    <td></td>
                    <td>Số lượng giới hạn mới</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>unlimited</strong></div>
    <div class="panel-body">
        Đặt số lượng giới hạn của các listener mỗi event là không giới hạn
    </div>
</div>