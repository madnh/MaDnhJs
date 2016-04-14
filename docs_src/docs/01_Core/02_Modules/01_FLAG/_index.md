Đánh dấu cho các mục thông tin với tình trạng ON/OFF

Bình thường
```js
var show_tabs = {};
function showTab(name){
    if(!show_tabs[name]){
        //action...
        //..
        show_tabs[name] = true;
    }
}
```

Nay
```js
function showTab(name){
    if(!_.M.FLAG.isFlagged(name)){
        //action...
        //..
        _.M.FLAG.flag(name);
    }
}
```

