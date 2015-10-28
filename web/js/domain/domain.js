var h2 = require('../h2/index');
var domain = h2.domain();

domain.restApi({
    baseUrl: __app.settings.api.url
});

module.exports = domain;
