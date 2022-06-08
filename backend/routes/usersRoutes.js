import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/UserModel.js'
import { generateToken } from '../utils.js'

const userRouter = express.Router()

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    let user
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email: email })
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user)
          })
          return
        } else {
          res.status(401).send({ message: 'Wrong email or pasword1' })
        }
      } else {
        res.status(401).send({ message: 'Wrong email or pasword2' })
      }
    } catch (error) {
      res.status(401).send(error)
    }
  })
)

export default userRouter
