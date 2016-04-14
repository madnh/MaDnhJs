var obj = new _.M.EventEmitter();

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
=> ohoho
