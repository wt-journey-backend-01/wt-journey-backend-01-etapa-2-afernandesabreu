const Agente = require('../repositories/agentesRepository');

function validarAgente(dados) {
    const { nome, dataDeIncorporacao, cargo } = dados;
    if (!nome || nome.trim() === '') {
        throw new Error('Nome do agente é obrigatório e não pode ser vazio.');
    }
    // Validar formato e data não futura para dataDeIncorporacao
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(dataDeIncorporacao)) {
        throw new Error('Data de incorporação deve estar no formato YYYY-MM-DD.');
    }
    const data = new Date(dataDeIncorporacao);
    const hoje = new Date();
    if (data > hoje) {
        throw new Error('Data de incorporação não pode ser no futuro.');
    }
    if (!cargo || cargo.trim() === '') {
        throw new Error('Cargo é obrigatório e não pode ser vazio.');
    }
}

const getAllAgentes = async (req, res) => {
    try {
        const agentes = await Agente.findAll();
        res.status(200).json(agentes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar agentes', error: error.message });
    };
};

const getAgenteById = async (req, res) => {
    try {
        const agente = await Agente.findById(req.params.id);
        if (!agente) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        };
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao tentar encontrar agente especificado', error: error.message });
    };
};

const createAgente = async (req, res) => {
    try {
        validarAgente(req.body);
        const agente = await Agente.create(req.body);
        res.status(201).json(agente);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar novo agente', error: error.message });
    };
};

const updateAgente = async (req, res) => {
    try {
        const existeAgente = await Agente.findById(req.params.id);
        if (!existeAgente) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        };
        validarAgente(req.body);
        const agente = await Agente.update(req.params.id, req.body);
        res.status(200).json(agente);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar agente', error: error.message });
    };
};

const patchAgente = async (req, res) => {
    try {
        const existeAgente = await Agente.findById(req.params.id);
        if (!existeAgente) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        };
        validarAgente(req.body);
        const agente = await Agente.patch(req.params.id, req.body);
        res.status(200).json(agente);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar informação sobre o agente', error: error.message });
    };
};

const deleteAgente = async (req, res) => {
    try {
        const agente = await Agente.delete(req.params.id);
        if (!agente) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        };
        res.status(200).json({ message: 'Agente removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar agente', error: error.message });
    };
};





module.exports = { getAllAgentes, getAgenteById, createAgente, updateAgente, patchAgente, deleteAgente };