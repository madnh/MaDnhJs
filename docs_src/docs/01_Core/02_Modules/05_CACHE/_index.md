Hệ thống quản lý cache.
Hộ trợ:
<ul>
    <li>Thêm, xóa, cập nhật, xóa cache</li>
    <li>Kiểm tra tồn tại</li>
    <li>Thêm live time</li>
    <li>Tự động hủy các cache đã hết hạn</li>
</ul>

```js
function getLargeData(id){
    var cache_name = 'large_data_' + id,
        data;

    if(_.M.CACHE.has(cache_name)){
        return _.M.CACHE.get(cache_name);
    }

    data = .....; //Get data from DB, API,... etc
    _.M.CACHE.set(cache_name, data, _M.CACHE_MEDIUM);

    return data;
}
```