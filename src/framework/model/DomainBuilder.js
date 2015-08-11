var DomainBuilder = require('./SchemaBuilder');

DomainBuilder.plug(require('./DocumentVersion'), true);
DomainBuilder.plug(require('./Id'), true);
DomainBuilder.plug(require('./CreatedOn'));
DomainBuilder.plug(require('./CreatedBy'));
DomainBuilder.plug(require('./UpdatedOn'));
DomainBuilder.plug(require('./UpdatedBy'));
DomainBuilder.plug(require('./LifeFlag'));
DomainBuilder.plug(require('./Rank'));

module.exports = DomainBuilder;