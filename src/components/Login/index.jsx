/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-else-if */
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import logo from '../../assets/jackpot.svg'
import './styles.ts'
import 'react-toastify/dist/ReactToastify.css'
import { DivButton, Header, Image, Wrapper } from './styles'

import Web3 from 'web3'

const Login = () => {
  const history = useHistory()

  const handleLogin = () => {
    history.push('/mystars')
  }

  useEffect(() => {
    loadWeb3()
  }, [])

  const loadWeb3 = async () => {
    if (window.web3) {
      window.web3 = new Web3(window.ethereum)
      // await window.ethereum.enable()
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  }

  return (
    <Wrapper>
      <Header>
        <h1>Cryptostars</h1>
        <Image src={logo} alt="logo" />
        <p>You can have your own star</p>
        {window.web3 && (
          <DivButton className="Login-go-btn" onClick={handleLogin}>
            <p>Enter this universe</p>
          </DivButton>
        )}
        {!window.web3 && (
          <p className="warn">You need a metamask account to use this app</p>
        )}
      </Header>
    </Wrapper>
  )
}

export default Login
