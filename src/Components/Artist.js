import React from "react";
import styled, { keyframes } from "styled-components";
import { Keyframes } from "styled-components";




const StyledArtist = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  align-items: center;
  border: 1px;
  background-color: #9a8c98;
  border-radius: 25px;
  padding: 9px;
  box-shadow: 0 4px 8px 0 black;
  transition: 0.3s;
  

  .artistImage {
    border-width: 1px;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    box-shadow: 0 4px 8px 0 black;
  transition: 0.3s;
  }

  
`;

const Artist = ({ artistName, artistImage }) => {

  
  return (
    <StyledArtist>
      <h2 className="artistName">{artistName}</h2>
      <img src={artistImage} alt="Artist of song" className="artistImage"></img>
    </StyledArtist>
  );
};

export default Artist;
