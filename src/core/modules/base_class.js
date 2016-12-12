(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['madnh'], function (M) {
            return factory(M);
        });
    } else {
        // Browser globals
        root.BaseClass = factory(root.M);
    }
}(this, function (M) {

    /**
     * Base class
     * @class BaseClass
     * @property {string} type_prefix Prefix of class, use as prefix of instance ID, default is class name
     * @property {string} id Instance ID
     */
    function BaseClass() {
        if (!this.type_prefix) {
            this.type_prefix = M.className(this, true);
        }

        if (!this.id) {
            this.id = M.nextID(this.type_prefix, true);
        }
    }

    return BaseClass;
}));