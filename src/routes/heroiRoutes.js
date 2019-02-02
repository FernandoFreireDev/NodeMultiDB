const BaseRoutes = require('./base/baseRoutes');

class HeroiRoutes extends BaseRoutes {
    constructor(db){
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                return this.db.read();
            }
        }
    }

    listTodos() {
        return {
            path: '/listar',
            method: 'GET',
            handler: (request, headers) => {
                return this.db.read();
            }
        }
    }
}

module.exports = HeroiRoutes;