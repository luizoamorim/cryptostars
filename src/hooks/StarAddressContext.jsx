/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, useContext, useState } from 'react'

const StarAddressContext = createContext()

const StarAddressProvider = ({ children }) => {
  const [starAddress, setStarAddress] = useState({})

  return (
    <StarAddressContext.Provider value={{ starAddress, setStarAddress }}>
      {children}
    </StarAddressContext.Provider>
  )
}

/**
 * Hook to make easy call this context
 */
function useStarAddressContext() {
  const context = useContext(StarAddressContext)

  if (!context) {
    throw new Error('The useStar hook should be used inner AccountProvider')
  }

  return context
}

export { useStarAddressContext, StarAddressProvider }
