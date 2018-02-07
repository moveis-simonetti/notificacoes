export default (req, res, next) => {
    let contentType = req.header('Content-Type');

    if (!contentType || "application/json" !== contentType.substr(0, 16)) {
        return res.status(400).json({msg: "Apenas requisicoes json"});
    }

    next();
}

