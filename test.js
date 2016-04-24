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





//Bien doi data
_.M.AJAX.registerDataAdapter('append_name', function (request_data) {
    request_data['name'] += ' điên';

    return request_data;
});
_.M.AJAX.registerResponseAdapter('prepend', function (response) {
    this.response = '[response]' + response;
});

$.ajax({
    url: '/examples/ajax.php',
    method: 'POST',
    data: { name: 'Manh' },
    success: function (response) {
        console.log('Response: ', response);
        response = _.M.AJAX.applyResponseAdapters(response, 'prepend');
        console.log('New response: ', response.response);
    }
});
//=> Response:  Hello, Manh
//=> New response:  [response]Hello, Manh