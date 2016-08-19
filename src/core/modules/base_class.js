/**
 * @module _.M.BaseClass
 * @memberOf _.M
 */
;(function (_) {
    /**
     * Base class
     * @class _.M.BaseClass
     * @property {string} type_prefix Prefix of class, use as prefix of instance ID, default is class name
     * @property {string} id Instance ID
     */
    function BaseClass() {
        if (!this.type_prefix) {
            this.type_prefix = _.M.className(this, true);
        }

        if (!this.id) {
            this.id = _.M.nextID(this.type_prefix, true);
        }
    }

    /**
     * 
     * @type {_.M.BaseClass}
     */
    _.M.BaseClass = BaseClass;
})(_);