<p><strong>EventEmitter</strong> là base class, hỗ trợ quản lý các sự kiện của instance</p>
<p>Kế thừa class <code>_.M.BaseClass</code></p>

<ul>
    <li>Đăng ký/Hủy đăng ký các listener cho các event</li>
    <li>Khởi tạo các event</li>
    <li>Lắng nghe sự kiện của các EventEmitter khác</li>
</ul>

<pre><code class="javascript">
    var obj = new _.M.EventEmitter();
    
    obj.on('event_1', function(){
        console.log('Event 1, Callback 1');
    });
    
    obj.on('event_1', function(){
        console.log('Event 1, Callback 2');
    });
    
    obj.emit('event_1');
    => 'Event 1, Callback 1'
    => 'Event 1, Callback 2'
</code></pre>

Lắng nghe sự kiện của EventEmitter instance khác

<pre><code class="javascript">
    var obj2 = new _.M.EventEmitter();
    
    obj2.attachTo(obj);
    
    obj2.on('noticed', function(){
        console.log('EventEmitter instance 2 noticed', arguments);
    });
    
    obj.emit('event_1');
    => 'Event 1, Callback 1'
    => 'Event 1, Callback 2'
    => 'EventEmitter instance 2 noticed' ......
</code></pre>