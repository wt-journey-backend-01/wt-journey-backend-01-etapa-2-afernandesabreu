const { v4: uuidv4 } = require('uuid');
const agente_id = require('./agentesRepository').agentes[0].id;

const casos = [
    {
        "id": uuidv4(),
        "titulo": "homicidio",
        "descricao": "...",
        "status": "aberto",
        "agente_id": agente_id
    }
];

const findAll = async () => {
    return casos;
};

const findById = async (id) => {
    return casos.find((caso) => caso.id === id)
};

const create = async (dados) => {
    const novoCaso = {
        id: uuidv4(),
        ...dados
    };
    casos.push(novoCaso);
    return novoCaso;
};

const update = async (id, dados) => {
    const idx = casos.findIndex((caso) => caso.id ===id);
    if (idx === -1) return null;
    
    const { id: _, ...dadosSemID } = dados;

    casos[idx] = {
        ...casos[idx],
        ...dadosSemID
    };
    
    return casos[idx];
};

const patch = async (id, dadosParciais) => {
    const idx = casos.findIndex(caso => caso.id === id);
    if (idx === -1) return null;

    casos[idx] = {
        ...casos[idx],
        ...dadosParciais
    };

    return casos[idx];
};

const deleteCaso = async (id) => {
    const idx = casos.findIndex((caso) => caso.id === id);
    if (idx === -1) return null;

    const casoRemovido = casos.splice(idx, 1);
    return casoRemovido[0];
};

module.exports = { findAll, findById, create, update, patch, delete: deleteCaso };