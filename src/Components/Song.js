// Code for playing/pausing audio from https://www.codegrepper.com/code-examples/javascript/react+play+audio+from+url

import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StyledSong = styled.div`
  border-width: 1px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  width: 800px;
  background-color: #f2e9e4;
  color: #22223b;
  border-color: #c9ada7;
  font-family: "Arimo", sans-serif;
`;

const StyledButton = styled.button`
  background-color: #22223b;
  width: 100px;
  height: 50px;
  color: #f2e9e4;
  font-family: "Arimo", sans-serif;
  border-color: #c9ada7;
  font-weight: bold;
  margin-right: 10px;

  :hover {
    color: #f2e9e4;
    background-color: black;
    box-shadow: 0 4px 8px 0 #22223b;
    transition: 0.3s;
  }
`;

const Song = ({ url }) => {
  const audio = new Audio(url);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();

    // Cleans up effect so audio will pause
    return () => audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return (
    <StyledSong>
      <h2>
        Guess the artist the song belongs to! Press the play button to hear the
        song.
      </h2>
      <div>
        <StyledButton onClick={toggle}>
          {playing ? "Pause" : "Play"}
        </StyledButton>
      </div>
    </StyledSong>
  );
};

export default Song;
