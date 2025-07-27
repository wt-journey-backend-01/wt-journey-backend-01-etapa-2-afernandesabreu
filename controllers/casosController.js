const Caso = require('../repositories/casosRepository');

function validarCaso(dados) {
    const { titulo, dataDeRegistro, status } = dados;

    if (!titulo || titulo.trim() === '') {
        throw new Error('Título do caso é obrigatório e não pode ser vazio.');
    }

    // Validar formato e data não futura para dataDeRegistro
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(dataDeRegistro)) {
        throw new Error('Data de registro deve estar no formato YYYY/MM/DD.');
    }
    const data = new Date(dataDeRegistro);
    const hoje = new Date();
    if (data > hoje) {
        throw new Error('Data de registro não pode ser no futuro.');
    }

    if (!status || status.trim() === '') {
        throw new Error('Status do caso é obrigatório e não pode ser vazio.');
    }
}

const getAllCasos = async (_, res) => {
    try {
        const casos = await Caso.findAll();
        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar casos', error: error.message });
    };
};

const getCasoById = async (req, res) => {
    try {
        const caso = await Caso.findById(req.params.id);
        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        };
        res.status(200).json(caso);
    } catch (error) {
        res.status(500).json({ message: 'Error ao tentar encontrar caso especificado' });
    };
};

const createCaso = async (req, res) => {
    try {
        const { agente_id } = req.body;
        if (!await Agente.findById(agente_id)) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        };
        validarCaso(req.body);
        const caso = await Caso.create(req.body);
        res.status(201).json(caso);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar novo caso', error: error.message });
    };
};

const updateCaso = async (req, res) => {
    try {
        const { agente_id } = req.body;
        if (!await Agente.findById(agente_id)) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        };
        const existeCaso = await Caso.findById(req.params.id);
        if (!existeCaso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        };
        validarCaso(req.body);
        const caso = await Caso.update(req.params.id, req.body);
        res.status(200).json(caso);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar o caso', error: error.message });
    };
};

const patchCaso = async (req, res) => {
    try {
        const { agente_id } = req.body;
        if (!await Agente.findById(agente_id)) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        };
        const existeCaso = await Caso.findById(req.params.id);
        if (!existeCaso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        };
        const caso = await Caso.patch(req.params.id, req.body);
        res.status(200).json(caso);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualização informação sobre o caso', error: error.message });
    };
};

const deleteCaso = async (req, res) => {
    try {
        const caso = await Caso.delete(req.params.id);
        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        };
        res.status(200).json({ message: 'Caso removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar caso' });
    };
};


module.exports = { getAllCasos, getCasoById, createCaso, updateCaso, patchCaso, deleteCaso };