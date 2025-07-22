const express = require('express');
const router = express.Router();
const { getAllCasos, getCasoById, createCaso, updateCaso, patchCaso, deleteCaso } = require('../controllers/casosController');

router.get('/', getAllCasos);
router.get('/:id', getCasoById);
router.post('/', createCaso);
router.put('/:id', updateCaso);
router.patch('/:id', patchCaso);
router.delete('/:id', deleteCaso);

module.exports = router;