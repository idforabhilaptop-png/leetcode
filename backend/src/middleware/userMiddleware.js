import redisClient from "../config/reddis_connect";
import jwt from "jsonwebtoken";
import User from "../models/users";

const userMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Authentication required : No token provided");
        }
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload

        if (!_id)
            throw new Error("Id is missing")

        const result = await User.findById(_id)


        if (!result)
            throw new Error("user does not exist")

        const Isblocked = await redisClient.exists(`token:${token}`)
        if (Isblocked)
            throw new Error("Invalid Token")

        req.result = result

        next()
    }

    catch (err) {
        res.status(401).send({ message: err.message });
    }
}

export default userMiddleware;