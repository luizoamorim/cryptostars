import { useHistory } from 'react-router-dom'
import { Wrapper } from './styles'
import { BiPlanet } from 'react-icons/bi'

const SiteHead = () => {
  let history = useHistory()

  const goToMyStars = () => {
    history.push('/mystars')
  }

  const goToStarsForSale = () => {
    history.push('/starsforsale')
  }

  const goBackToHome = () => {
    history.push('/')
  }

  return (
    <Wrapper>
      <div className="menu">
        <h3 onClick={() => goToMyStars()}>My stars</h3>
        <h3 onClick={() => goToStarsForSale()}>Stars For Sale</h3>
      </div>
      <div
        className="menu-right"
        title="Back to home"
        onClick={() => goBackToHome()}
      >
        <BiPlanet size={60} />
      </div>
    </Wrapper>
  )
}

export default SiteHead
