const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/authmodel");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
//http://localhost:5002/api/auth/register
router.post(
  "/register",
  [
    check("email", "Email invalide").isEmail(),
    check("password", "Le mot de passe doit comporter au moins 6 caractères").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      const userExist = await User.findOne({ email });
      if (userExist) return res.status(400).json({ msg: "Utilisateur déjà existant" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ username, email, password: hashedPassword, role });
      await user.save();

      res.json({ msg: "Utilisateur enregistré !" });
    } catch (err) {
      res.status(400).json({ msg: "Erreur d'inscription" });
    }
  }
);


//http://localhost:5002/api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Utilisateur non trouvé" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ msg: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user });
});

// Récupérer les users
//http://localhost:5002/api/auth/
router.get("/", authMiddleware(["admin"]), async (req, res) => {
  const { search } = req.query;
  const query = search
    ? { $or: [{ username: new RegExp(search, "i") }, { email: new RegExp(search, "i") }, { role: new RegExp(search, "i") }] }
    : {};
  const users = await User.find(query);
  res.json(users);
});



//http://localhost:5002/api/auth/search?search=btissam
router.get("/search", async (req, res) => {
  const { search } = req.query;

  if (!search) {
      return res.status(400).json({ msg: "Le paramètre 'search' est requis." });
  }

  try {
      const users = await User.find({
          $or: [
              { username: new RegExp(search, "i") },
              { email: new RegExp(search, "i") },
              { role: new RegExp(search, "i") }
          ]
      });

      res.json(users);
  } catch (err) {
      res.status(500).json({ msg: "Erreur lors de la recherche.", error: err.message });
  }
});

// Récupérer un user par ID

//http://localhost:5002/api/auth/id
router.get("/:id", authMiddleware(["admin"]), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });
  res.json(user);
});



//put http://localhost:5002/api/auth/id
// Modifier utilisateur (admin uniquement)
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
  const { username, email, role, isBlocked } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, isBlocked },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ msg: "Erreur de mise à jour" });
  }
});


//delete http://localhost:5002/api/auth/id
// Suppression utilisateur (admin uniquement)
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Utilisateur supprimé" });
  } catch (err) {
    res.status(400).json({ msg: "Erreur lors de la suppression" });
  }
});

//put http://localhost:5002/api/auth/block/id
// Déblocage utilisateur (admin uniquement)
router.put("/unblock/:id", authMiddleware(["admin"]), async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    if (!user.isBlocked) {
        return res.status(400).json({ msg: "L'utilisateur n'est pas bloqué." });
    }

    user.isBlocked = false;  
    await user.save();
    res.json({ msg: "Utilisateur débloqué !" });
});


// Blocage utilisateur (admin uniquement)
router.put("/block/:id", authMiddleware(["admin"]), async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    if (user.isBlocked) {
        return res.status(400).json({ msg: "L'utilisateur est déjà bloqué." });
    }

    user.isBlocked = true;  
    await user.save();
    res.json({ msg: "Utilisateur bloqué !" });
});


module.exports=router




