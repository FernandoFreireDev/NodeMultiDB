const assert = require('assert');
const api = require('./../api');

let app = {};

const DEFAULT_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Biônica'
}

const DEFAULT_ATUALIZAR = {
    nome: 'Gavião Negro',
    poder: 'Flechas'
}

let DEFAULT_ID = '';

describe('Suite de testes da API Herois', function () {

    this.beforeAll(async () => {
        app = await api;
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(DEFAULT_ATUALIZAR)
        });

        const dados = JSON.parse(result.payload);
        DEFAULT_ID = dados._id;
    });

    it('Listar Herois', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));

    });

    it('Listar /herois - deve retornar somente 10 registros', async () => {
        const TAMANHO_LIMITE = 3;

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMITE);
    });

    it('Listar /herois - deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AEEE';

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });

        const erroResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }
        }

        assert.deepEqual(result.statusCode, 400);
        assert.deepEqual(result.payload, JSON.stringify(erroResult));
    });

    it('Listar /herois - deve filtrar um item', async () => {
        const TAMANHO_LIMITE = 1000;
        const NAME = "Batman";
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(dados[0].nome === NAME);
    });

    it('Cadastrar POST - /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: JSON.stringify(DEFAULT_CADASTRAR)
        });

        const statusCode = result.statusCode;
        const {
            message,
            _id
        } = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepEqual(message, "Heroi cadastrado com sucesso");
    });

    it('Atualizar PATCH - /herois/:id', async () => {
        const _id = DEFAULT_ID;
        const expected = {
            poder: 'Arco e Flecha'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso');
    });

    it('Atualizar PATCH - /herois/:id - Não deve atualizar com id incorreto', async () => {
        const _id = `5c5a2172b68c0216ec79e5f6`; 

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify({
                poder: 'Arco e Flecha'
            })
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encontrado no banco'
        }

        assert.ok(statusCode === expected.statusCode);
        assert.deepEqual(dados, expected);
    });

    it('Remover  DELETE - /herois/:id', async () => {
        const _id = DEFAULT_ID;
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepEqual(dados.message, 'Heroi removido com sucesso');
    });

    it('Não deve remover  DELETE - /herois/:id', async () => {
        const _id = `5c5a2172b68c0216ec79e5f6`; 
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encontrado no banco'
        }

        assert.ok(statusCode === expected.statusCode);  
        assert.deepEqual(dados, expected);
    });

    it('Não deve remover com id inválido  DELETE - /herois/:id', async () => {
        const _id = `ID_INVÁLIDO`; 
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);
        const expected = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
        }

        assert.ok(statusCode === expected.statusCode);  
        assert.deepEqual(dados, expected);
    });


});