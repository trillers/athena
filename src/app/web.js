var WebHelper = {
    /**
     * Convert settings.app object to base url (http://www.zz365.com.cn)
     * @param app settings.app object
     * @returns {string}
     */
    getBaseUrl: function(app) {
        return app.protocol + '://' + app.domain + (app.domainPort!=80 ? ':'+app.domainPort : '');
    },

    /**
     * Convert settings.app object to url (http://www.zz365.com.cn/  or http://www.zz365.com.cn/wechat)
     * @param app
     * @returns {string}
     */
    getUrl: function(app) {
        return this.getBaseUrl(app) + app.context;
    }
};


module.exports = WebHelper;