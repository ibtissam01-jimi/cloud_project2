const jwt = require("jsonwebtoken");

module.exports = (requiredRoles = []) => {
    return (req, res, next) => {
        const token = req.header("Authorization");

        if (!token) return res.status(401).json({ msg: "Accès refusé" });

        try {
            const tokenPart = token.split(" ")[1]; 
            if (!tokenPart) return res.status(400).json({ msg: "Token invalide" });

            const verified = jwt.verify(tokenPart, process.env.JWT_SECRET);
            req.user = verified; 

            if (requiredRoles.length && !requiredRoles.includes(verified.role)) {
                return res.status(403).json({ msg: "Accès interdit" });
            }

            next(); 
        } catch (err) {
            res.status(400).json({ msg: "Token invalide" });
        }
    };
};
