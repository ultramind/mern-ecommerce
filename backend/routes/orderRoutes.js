import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Order from '../models/OrderModel.js'
import User from '../models/UserModel.js'
import { isAuth } from '../utils.js'

const orderRouter = express.Router()

// route to create order
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map(x => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemPrice: req.body.itemPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id
    })
    try {
      const order = await newOrder.save()
      res.status(201).send({ message: 'Order created', order })
    } catch (error) {res.status(401).send(error)}
  })
)
// route to fetch order by Id
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.status(200).send(order)
      }else{
        res.status(404).send({message: 'Order not found'});
      }
      res.status(201).send({ message: 'Order created', order })
    } catch (error) {res.status(401).send(error)}
  })
)

export default orderRouter
