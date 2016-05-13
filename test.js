/**
 *
 * @param {number} [value]
 * @param {number} [total]
 * @constructor
 */
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

var PlainTemplate = new _.M.Template();

PlainTemplate.setLayout('<div id="<%= dom_id %>">@LABEL@ @DETAIL@</div>');
PlainTemplate.setSection('LABEL', '<strong><%= datasource.label %>:</strong>');
PlainTemplate.setSection('DETAIL', '@VALUE@/@TOTAL@');
PlainTemplate.setSection('VALUE', '<span style="color: green"><%= datasource.value %></span><strong>');
PlainTemplate.setSection('TOTAL', '</strong><span style="color: blue"><%= datasource.total %></span>');

PlainTemplate.mimic('change','reset');

PlainTemplate.on(['change', 'reset'], PlainTemplate.reDraw);

var BootstrapTemplate = new _.M.Template();

BootstrapTemplate.setLayout('<div class="progress" id="<%= dom_id %>"><div class="progress-bar active" role="progressbar" aria-valuenow="<%=datasource.value%>" aria-valuemin="0" aria-valuemax="<%= datasource.total %>" style="width: <%=datasource.value%>%"></div></div>');

PlainTemplate.connect(process_bar);
// BootstrapTemplate.connect(process_bar);
$('body').append(PlainTemplate.render());
// $('body').append(BootstrapTemplate.render());


var timeInterval = setInterval(function () {
    process_bar.advance();
    if(process_bar.value === 100){
        clearInterval(timeInterval);
    }
    // PlainTemplate.reDraw();
    // BootstrapTemplate.reDraw();
}, 200);