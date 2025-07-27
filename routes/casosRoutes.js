const express = require('express');
const router = express.Router();
const { getAllCasos, getCasoById, createCaso, updateCaso, patchCaso, deleteCaso } = require('../controllers/casosController');

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Lista todos os casos
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Lista de casos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 */
router.get('/', getAllCasos);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Busca um caso pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 */
router.get('/:id', getCasoById);

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Caso'
 *     responses:
 *       201:
 *         description: Caso criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', createCaso);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza um caso existente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Caso'
 *     responses:
 *       200:
 *         description: Caso atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Caso não encontrado
 */
router.put('/:id', updateCaso);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um caso existente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Caso'
 *     responses:
 *       200:
 *         description: Caso atualizado parcialmente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Caso não encontrado
 */
router.patch('/:id', patchCaso);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caso removido
 *       404:
 *         description: Caso não encontrado
 */
router.delete('/:id', deleteCaso);

module.exports = router;