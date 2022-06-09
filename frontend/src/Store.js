import { createContext, useReducer } from 'react'
// creatng the context
export const Store = createContext()

// intial state
const intitalState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  },
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const newItem = action.payload
      // checking if item exits in the ccart
      const existItem = state.cart.cartItems.find(x => x._id === newItem._id)
      const cartItems = existItem
        ? state.cart.cartItems.map(item =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem]
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      return { ...state, cart: { ...state.cart, cartItems } }

    case 'REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        item => item._id !== action.payload._id
      )
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    // Signin case
    case 'USER_SIGNIN':
      return { ...state, userInfo: { ...state.userInfo, user: action.payload } }

    case 'USER_SIGNOUT':
      return { ...state, userInfo: null }
    default:
      return state
  }
}

export const StoreProvider = props => {
  const [state, dispatch] = useReducer(reducer, intitalState)
  //   distructuring the reduc
  const value = { state, dispatch }

  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
