const BaseRoute = require('./baseRoutes');
const Joi = require('joi');
const Boom = require('boom');

const JWT = require('jsonwebtoken');
const PasswordHelper = require('./../../helpers/passwordHelper');

const failAction = (request, headers, error) => {
    throw error;
};

const USER = {
    username: 'xuxadasilva',
    password: '123'
}

class AuthRoutes extends BaseRoute {

    constructor(secret, db){
        super();
        this.secret = secret;
        this.db = db;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com usuário e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { 
                    username, 
                    password 
                } = request.payload;

                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                });

                if(!usuario) {
                    return Boom.unauthorized('O usuário informado não existe!');
                }

                const match = await PasswordHelper.compareAsync(password, usuario.password);

                if(!match){
                    return Boom.unauthorized('O usuário ou senha inválidos!');
                }
                
                // if (
                //     username.toLowerCase() !== USER.username ||
                //     password !== USER.password
                // ) {
                //     return Boom.unauthorized();
                // }
                
                const token = JWT.sign({
                   username: username,
                   id: usuario.id
                }, this.secret);

                return {
                    token
                }
            }
        }
    }
}

module.exports = AuthRoutes;