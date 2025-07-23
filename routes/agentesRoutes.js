const express = require('express');
const router = express.Router();
const { getAllAgentes, getAgenteById, createAgente, updateAgente, patchAgente, deleteAgente } = require('../controllers/agentesController');

router.get('/', getAllAgentes);
router.get('/:id', getAgenteById);
router.post('/', createAgente);
router.put('/:id', updateAgente);
router.patch('/:id', patchAgente);
router.delete('/:id', deleteAgente);

module.exports = router;
