import React from "react";
import styled from "styled-components";

const StyledNav = styled.nav`
  border-radius: 25px 25px 0px 0px;
  background-color: #4a4e69;
  color: #f2e9e4;
  width: 1000px;
  height: 100px;
  border-bottom: 2px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  font-family: 'Arimo', sans-serif;

`

const StyledH1 = styled.h1`
  padding: 1.2em;
  margin: 0;
`

const Navigation = () => {
  return (
    <StyledNav>
      <StyledH1>Who's Who</StyledH1>
    </StyledNav>
  );
};

export default Navigation;
