const assert = require('assert');
const api = require('../api');
const Context = require('./../db/strategies/base/contextStrategy');
const Postgres = require('./../db/strategies/postgres/postgres');
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuario');

let app = {};
const USER = {
    username: 'Xuxadasilva',
    password: '123'
}
const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$gpD642vTIDIAhLCv19Uw7.NUlllhdTRY2UZeSw4O6pVyisKjh9O/.'
}

describe('Suite de testes de autenticação', function () {
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await Postgres.connect();
        const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
        const postgres = new Context(new Postgres(connectionPostgres, model));
        const result = await postgres.update(null, USER_DB, true);
    });
 
    it('Deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(dados.token.length > 10);
    });

    it('Deve retornar não autorizado ao tentar obter um login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'Fernando Freire',
                password: '123'
            }
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.deepEqual(statusCode, 401);
        assert.deepEqual(dados.error, "Unauthorized");
    })
});