import styled from "styled-components"

import React from "react";

const StyledCard = styled.div`

height: 550px;
width: 1000px;
background: #c9ada7;
border: 2px;
border-color: #4a4e69;
border-radius: 0px 0px 25px 25px;
display: flex;
align-items: center;
justify-content: center;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;`


const Card = (props) => {

  return (
    <StyledCard> {props.children} </StyledCard>
  )


}
export default Card;