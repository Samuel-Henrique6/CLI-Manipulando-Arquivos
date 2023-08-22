const { deepEqual, ok } = require("assert");

const database = require("./database");

const DEFAULT_ITEM_CADASTRAR = {
  nome: "Flash",
  poder: "Speed",
  id: 1,
};

const outroHeroi = {
  nome: "Batman",
  poder: "Smart",
  id: 2,
};

const DEFAULT_ITEM_ATUALIZAR = {
  nome: "Lanterna Verde",
  poder: "Coragem, Anel dos Lanternas Verdes",
  id: 3,
};

describe("Suite de manipulação de Herois", () => {
  before(async () => {
    const resultado = await database.listar();
    if (resultado.length === 0) {
      await database.cadastrar(DEFAULT_ITEM_CADASTRAR);
    }
  });
  it("deve pesquisar um heroi usando arquivos", async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;
    const [resultado] = await database.listar(expected.id);
    deepEqual(resultado, expected);
  });
  it("deve cadastrar um heroi, usando arquivos", async () => {
    const expected = outroHeroi;
    await database.cadastrar(outroHeroi);
    await database.cadastrar(DEFAULT_ITEM_ATUALIZAR);
    const [actual] = await database.listar(outroHeroi.id);
    deepEqual(actual, expected);
  });
  it("deve remover um heroi por id", async () => {
    const expected = true;
    const resultado = await database.remover(DEFAULT_ITEM_ATUALIZAR.id);
    deepEqual(resultado, expected);
  });
  it("deve atualizar um heroi por id", async () => {
    const expected = {
      ...outroHeroi,
      nome: "Lanterna Verde",
      poder: "Coragem, Anel dos Lanternas Verdes",
    };
    const novoDado = {
      nome: "Lanterna Verde",
      poder: "Coragem, Anel dos Lanternas Verdes",
    };
    await database.atualizar(outroHeroi.id, novoDado);
    const [resultado] = await database.listar(outroHeroi.id);
    console.log("resultado", resultado);
    deepEqual(resultado, expected);
  });
});
