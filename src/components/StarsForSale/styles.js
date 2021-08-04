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

  font-size: calc(10px + 2vmin);
  color: white;

  .siteHeadStyles {
    width: 100vw;
  }

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

export const Row = styled.div`
  margin-top: 5%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
  width: 100%;
`

export const WrapperModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const StarModal = styled.div`
  height: 50%;
  width: 50%;
  background-color: #fff;
  border: 1px solid #333;
  border-radius: 15px;
  position: absolute;

  .modalHead {
    color: #333;
    display: flex;
    justify-content: flex-end;
    padding: 5px;

    button {
      border-radius: 5px;
      border: 0px;
      background-color: #e34839;
      padding: 4px 8px;
      margin-right: 3px;
      margin-top: 2px;
      color: #fff;
      font-weight: bold;

      :hover {
        opacity: 90%;
        cursor: pointer;
      }
    }
  }

  .modalBody {
    color: #333;
  }

  .modalFoot {
    display: flex;
    justify-content: center;
    padding: 10px;

    .modalBtn {
      border-radius: 5px;
      border: 1px solid;
      background-color: #ddd;
      padding: 1px 8px;
      color: #999;
      font-weight: bold;

      display: flex;
      flex-direction: row;

      :hover {
        opacity: 90%;
        cursor: pointer;
      }
    }
  }
`

export const Stars = styled.div`
  display: flex;

  .row__inner {
    transition: 450ms transform;
    font-size: 0;
    white-space: nowrap;
    margin: ($tileHeight / 2) 0;
    padding-top: 10px; // Account for OS X scroll bar
    padding-bottom: 10px; // Account for OS X scroll bar

    &:hover {
      transform: translate3d($moveLeft, 0, 0);
    }
  }

  .tile {
    background-color: #fff;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    font-size: 20px;
    cursor: pointer;
    transition: 450ms all;
    transform-origin: center left;

    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px #fff;
    border-radius: 5px;

    &:hover {
      transform: scale(1.2);
      margin-right: 40px;
      opacity: 0.7;
    }
  }
`

export const FormStar = styled.div`
  margin-top: calc(30px + 4vmin);

  input {
    margin-bottom: 15px;
    width: 80%;
    border-radius: 5px;
    border: 0px;
    font-size: 25px;
    padding: 5px;
    color: #555;

    &:focus {
      outline: none;
    }
  }
`

export const DivButton = styled.div`
  background-color: #91498b;
  opacity: 0.5;
  border: 1px solid #91498b;
  border-radius: 15px;
  width: 25vw;
  font-size: 25px;

  &:hover {
    background-color: #fff;
    color: #ff6ff3;
    opacity: 0.7;
    cursor: pointer;
  }
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
