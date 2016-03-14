function test3() {
    var mad1 = new MaDRange('time');

    var ranges = [
        {
            start: 0,
            end: 10.3
        },
        {
            start: 10.3,
            end: 12
        }
    ];
    var excepts = [
        {
            start: 8,
            end: 9.21
        }
    ];
    console.log(mad1.getDriver().prevEnd({
        start: 8,
        end: 9.21
    }));
    console.log(mad1.getDriver().nextStart(ranges[0]), mad1.getDriver().isNext(ranges[0], ranges[1]));
    console.log(mad1.merge(ranges));
    console.log(mad1.exclude([{start: 0, end: 20}], excepts));
}