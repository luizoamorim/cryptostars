import React from 'react'
import GlobalStyles from '../src/styles/globalStyles'

export const decorators = [
  (Story) => (
    <>
      <GlobalStyles />
      <Story />
    </>
  )
]
