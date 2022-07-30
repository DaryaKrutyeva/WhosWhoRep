import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./screens/Home";
import Game from "./screens/Game";
import Confirmation from "./screens/Confirmation";
import Navigation from "./Components/nav/Navigation";

const App = () => (
  <div>
    <Navigation/>
    <Switch>
      <Route exact path="/game" component={Game} />
      <Route exact path="/confirmation" component={Confirmation} />
      <Route exact path="/" component={Home} />
    </Switch>
  </div>
);

export default App;
