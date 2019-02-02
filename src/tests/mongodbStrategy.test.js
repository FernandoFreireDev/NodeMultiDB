const assert = require("assert");
const Mongodb = require("./../db/strategies/mongodb/mongodb");
const Context = require("./../db/strategies/base/contextStrategy");
const HeroiSchema = require('./../db/strategies/mongodb/schemas/herois');

let context = {};

const HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}

const HEROI_DEFAULT = {
    nome: `Homem-Aranha-${new Date()}`,
    poder: 'Super Teia'
}

const HEROI_ATUALIZAR = {
    nome: `Patolino-${new Date()}`,
    poder: 'Velocidade'
}

let HEROI_ID = '';

describe("MongoDB Suíte de testes", function () {

    this.beforeAll(async () => {
        const connection = Mongodb.connect();
        context = new Context(new Mongodb(connection, HeroiSchema));

        await context.create(HEROI_DEFAULT);
        const result = await context.create(HEROI_ATUALIZAR);
        HEROI_ID = result._id;
    })

    it('Verificar Conexão', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado';

        console.log('status da conexão: ', result);
        assert.deepEqual(result, expected);
    });

    it('Cadastrar', async () => {
        const { nome, poder } = await context.create(HEROI_CADASTRAR);
        assert.deepEqual({ nome, poder }, HEROI_CADASTRAR);
    });

    it('Listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: HEROI_DEFAULT.nome });
        const result = { nome, poder };
        assert.deepEqual(result, HEROI_DEFAULT);
    });

    it('Atualizar', async () => {
        const result = await context.update(HEROI_ID, {
            nome: 'Pernalonga'
        });
        assert.deepEqual(result.nModified, 1);
    });

    it('Remover', async () => {
        const result = await context.delete(HEROI_ID);
        assert.deepEqual(result.n, 1);
    });

});
