const assert = require('assert');
const api = require('./../api');

let app = {};

describe.only('Suite de testes da API Herois', function(){

    this.beforeAll(async () => {
        app = await api;
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

        assert.deepEqual(result.payload, 'Erro interno no servidor');
    });

    it('Listar /herois - deve filtrar um item', async () => {
        const TAMANHO_LIMITE = 1000;
        const NAME = "Homem-Aranha-Mon Feb 04 2019 13:19:09 GMT-0200 (Horário brasileiro de verão)";
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(dados[0].nome === NAME);
    });

});