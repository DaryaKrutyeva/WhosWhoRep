import React, { useState } from "react";
import { Link, useLocation, Redirect } from "react-router-dom";
import { useEffect } from "react";
import fetchFromSpotify, { request } from "../services/api";
import Card from "../Components/Card";
import Song from "../Components/Song";
import ArtistContainer from "../Components/ArtistContainer";
import Artist from "../Components/Artist";
import { pick } from "lodash";
import styled from "styled-components";
import MyWrapperComponent from "../Components/Wrapper";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const StyledButton = styled.button`
  background-color: #9a8c98;
  border-radius: 25px;
  border-color: #f2e9e4;
  color: #f2e9e4;
  font-family: "Arimo", sans-serif;
  width: ${({ width }) => width};
  :focus {
    color: #f2e9e4;
    background-color: #4a4e69;
  }
`;
const StyledSubmit = styled.button`
  background-color: #9a8c98;
  border-radius: 25px;
  border-color: #f2e9e4;
  color: #f2e9e4;
  font-family: "Arimo", sans-serif;
  box-shadow: 0 4px 8px 0 #22223b;
  transition: 0.3s;
  padding: 10px;
  :hover {
    color: #f2e9e4;
    background-color: #4a4e69;
    box-shadow: 0 4px 8px 0 #22223b;
    transition: 0.3s;
  }
`;

const StyledLink = styled(Link)`
  background-color: #9a8c98;
  border-radius: 25px;
  border-color: #f2e9e4;
  color: #f2e9e4;
  font-family: "Arimo", sans-serif;
  box-shadow: 0 4px 8px 0 #22223b;
  transition: 0.3s;
  :hover {
    color: #f2e9e4;
    background-color: #4a4e69;
    box-shadow: 0 4px 8px 0 #22223b;
    transition: 0.3s;
  }

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
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  position: relative;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 2px;
  margin-bottom: 10px;
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
`;

const StyledRowDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  margin: 1em 3em;
`;
const Game = (props) => {
  /*    STATE     */

  // Format of each question: {previewUrl: str, answerOptions: [{artistName: str, artistImage: str, isCorrect: bool}]}
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [pickedAnswer, setPickedAnswer] = useState(0);
  const [endOfQuiz, setEndOfQuiz] = useState(false);

  const [authLoading, setAuthLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [token, setToken] = useState("");
  const [loading, isLoading] = useState(false);

  /* VARIABLES */
  let stateData = props.location.state;
  const numSongs = stateData["selectedSongs"];

  const numArtists = stateData["selectedArtists"];

  const genreData = stateData["selectedGenre"];

  let highscore = localStorage.getItem("highscore");

  //** FETCH SONGS */
  const loadSongs = async (t) => {
    setConfigLoading(true);

    // Limit is high because not all tracks have preview_urls and we need to filter those out
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations?seed_genres=" + genreData + "&limit=" + 100,
    });

    // Filter out tracks with no preview_urls
    const tracks = response.tracks.filter(
      (tracks) => tracks.preview_url != null
    );

    let currTrackIdx = 0;

    for (let i = 0; i < numSongs; i++) {
      const previewUrl = tracks[currTrackIdx].preview_url;
      const answerOptions = [];

      for (let j = 0; j < numArtists; j++) {
        const artistId = tracks[j + currTrackIdx].artists[0].id;

        // Artist image isn't in recommendations endpoint; need to access artist endpoint directly to get that
        const response = await fetchFromSpotify({
          token: t,
          endpoint: "artists/" + artistId,
        });

        if (j === 0) {
          answerOptions.push({
            artistName: response.name,
            artistImage: response.images[0]?.url,
            isCorrect: true,
          });
        } else {
          answerOptions.push({
            artistName: response.name,
            artistImage: response.images[0]?.url,
            isCorrect: false,
          });
        }
      }

      currTrackIdx += parseInt(numArtists);

      setQuestions((arr) => [
        ...arr,
        {
          previewUrl: previewUrl,
          answerOptions: answerOptions,
        },
      ]);
    }

    setConfigLoading(false);
  };

  if (localStorage.getItem("highscore" == NaN)) {
    localStorage.setItem("highscore", 0);
  }
  const onClick = () => {
    if (score >= localStorage.getItem("highscore")) {
      localStorage.setItem("highscore", score + 1);
    }

    submitAnswer(pickedAnswer);
  };

  //** EVALUATE ANSWER AND MOVE TO NEXT QUESTION */
  const submitAnswer = (answer) => {
    const isAnswerCorrect =
      questions[currentQuestion].answerOptions[answer].isCorrect;
    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setEndOfQuiz(true);
    }
  };

  useEffect(() => {
    setAuthLoading(true);

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        setAuthLoading(false);
        setToken(storedToken.value);
        loadSongs(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setAuthLoading(false);
      setToken(newToken.value);
      loadSongs(newToken.value);
    });
  }, []);

  if (authLoading || configLoading || loading) {
    return <Card></Card>;
  }

  return (
    <MyWrapperComponent>
      <Card>
        {endOfQuiz ? (
          <StyledLink
            to={{
              pathname: "/confirmation",
              state: {
                score: score,
                highscore: highscore,
                selectedSongs: numSongs,
                selectedArtists: numArtists,
                selectedGenre: genreData,
              },
            }}
          >
            {" "}
            <h3>See Results of Quiz</h3>
          </StyledLink>
        ) : (
          <StyledColumnDiv>
            <StyledRowDiv>
              <Song url={questions[currentQuestion]?.previewUrl}></Song>
            </StyledRowDiv>

            <ArtistContainer>
              {questions[currentQuestion]?.answerOptions.map((answer, i) => (
                <StyledButton
                  width={`${95 / numArtists}%`}
                  key={i}
                  onClick={() => setPickedAnswer(i)}
                >
                  <Artist
                    artistName={answer.artistName}
                    artistImage={answer.artistImage}
                  ></Artist>
                </StyledButton>
              ))}
            </ArtistContainer>

            <StyledRowDiv>
              <StyledSubmit onClick={onClick}>
                <h3>Submit Answer</h3>
              </StyledSubmit>
            </StyledRowDiv>
          </StyledColumnDiv>
        )}
      </Card>
    </MyWrapperComponent>
  );
};

export default Game;
