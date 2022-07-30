import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Card from "../Components/Card";
import styled from "styled-components";
import Button from "../Components/buttons/Button";
import MyWrapperComponent from "../Components/Wrapper";

const StyledLink = styled(Link)`
  background-color: #9a8c98;
  border-radius: 25px;
  color: #f2e9e4;
  font-family: "Arimo", sans-serif;
  height: 45px;
  font-weight: bold;
  margin: 10px;
  border-color: #f2e9e4;
  border-width: 3px;
  display: flex;
  align-items: center;
  justify-content: center;

  :link {
    text-decoration: none;
  }

  :visited {
    text-decoration: none;
  }

  :hover {
    text-decoration: none;
  }

  :active {
    text-decoration: none;
  }

  :hover {
    color: #f2e9e4;
    background-color: #4a4e69;
    box-shadow: 0 4px 8px 0 #22223b;
    transition: 0.3s;
  }
`;

const StyledColumnDiv = styled.div`
  font-size: 1em;
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column wrap;
  align-content: center;
  justify-content: center;
  color: #22223b;
  font-family: "Arimo", sans-serif;
`;

const StyledRowDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  margin: 1em 3em;
  color: #22223b;
  font-family: "Arimo", sans-serif;
`;

const Confirmation = (props) => {
  let stateData = props.location.state;
  const finalScore = stateData["score"];
  const selectedGenre = stateData["selectedGenre"];
  const selectedArtists = stateData["selectedArtists"];
  const selectedSongs = stateData["selectedSongs"];

  const highscore = localStorage.getItem("highscore");

  return (
    <MyWrapperComponent>
      <Card>
        <StyledColumnDiv>
          <h1> Your final score is {finalScore}! </h1>
          <h2> Your high score is {highscore}.</h2>
          <StyledRowDiv>
            {" "}
            <h3> Would you like to play again?</h3>{" "}
          </StyledRowDiv>

          <StyledRowDiv>
            {" "}
            <StyledLink
              to={{
                pathname: "/game",
                state: {
                  selectedGenre: selectedGenre,
                  selectedSongs: selectedSongs,
                  selectedArtists: selectedArtists,
                },
              }}
            >
              Play Again
            </StyledLink>
            <StyledLink
              to={{
                pathname: "/",
                state: {
                  highscore: highscore,
                  selectedGenre: selectedGenre,
                  selectedSongs: selectedSongs,
                  selectedArtists: selectedArtists,
                },
              }}
            >
              Go Home
            </StyledLink>{" "}
          </StyledRowDiv>
        </StyledColumnDiv>
      </Card>
    </MyWrapperComponent>
  );
};

export default Confirmation;
