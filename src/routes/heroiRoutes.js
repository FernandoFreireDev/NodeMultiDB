const BaseRoutes = require('./base/baseRoutes');
const Joi = require('joi');

class HeroiRoutes extends BaseRoutes {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro;
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const {
                        skip,
                        limit,
                        nome
                    } = request.query;

                    const query = {
                        nome: {
                            $regex: `.*${nome}*.`
                        }
                    };

                    return this.db.read(nome ? query : {}, skip, limit);
                }
                catch (error) {
                    console.log('Erro: ', error);
                    return 'Erro interno no servidor';
                }
            }
        }
    }

}

module.exports = HeroiRoutes;