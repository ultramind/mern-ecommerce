import { createContext, useReducer } from 'react'
// creatng the context
export const Store = createContext()

// intial state
const intitalState = {
  cart: {
    cartItem: []
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItem: [...state.cart.cartItem, action.payload]
        }
      }
      return state
  }
}

export const StoreProvider = props => {
  const [state, dispatch] = useReducer(reducer, intitalState)
  //   distructuring the reduc
  const value = { state, dispatch }

  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
