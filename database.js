const { readFile, writeFile } = require("fs");

const { promisify } = require("util");

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Database {
  constructor() {
    this.NOME_ARQUIVO = "herois.json";
  }
  async obterDadosArquivo() {
    const arquivo = await readFileAsync(this.NOME_ARQUIVO, "utf8");
    return JSON.parse(arquivo.toString());
  }

  async escreverArquivo(dados) {
    await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados));
    return true;
  }

  async cadastrar(heroi) {
    const dados = await this.obterDadosArquivo();
    const id = dados.length !== 0 ? dados[dados.length - 1].id + 1 : 1;
    //const id = heroi.id
    /**
     * {
     * nome: Flash,
     * poder: Velocidade
     * }
     *
     * {
     * id: 12345687
     * }
     *
     * {
     * nome: Flash,
     * poder: Velocidade
     * id: 12345687
     * }
     */
    const heroiComId = {
      ...heroi,
      id,
    };
    const dadosFinal = [...dados, heroiComId];
    console.log(dadosFinal[dadosFinal.length - 1])
    const resultado = await this.escreverArquivo(dadosFinal);
    return resultado;
  }

  async listar(id) {
    const dados = await this.obterDadosArquivo();
    const dadosFiltrados = dados.filter((item) => (id ? item.id === id : true));
    return dadosFiltrados;
  }

  async remover(id) {
    if (!id) {
      return await this.escreverArquivo([]);
    }
    const dados = await this.obterDadosArquivo()
    const indice = dados.findIndex((item) => item.id === parseInt(id))
    if(indice === -1) {
        throw Error('O usuario informado nao existe')
    }
    dados.splice(indice, 1)
    return await this.escreverArquivo(dados)
  }

  async atualizar(id, modificacoes) {
    const dados = await this.obterDadosArquivo()
    const indice = dados.findIndex((item) => item.id === parseInt(id))
    if(indice === -1) {
        throw Error('O heroi informado nao existe')
    }
    const atual = dados[indice]
    const objetoAtualizar = {
        ...atual,
        ...modificacoes
    }
    dados.splice(indice, 1)
    
    return await this.escreverArquivo([
        ...dados,
        objetoAtualizar
    ])
  }
}

module.exports = new Database();

/*
const { readFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);

const NOME_ARQUIVO = 'herois.json';

async function obterDadosArquivo() {
    const arquivo = await readFileAsync(`./${NOME_ARQUIVO}`, 'utf8');
    return JSON.parse(arquivo.toString());
}

async function listar(id) {
    const dados = await obterDadosArquivo();
    const dadosFiltrados = dados.filter((item) => (id ? (item.id === id) : true));
    return dadosFiltrados;
}

module.exports = {
    listar
};
*/
