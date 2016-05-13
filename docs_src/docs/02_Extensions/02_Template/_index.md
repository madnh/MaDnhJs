Hỗ trợ thể hiện data dưới dạng giao diện HTML.

- Quản lý Template dạng callback
- Quản lý Template Class - class thể hiện của một object.

# Template dạng callback
Một callback nhận vào data, trả về HTMl -> gọi là **compiler**
```js
_.M.Template.compiler('test', function(data) {
    if(!_.isObject(data)){
        data = {};
    }
    _.defaults(data, {name: 'Client'});
    return '<strong>Hi, ' + data.name + '</strong>';
});

['Tí', 'Tèo'].forEach(function(name) {
  $('body').append(_.M.Template.render('test', {name: name}) + '<br>');
});
  $('body').append(_.M.Template.render('test') + '<br>');
```

# Template Class
Nhằm tách biệt rõ giữa nghiệp vụ và giao diện, thể hiện của một object, hoặc chia giao diện ra thành nhiều thành phần, dễ dàng thay đổi cấu hình template.

## Object cần thể hiện
```js
function ProcessBar(value, total) {
    this.type_prefix = 'process_bar';
    _.M.EventEmitter.call(this);
    this.label = 'Test process bar';
    this.total = total || 100;
    this.value = value || 0;
}
_.M.inherit(ProcessBar, _.M.EventEmitter);

ProcessBar.prototype.advance = function (items) {
    this.value = _.M.minMax(this.value + parseInt(items || 1), 0, this.total);

    this.emit('change', this.value);
    return this.value;
};

ProcessBar.prototype.reset = function (total) {
    if (typeof total !== 'undefined') {
        this.total = parseInt(total);
    }

    this.value = 0;
    this.emit('reset', [this.total, this.value]);
};

var process_bar = new ProcessBar();
```

Ở đây ta khai báo một class có tên `ProcessBar`, kế thừa class `_.M.EventEmitter`. Thật ra chỉ cần là một object với các field/value là đã có thể demo rồi, nhưng mình thích thể hiện :v

Class `ProcessBar` có 3 thuộc tính:
- label: Label của cái Process bar này
- total: tổng số phần tử cần giải quyết
- value: số lượng phần tử đã giải quyết

và 2 method:
- advance: thay đổi giá trị thuộc tính `value`, số lượng thay đổi tùy chọn, mặc định là 1. Method này phát sinh event `change`
- reset: reset các giá trị của `Process Bar`. Method này phát sinh event `reset`

Các method phát sinh các event nhằm mục đích tự thay đổi template khi thay đổi các giá trị của `Process Bar` (hay chưa :D)

## Khai báo Template
Class `_.M.Template` có các khái niệm sau:
- layout: thể hiện cấu trúc của template. Có thể là chuỗi hoặc func -> return chuỗi
- section: tập hợp một phần các mã HTML có liên quan tới nhau. Một section có thể bao gồm các section khác.
Trong layout (và trong section), một section được thể hiện bằng cấu trúc: `@TÊN_SECTION_VIẾT_HOA@`, vd: `@HEADER@`, `@LOGIN_PAGE@`

Chi tiết các thành phần xem chi tiết ở page API của `_.M.Template`

```js
var PlainTemplate = new _.M.Template();

PlainTemplate.setLayout('<div id="<%= dom_id %>">@LABEL@ @DETAIL@</div>');
PlainTemplate.setSection('LABEL', '<strong><%= data_source.label %>:</strong>');
PlainTemplate.setSection('DETAIL', '@VALUE@/@TOTAL@');
PlainTemplate.setSection('VALUE', '<span style="color: green"><%= data_source.value %></span><strong>');
PlainTemplate.setSection('TOTAL', '</strong><span style="color: blue"><%= data_source.total %></span>');

PlainTemplate.mimic('change','reset');
PlainTemplate.on(['change', 'reset'], PlainTemplate.reDraw);
```

**Giải thích:**
- Template chứa 2 section chính: `LABEL` và `DETAIL`. Section `DETAIL` chứa 2 section khác trong nó: `VALUE`, `TOTAL`
- `_.M.Template` sử dụng method `_.template` của **UnderscoreJS** để gán data vào template. Biến trong template được thể hiện bằng cấu trúc `<= tên biến %%>`
- Biến `data_source` trong template tham chiếu tới object mà template thể hiện - biến `process_bar`
- Template sẽ theo dõi các sự kiện của object mà nó thể hiện (không bắt buộc). Khi object mà nó thể hiện có thay đổi thì nó sẽ có sự thay đổi tương ứng.
Ở đây template theo dõi 2 sự kiện là `change` và `reset`, khi 2 sự kiện này phát sinh sẽ vẽ lại DOM

**Kết nối Object - Template và render**
Sau khi đã khai báo object và template, ta sẽ connect 2 đứa lại với nhau
```js
PlainTemplate.connect(process_bar);
```

**Render template và vẽ lại DOM khi có thay đổi**
```js
$('body').append(PlainTemplate.render());
```

Template có hàm `render`, trả về HTML. Sau khi thực hiện việc gán này ta sẽ có thể thấy template thể hiện ra sao:
```html
<div id="template_0">
    <strong>Test process bar:</strong>
    <span style="color: green">0</span>
    <strong>/</strong>
    <span style="color: blue">100</span>
</div>
```

Thử thay đổi giá trị của `process_bar` coi sao
```js
setInterval(function () {
    process_bar.advance();
    if(process_bar.value === 100){
        process_bar.reset();
    }
}, 200);
```

Ta sẽ thấy mỗi khi giá trị của `process_bar` thay đổi, DOM thể hiện của nó cũng sẽ thay đổi theo. Ghê chưa :D

## Quản lý các Template
Một (loại) object có thể được thể hiện nhiều cách khác nhau. `_.M.Template` có thể quản lý các cách thể hiện (từ nay gọi là template) của một loại object.

Để có thể được quản lý, các template phải được cấu trúc ở dạng Class kế thừa class `_.M.Template`.

### Tổ chức template ở dạng class
Chúng ta sẽ viết lại template `PlainTemplate` ở ví dụ trước thành dạng class:

```js
function PlainTemplate(){
    _.M.Template.call(this);

    this.setLayout('<div id="<%= dom_id %>">@LABEL@ @DETAIL@</div>');
    this.setSection('LABEL', '<strong><%= data_source.label %>:</strong>');
    this.setSection('DETAIL', '@VALUE@/@TOTAL@');
    this.setSection('VALUE', '<span style="color: green"><%= data_source.value %></span><strong>');
    this.setSection('TOTAL', '</strong><span style="color: blue"><%= data_source.total %></span>');

    this.mimic('change','reset');
    this.on(['change', 'reset'], this.reDraw);
}
_.M.inherit(PlainTemplate, _.M.Template);
```

Sẵn đang rảnh, thiết kế thêm cái template nữa, dùng bootstrap =))

```js
function BootstrapTemplate(){
    _.M.Template.call(this);
    this.options = {
        type: 'primary'
    };
    this.setLayout('<div class="progress" id="<%= dom_id %>"><div class="progress-bar progress-bar-<%= option.type %> active" role="progressbar" aria-valuenow="<%=data_source.value%>" aria-valuemin="0" aria-valuemax="<%= data_source.total %>" style="width: <%=percent%>%"></div></div>');

    this.mimic('change','reset');
    this.on(['change', 'reset'], this.reDraw);
}
_.M.inherit(BootstrapTemplate, _.M.Template);

BootstrapTemplate.prototype.prepareData = function () {
    var data_source = this.getDataSource();
    return {
        percent: data_source.value / data_source.total * 100
    }
};
```

Method `prepareData` của template `BootstrapTemplate` dùng để chuẩn bị thêm một số data để gán vào template, ở ví dụ này tính số phần trăm đã hoàn thành của process bar.

### Quản lý và cách lấy template
**Quản lý**
```js
_.M.Template.register('ProcessBar', 'Plain', PlainTemplate);
_.M.Template.register('ProcessBar', 'Bootstrap', BootstrapTemplate);
```

Loại template `ProcessBar` có các template là `Plain`, `Bootstrap`.

**Dùng các template đã khai báo**

```js
var process_bar = new ProcessBar();
var template_1 = _.M.Template.templateInstance('ProcessBar', 'Plain');
var template_2 = _.M.Template.templateInstance('ProcessBar', 'Bootstrap');
var template_3 = _.M.Template.templateInstance('ProcessBar', 'Bootstrap');

template_1.connect(process_bar);
template_2.connect(process_bar);
template_3.connect(process_bar);

template_3.option('type','success');

$('body').append(template_1.render());
$('body').append(template_2.render());
$('body').append(template_3.render());

setInterval(function () {
    process_bar.advance();
    if(process_bar.value === 100){
        process_bar.reset();
    }
}, 200);
```

Đoạn code trên chúng ta khai báo 2 template instance của các Template tương ứng là `Plain` và `Bootstrap`, 2 template này cùng thể hiện cho object instance của class `ProcessBar`.

Chạy thử để biết =))

