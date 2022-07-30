import styled from "styled-components"
import React from "react";

const StyledButton = styled.button`
  width: 400px;
  height: 70px;
  border-width: 2px;
  border-color: #4a4e69;
  border-radius: 15px;
  background: #9a8c98;
  font-family: 'Arimo', sans-serif;
  font-weight: bold;

  font-size: 1.2em;
`
const Button = ({buttonLabel, click}) => {
  return (
    <StyledButton onClick={() => click}>{buttonLabel}</StyledButton>
  )
}

export default Button