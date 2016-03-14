/**
 * Created by MaDnh on 21/5/2015.
 */

(function (_) {
    var mixin = {};
    var stack = [];
    var overlay;


    mixin.status = function(){
        return _.clone(stack);
    };
    mixin.has = function (node) {
        return _.contains(stack, node);
    };
    function getStyle(el,styleProp)
    {
        var x;
        var y;
        if (window.getComputedStyle)
        {
            y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
        }
        else if (x.currentStyle)
        {
            y = x.currentStyle[styleProp];
        }

        return y;
    }
    mixin.create = function (node) {
        if(!overlay){
            overlay = document.createElement('div');
            overlay.className = 'overlay';
        }
        var node_zindex = getStyle(node, 'zIndex')
        console.log('Style', node.style);
        console.log('Index', node_zindex);
        document.body.appendChild(overlay);
        overlay.style.zIndex = node_zindex -1;
    };

    _.mixinAll({
        OVERLAY: mixin
    });
}).call(this, _);