import styled from 'styled-components'

export const Wrapper = styled.div`
  text-align: center;
`
export const Header = styled.header`
  background-color: #812f79;
  background-image: linear-gradient(#812f79, #380334);
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;

  .warn {
    background: #ddd;
    opacity: 0.8;
    padding: 0.4rem 1.4rem;
    border-radius: 5px;
    font-size: 20px;
    color: #e73317;

    &:hover {
      background-color: #fff;
      color: #e73317;
      opacity: 0.7;
      cursor: pointer;
    }
  }
`

export const DivButton = styled.div`
  background-color: #91498b;
  opacity: 0.5;
  margin-top: calc(30px + 2vmin);
  border: 1px solid #91498b;
  border-radius: 15px;
  min-width: 25vh;
  font-size: 25px;

  &:hover {
    background-color: #fff;
    color: #ff6ff3;
    opacity: 0.7;
    cursor: pointer;
  }
`
export const Image = styled.img`
  height: 40vmin;
  pointer-events: none;
`

/*
@media (prefers-reduced-motion: no-preference) {
    .Login-logo {
        animation: Login-logo-spin infinite 20s linear;
    }
}

@keyframes Login-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  } */
