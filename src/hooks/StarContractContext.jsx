/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, useContext, useState } from 'react'

const StarContractContext = createContext()

const StarContractProvider = ({ children }) => {
  const [starContract, setStarContract] = useState({})

  return (
    <StarContractContext.Provider value={{ starContract, setStarContract }}>
      {children}
    </StarContractContext.Provider>
  )
}

/**
 * Hook to make easy call this context
 */
function useStarContract() {
  const context = useContext(StarContractContext)

  if (!context) {
    throw new Error('The useStar hook should be used inner AccountProvider')
  }

  return context
}

export { useStarContract, StarContractProvider }
