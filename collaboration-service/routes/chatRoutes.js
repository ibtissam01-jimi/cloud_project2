// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');





/*{
    "sender": "ID_UTILISATEUR",
    "project": "ID_PROJET",
    "content": "Bonjour, ce message est un test.",
    
  }*/

// Envoyer un message
//http://localhost:5004/api/chat/

//67e8e51937f81e3131d2373e :id user
//67e51f155cc7073afd4cd7ea :id projet
router.post('/', async (req, res) => {
    try {
        const { sender, project, content } = req.body;
        const message = new Message({ sender, project, content });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Récupérer les messages d'un projet
//get http://localhost:5004/api/chat/67e51f155cc7073afd4cd7ea  (2 message pour ce projet)
router.get('/:projectId', async (req, res) => {
    try {
        const messages = await Message.find({ project: req.params.projectId });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// Récupérer tous les messages envoyés par un utilisateur spécifique



//http://localhost:5004/api/chat/sender/67e8e51937f81e3131d2373e


router.get('/sender/:senderId', async (req, res) => {
    try {
        const messages = await Message.find({ sender: req.params.senderId }).select('content -_id');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;