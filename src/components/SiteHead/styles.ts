import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #702469; /* For browsers that do not support gradients */

  padding: 0 5rem;

  .menu {
    display: flex;
    justify-content: space-between;
  }

  .menu-right {
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
      color: #ddd;
      cursor: pointer;
    }
  }

  h3 {
    color: #fff;
    font-weight: bold;
    margin-left: 5rem;

    :hover {
      color: #ddd;

      cursor: pointer;
    }
  }
`
