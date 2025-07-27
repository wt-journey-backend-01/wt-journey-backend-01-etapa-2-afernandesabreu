const { v4: uuidv4 } = require('uuid');

const casos = [
    {
        "id": uuidv4(),
        "titulo": "homicidio",
        "descricao": "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        "status": "aberto",
        "agente_id": "401bccf5-cf9e-489d-8412-446cd169a0f1" 
    }
]

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

const deleteCaso = async (id) => {
    const idx = casos.findIndex((caso) => caso.id === id);
    if (idx === -1) return null;

    const casoRemovido = casos.splice(idx, 1);
    return casoRemovido[0];
};

module.exports = { findAll, findById, create, update, delete: deleteCaso };