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