const Caso = require('../repositories/casosRepository');

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
        res.status(500).json ({ message: 'Error ao tentar encontrar caso especificado' });
    };
};

const createCaso = async (req, res) => {
    try {
        const caso = await Caso.create(req.body);
        res.status(201).json(caso);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar novo caso', error: error.message });
    };
};

const updateCaso = async (req, res) => {
    try {
        const existeCaso = await Caso.findById(req.params.id);
        if (!existeCaso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        };
        const caso = await Caso.update(req.params.id, req.body);
        res.status(200).json(caso);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar o caso', error: error.message });
    };
};

const patchCaso = async (req, res) => {
    try {
        const existeCaso = await Caso.findById(req.params.id);
        if (!existeCaso) {
            return res.status(404).json({ message: 'Caso não encontrado'});
        };
        const caso = await Caso.patch(req.params.id, req.body);
        res.status(200).json(caso);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualização informação sobre o caso', error:error.message });
    };
};

const deleteCaso = async (req, res) => {
    try {
        const caso = await Caso.delete(req.params.id);
        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado'});
        };
        res.status(200).json({ message: 'Caso removido com sucesso'});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar caso'});
    };
};


module.exports = { getAllCasos, getCasoById, createCaso, updateCaso, patchCaso, deleteCaso };