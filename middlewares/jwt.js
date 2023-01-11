const jwt = require("jsonwebtoken");

module.exports.generateAuthToken =(user) => {
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
        { _id: user._id, name: user.name, email: user.email },
        jwtSecretKey
    );
    return token;
};

module.exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;
        return userId
    } catch (err) {
    console.log(err.message);
    }
};
