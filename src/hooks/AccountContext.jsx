/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, useContext, useState } from 'react'

const AccountContext = createContext()

const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState({})

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  )
}

/**
 * Hook to make easy call this context
 */
function useAccount() {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('The useAccount hook should be used inner AccountProvider')
  }

  return context
}

export { useAccount, AccountProvider }
