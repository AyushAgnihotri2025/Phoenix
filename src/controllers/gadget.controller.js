import db from '../lib/db.js';
import generateCodename from '../utils/generateCodename.js';

export const getGadgetController = async (req, res) => {
    const { status } = req.query;

    if (status && !['available', 'deployed', 'destroyed', 'decommissioned'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const gadgets = await db.gadget.findMany({ where: status ? { status } : {} });
        res.status(200).json(gadgets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gadgets', error: error.message });
    }
};

export const postGadgetController = async (req, res) => {
    let { status } = req.body;
    const createdById = req.user?.id; // Assuming user authentication middleware

    if (!createdById) {
        return res.status(403).json({ message: 'Unauthorized: User not logged in' });
    }

    if (status && !['available', 'deployed', 'destroyed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    let name;
    let existingGadget;
    do {
        name = generateCodename();
        existingGadget = await db.gadget.findUnique({ where: { name } });
    } while (existingGadget);

    const success_probability = parseFloat((Math.random() * 100).toFixed(2));

    try {
        const newGadget = await db.gadget.create({
            data: {
                name,
                status: status || 'available',
                success_probability,
                createdById, // Store creator's ID
            },
        });

        return res.status(201).json({ message: 'Gadget created successfully!', gadget: newGadget });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating gadget', error: error.message });
    }
};

export const updateGadgetController = async (req, res) => {
    try {
        const { id, name, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const gadget = await db.gadget.findUnique({ where: { id } });
        if (!gadget) {
            return res.status(404).json({ message: 'Gadget not found' });
        }

        if (gadget.status === 'destroyed' && status !== 'destroyed') {
            return res.status(400).json({ message: 'Destroyed gadgets cannot be reactivated' });
        }

        const updatedGadget = await db.gadget.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(status && { status }),
            },
        });

        return res.status(200).json({ message: 'Gadget updated successfully', gadget: updatedGadget });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating gadget', error: error.message });
    }
};

export const deleteGadgetController = async (req, res) => {
    const { id } = req.params;

    try {
        const gadget = await db.gadget.findUnique({ where: { id } });

        if (!gadget) {
            return res.status(404).json({ message: 'Gadget not found' });
        }

        if (gadget.status === 'decommissioned') {
            return res.status(400).json({ message: 'Gadget already decommissioned' });
        }

        const updatedGadget = await db.gadget.update({
            where: { id },
            data: {
                status: 'decommissioned',
                decommissionedAt: new Date(),
            },
        });

        return res.status(200).json({
            message: 'Gadget decommissioned successfully',
            gadget: updatedGadget,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error decommissioning gadget', error: error.message });
    }
};

export const destroyGadgetController = async (req, res) => {
    const { id } = req.params;
    try {
        const gadget = await db.gadget.findUnique({ where: { id } });
        if (!gadget) {
            return res.status(404).json({ message: 'Gadget not found' });
        }

        if (gadget.status === 'destroyed') {
            return res.status(400).json({ message: 'Gadget already destroyed' });
        }

        const destroyedGadget = await db.gadget.update({
            where: { id },
            data: {
                status: 'destroyed',
                destroyedAt: new Date(),
            },
        });
        return res.status(200).json({ message: 'Gadget destroyed successfully', destroyedGadget });
    } catch (error) {
        return res.status(500).json({ message: 'Error destroying gadget', error: error.message });
    }
};
