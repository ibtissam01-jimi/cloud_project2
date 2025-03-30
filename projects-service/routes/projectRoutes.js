const express = require("express");
const router = express.Router();
const Project = require("../models/Project");


const authMiddleware = require("../../auth/middleware/auth");

// Ajouter un projet (authentifié)
// post http://localhost:5000/api/projects/
router.post("/", authMiddleware(["admin", "user"]), async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Récupérer tous les projets
// get http://localhost:5000/api/projects/
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("category");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




//http://localhost:5000/api/projects/filtrer?name=nom_du_projet&startDate=2024-03-01&endDate=2024-03-30&status=En%20cours&category=65f07d8e1a2b4c001c3e2f4a

router.get("/filtrer", async (req, res) => {
  try {
    const { name, startDate, endDate, status, category } = req.query;
    let filter = {};

    if (name) filter.name = new RegExp(name, "i");
    if (startDate) filter.startDate = { $gte: new Date(startDate) };
    if (endDate) filter.endDate = { $lte: new Date(endDate) };
    if (status) filter.status = new RegExp(status, "i"); // Ignore la casse
    if (category) filter.category = category;

    console.log("Filtre appliqué :", filter);

    const projects = await Project.find(filter).populate("category");
    console.log("Projets trouvés :", projects);

    res.json(projects);
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ message: err.message });
  }
});




//Récupérer un projet par ID
// get http://localhost:5000/api/projects/67e8872d3a715f15db65dd96 =>stagaire 
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("category");
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Modifier un projet (authentifié)
// put http://localhost:5000/api/projects/67e8872d3a715f15db65dd96 modifier  gestion stagaire en formateur
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("category");
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Supprimer un projet (authentifié)
// supprimer http://localhost:5000/api/projects/67e8872d3a715f15db65dd96
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assigner une catégorie à un projet
// put http://localhost:5000/api/projects/67e8872d3a715f15db65dd96/category et passer dans body

router.put("/:id/category", authMiddleware(["admin", "user"]), async (req, res) => {
  try {
    const { category } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id, { category }, { new: true }).populate("category");

    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route de filtrage des projets



module.exports = router;
