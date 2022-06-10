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
          res.status(401).send({ message: 'Wrong email or pasword' })
        }
      } else {
        res.status(401).send({ message: 'Wrong email or pasword' })
      }
    } catch (error) {
      res.status(401).send(error)
    }
  })
)

// Signup route API
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    let user
    const { name, email, password } = req.body
    try {
      const userExist = await User.findOne({ email })
      if (userExist) {
        res.status(401).send({ message: 'Email address already exist' })
        return
      }
      const hashPassword = bcrypt.hashSync(password)
      user = new User({
        name,
        email,
        password: hashPassword,
      })
      // save into mongoDB
      user = await user.save()
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
          res.status(401).send({ message: 'Wrong email or pasword' })
        }
      } else {
        res.status(500).send({ message: 'server error' })
      }
    } catch (error) {
      res.status(401).send(error)
    }
  })
)

export default userRouter
