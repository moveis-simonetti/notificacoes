export default (req, res, next) => {
    if (!req.body.identificacao) {
        return res.status(400).json({msg: "Por favor, informe a identificacao do evento!"});
    }

    next();
}