import redisClient from "../config/reddis_connect"
import Submission from "../models/submission"
import User from "../models/users"
import validate from "../utils/validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register = async (req, res) => {

    try {
        validate(req.body)

        const { firstName, emailId, password } = req.body

        req.body.password = await bcrypt.hash(req.body.password, 10)
        req.body.role = "user"

        const user = await User.create(req.body)

        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: 'user' }, process.env.JWT_KEY, { expiresIn: '1h' })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 })
        res.status(201).send({ message: "User Registered Successfully" })

    }
    catch (err) {
        res.status(400).send(err.message)
    }

}

const adminRegister = async (req, res) => {
    try {
        validate(req.body)

        const { firstName, emailId, password } = req.body

        req.body.password = await bcrypt.hash(req.body.password, 10)

        const user = await User.create(req.body)

        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 })
        res.status(201).send({ message: "Registered Successfully" })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}


const login = async (req, res) => {
    try {
        const { emailId, password } = req.body

        if (!emailId || !password) {
            throw new Error("Invalid Credentials")
        }

        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error("Invalid Credentials")
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error("Invalid Credentials")
        }

        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 })
        res.status(200).send({ message: "Login Successful" })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}


const logout = async (req, res) => {
    try {
        const { token } = req.cookies
        const payload = jwt.decode(token)
        await redisClient.set(`token:${token}`, "Blocked")
        await redisClient.expireAt(`token:${token}`, payload.exp)

        res.cookie("token", null, { expires: new Date(Date.now()) })
        res.send("Logged out Successfully")
    }
    catch (err) {
        res.status(503).send("Error in logout: " + err.message)
    }
}


const getProfile = async (req, res) => {
    try {
        const user = req.result
        res.status(200).send({ profile: user })
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const deleteProfile = async (req, res) => {

    try {
        const userId = req.result._id
        await Submission.deleteMany({ userId })
        await User.findByIdAndDelete(userId)
        res.status(200).send("Deleted Successfully")
    }
    catch (err) {
        res.status(500).send("Error :", err)

    }
}

export { register, login, logout, adminRegister, getProfile, deleteProfile }
