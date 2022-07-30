import React, {useEffect, useState} from "react";
import Card from "../Components/Card"; 
import {Link} from "react-router-dom";
import fetchFromSpotify, {request} from "../services/api";
import "./styles/Home.Styles"
import Button from "../Components/buttons/Button";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import MyWrapperComponent from "../Components/Wrapper";



const StyledColumnDiv = styled.div`
  font-size: 1em;
  padding: 0;
  margin: 0;
  height: 100vh;
  display: flex;
  flex-flow: column wrap;
  align-content: center;
  justify-content: center;
  font-family: 'Arimo', sans-serif;

`

const StyledRowDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  margin: 1em 3em;
  font-family: 'Arimo', sans-serif;

`

const StyledInput = styled.select`
  width: 200px;
  height: 50px;
  border: 2px;
  border-color: #4a4e69;
  border-radius: 15px;
  margin: 1.1em 0;
  font-size: 1.2em;
  text-align: center;
  background-color: #22223b;
  font-family: 'Arimo', sans-serif;
  color: #f2e9e4;
  


`

const StyledTextDiv = styled.div`
  width: 100%;
  height: 100px;
  background-color: #c9ada7;
  color: #22223b;
  text-align: center;
  border: 2px;
  border-radius: 15px;
  margin: 1em 0;
  font-size: 2em;
  border-color: #4a4e69;
  font-family: 'Arimo', sans-serif;
  


`


const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const Home = (props) => {







  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(localStorage.getItem("selectedGenre"));
  const [songs] = useState([1, 2, 3]);
  const [artists] = useState([2, 3, 4]);
  const [selectedArtists, setSelectedArtists] = useState(localStorage.getItem("selectedArtists"));
  const [selectedSongs, setSelectedSongs] = useState(localStorage.getItem("selectedSongs"));
  const [authLoading, setAuthLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [token, setToken] = useState("");


  let stateData = props.location.state;
  const highscore = localStorage.getItem('highscore')

/* default values for selected number of songs and artists, and genre so the user cannot procede with a blank choice*/
if(localStorage.getItem("selectedArtists") == null){
  localStorage.setItem("selectedArtists", 2)

}

if(localStorage.getItem("selectedSongs") == null){
localStorage.setItem("selectedSongs", 1);}


if(localStorage.getItem("selectedGenre") == null){ 

  localStorage.setItem("selectedGenre", "acoustic")
}





 const targetEventGenre = (event) =>{
  
  localStorage.setItem("selectedGenre", event.target.value)
  setSelectedGenre(event.target.value)

 }

 const targetEventSong = (event) =>{
  localStorage.setItem("selectedSongs", event.target.value)

  setSelectedSongs(event.target.value)


 }

 const targetEventArtist = (event) =>{
  localStorage.setItem("selectedArtists", event.target.value)
  setSelectedArtists(event.target.value)

 }

  const loadGenres = async (t) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    setGenres(response.genres);
    setConfigLoading(false);
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
        loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({access_token, expires_in}) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setAuthLoading(false);
      setToken(newToken.value);
      loadGenres(newToken.value);
    });
  }, []);

  if (authLoading || configLoading) {
    return <Card></Card>;
  }

  return (
    <MyWrapperComponent>
      <Card>
            <StyledColumnDiv>
        <StyledRowDiv>
          <h2>Genre: </h2>
          <StyledInput
            value={selectedGenre}
            onChange={targetEventGenre}>
            <option value="" selected disabled>{localStorage.getItem("selectedGenre")}</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </StyledInput>
          <h2> Number of Songs:</h2>
          <StyledInput
            value={selectedSongs}
            onChange={targetEventSong}>
            <option value="" selected disabled>{localStorage.getItem("selectedSongs")}</option>

            {songs.map((song) => (
              <option key={song} value={song}>{song}</option>
            ))}
          </StyledInput>
          <h2>Number of Artists: </h2>
          <StyledInput
            value={selectedArtists}
            onChange={targetEventArtist}>
            <option value="" selected disabled>{localStorage.getItem("selectedArtists")}</option>

            {artists.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </StyledInput>
        </StyledRowDiv>
        <StyledColumnDiv>

        <StyledRowDiv>
          <Button buttonLabel="Let's Play Who's Who! Can you guess the correct artist?"></Button>
          <StyledTextDiv>
            <p>High Score: <span>{highscore}</span></p>
          </StyledTextDiv>
          <Link to={{
            pathname: "/game",
            state: {selectedSongs: selectedSongs, selectedArtists: selectedArtists, selectedGenre: selectedGenre}
          }}>
            <Button buttonLabel="Start"/>
          </Link> 
        </StyledRowDiv>
        </StyledColumnDiv>
        </StyledColumnDiv>

      </Card>
      </MyWrapperComponent>
  );
};

export default Home;
