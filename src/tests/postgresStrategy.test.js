const assert = require('assert')
const Postgres = require('./../db/strategies/postgres')
const Context = require('./../db/strategies/base/contextStrategy')

const context = new Context(new Postgres())
const HEROI_CADASTRAR = {
    nome: 'Gavião Negro',
    poder: 'Flexas'
}

describe('Postgres Strategy', function() {
    this.timeout(Infinity)
    this.beforeAll(async () =>{
        await context.connect()
    })

    it('PostgreSQL Connection', async function(){
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    // it('Cadastrar', async () => {
    //     const result = await context.create(HEROI_CADASTRAR)
    //     assert.deepEqual(result, HEROI_CADASTRAR)
    // })
 
})