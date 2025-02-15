import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
    getGadgetController,
    postGadgetController,
    updateGadgetController,
    deleteGadgetController,
    destroyGadgetController,
} from '../controllers/gadget.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Gadget:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, deployed, destroyed, decommissioned]
 *         success_probability:
 *           type: number
 *           format: float
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdById:
 *           type: string
 *         decommissionedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         destroyedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /gadgets:
 *   get:
 *     summary: Retrieve all gadgets
 *     description: Fetches a list of all gadgets with optional status filter.
 *     tags:
 *       - Gadget API
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, deployed, destroyed, decommissioned]
 *         description: Filter gadgets by status
 *     responses:
 *       200:
 *         description: A list of gadgets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gadget'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authMiddleware, getGadgetController);

/**
 * @swagger
 * /gadgets:
 *   post:
 *     summary: Add a new gadget
 *     description: Creates a new gadget with a random name or provided name.
 *     tags:
 *       - Gadget API
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, deployed, destroyed]
 *     responses:
 *       201:
 *         description: Gadget successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, postGadgetController);

/**
 * @swagger
 * /gadgets:
 *   patch:
 *     summary: Update an existing gadget
 *     tags:
 *       - Gadget API
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, deployed, destroyed, decommissioned]
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/', authMiddleware, updateGadgetController);

/**
 * @swagger
 * /gadgets/{id}:
 *   delete:
 *     summary: Mark a gadget as "Decommissioned"
 *     tags:
 *       - Gadget API
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gadget decommissioned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authMiddleware, deleteGadgetController);

/**
 * @swagger
 * /gadgets/{id}/self-destruct:
 *   post:
 *     summary: Trigger self-destruct for a gadget
 *     tags:
 *       - Gadget API
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gadget destroyed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 destroyedGadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/self-destruct', authMiddleware, destroyGadgetController);

export default router;
