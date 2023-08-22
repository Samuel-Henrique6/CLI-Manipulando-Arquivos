const { Command } = require("commander");
const Database = require("./database");
const Heroi = require("./heroi");

const program = new Command();

async function main() {
  program
    .version("v1")
    .option("-n, --nome [value]", "Nome do Heroi")
    .option("-p, --poder [value]", "Poder do Heroi")
    .option("-i, --id [value]", "Id do Heroi")

    .option("-c, --cadastrar", "Cadastrar um Heroi")
    .option("-l, --listar", "Listar um Heroi")
    .option("-r, --remover", "Remover um Heroi")
    .option("-a, --atualizar [value]", "Atualizar um Heroi");
  program.parse(process.argv);
  const options = program.opts();
  const heroi = new Heroi(options);
  try {
    if (options.cadastrar) {
      
      const resultado = await Database.cadastrar(heroi);
      if (!resultado) {
        console.error("Heroi não foi cadastrado!");
        return;
      }
      console.log("Heroi cadastrado com sucesso!");
    }

    if (options.listar) {
      const resultado = await Database.listar();
      if (resultado.length === 0) {
        console.error("Nenhum heroi cadastrado");
        return;
      }
      console.log(resultado);
      return;
    }

    if (options.remover) {
      const resultado = await Database.remover(heroi.id);
      if (!resultado) {
        console.error("Heroi não foi removido");
        return;
      }
      console.log("Heroi removido com sucesso!");
      return;
    }

    if (options.atualizar) {
      const idParaAtualizar = parseInt(options.atualizar);
      delete heroi.id;
      const dado = JSON.stringify(heroi);
      const heroiAtualizar = JSON.parse(dado);
      const resultado = await Database.atualizar(
        idParaAtualizar,
        heroiAtualizar
      );
      if (!resultado) {
        console.error("Não foi possível atualizar heroi");
        return;
      }
      console.log("Heroi atualizado com sucesso!");
      return;
    }
  } catch (error) {
    console.error("DEU RUIM", error);
  }
}

main();
