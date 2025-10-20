import React from 'react'
import OrderForm from '../components/OrderForm'

const Home = ({user}) => {
  return (
    <div>
      <OrderForm user={user} />
    </div>
  )
}

export default Home