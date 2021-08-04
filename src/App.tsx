import { StarAddressProvider } from 'hooks/StarAddressContext'
import React from 'react'
import Routes from './routes'
import GlobalStyles from './styles/globalStyles'

function App() {
  return (
    <div className="App">
      <GlobalStyles />
      <div test-id="LoginComponent" className="App-header">
        <StarAddressProvider>
          <Routes />
        </StarAddressProvider>
      </div>
    </div>
  )
}

export default App
