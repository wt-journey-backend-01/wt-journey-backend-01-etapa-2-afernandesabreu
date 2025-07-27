const { v4: uuidv4 } = require('uuid');

const agentes = [
    {
        "id": uuidv4(),
        "nome": "Rommel Carneiro",
        "dataDeIncorporacao": "1992-10-04",
        "cargo": "delegado"
    }
]

const findAll = async () => {
    return agentes;
};

const findById = async (id) => {
    return agentes.find((agente) => agente.id === id);
};

const create = async (dados) => {
    const novoAgente = {
        id: uuidv4(),
        ... dados
    };
    agentes.push(novoAgente);
    return novoAgente;
};

const update = async (id, dados) => {
    const idx = agentes.findIndex((agente) => agente.id === id);
    if (idx === -1) return null;

    const { id: _, ...dadosSemID } = dados;

    agentes[idx] = {
        ...agentes[idx],
        ...dadosSemID
    };

    return agentes[idx];
};

const deleteAgente = async (id) => {
    const idx = agentes.findIndex((agente) => agente.id === id);
    if (idx === -1) return null;

    const agenteRemovido = agentes.splice(idx, 1);
    return agenteRemovido[0];
};

module.exports = { findAll, findById, create, update, delete: deleteAgente }

