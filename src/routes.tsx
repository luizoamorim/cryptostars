import { Header } from 'components/Login/styles'
import MyStars from 'components/MyStars'
import { AccountProvider } from 'hooks/AccountContext'
import { StarContractProvider } from 'hooks/StarContractContext'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Login from './components/Login'
import StarsForSale from './components/StarsForSale'

const Routes = () => {
  return (
    <BrowserRouter>
      <AccountProvider>
        <StarContractProvider>
          <ToastContainer />
          <Route component={Login} path="/" exact />
          <Route component={MyStars} path="/mystars" exact />
          <Route component={StarsForSale} path="/starsforsale" exact />
        </StarContractProvider>
      </AccountProvider>
    </BrowserRouter>
  )
}

export default Routes
