const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Importation du middleware 
const authMiddleware = require("../../auth/middleware/auth");

//  Ajouter une catégorie (authentifié)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer toutes les catégories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer une catégorie (authentifié)
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
