const assert = require("assert");
const Postgres = require("./../db/strategies/postgres");
const Context = require("./../db/strategies/base/contextStrategy");

const context = new Context(new Postgres());
const HEROI_CADASTRAR = {
  nome: "Gavião Negro",
  poder: "Flexas"
};

const HEROI_ATUALIZAR = {
  nome: "Batman",
  poder: "Dinheiro"
};

describe("Postgres Strategy", function() {
  this.timeout(Infinity);
  this.beforeAll(async function() {
    await context.connect();
    await context.delete();
    await context.create(HEROI_ATUALIZAR);
  });

  it("PostgreSQL Connection", async function() {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it("Cadastrar", async function() {
    const result = await context.create(HEROI_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, HEROI_CADASTRAR);
  });

  it("Listar", async function() {
    const [result] = await context.read({ nome: HEROI_CADASTRAR.nome });
    delete result.id;
    assert.deepEqual(result, HEROI_CADASTRAR);
  });

  it("Atualizar", async function() {
    const [itemAtualizar] = await context.read({ nome: HEROI_ATUALIZAR.nome });
    const novoItem = {
      ...HEROI_ATUALIZAR,
      nome: "Mulher Maravilha"
    };
    const [result] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id });
    assert.deepEqual(result, 1);
    assert.deepEqual(itemAtualizado.nome, novoItem.nome);
  });

  it("Remover por id", async function() {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  });
});
