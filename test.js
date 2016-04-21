var ajax = new _.M.AJAX();

ajax.option({
    url: '/examples/ajax.php',
    method: 'POST',
    data: {name: 'Manh'}
}).done(function (response) {
    console.log('Response', response);
}).fail(function () {
    console.log('Failed', arguments);
}).always(function () {
    console.log('Ajax complete');
});

ajax.request();

function test(url, data, callback) {
    var args = Array.prototype.slice.call(arguments, 1),
        result;

    console.log('args', args);
    result = _.M.optionalArgs(args, ['data', 'callback'], {
        data: ['string', 'object'],
        callback: 'function'
    });

    result['url'] = url;

    return result;
}
