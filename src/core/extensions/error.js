/**
 * mError
 * @module _.M.mError
 * @memberOf _.M
 */
;(function (_) {
    /**
     * @class _.M.mError
     * @extends Error
     * @param message
     * @param code
     * @param data
     */
    function mError(message, code, data) {
        this.name = 'mError';
        this.message = message || '';
        this.code = code || null;
        this.data = data || null;
        this.stack = (new Error()).stack;
    }

    _.M.inherit(mError, Error);

    /**
     *
     * @type {_.M.mError}
     */
    _.M.mError = mError;
})(_);