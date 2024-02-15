import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/home/Home.jsx";
import Main from "./pages/main/Main";
import Single from "./pages/single/Single";
import Game from "./pages/single/game/Game.js";
import Result from "./pages/single/result/Result.js";
import Signup from "./components/home/Signup.jsx";
import Multi from "./pages/multi/Multi.js";
import "./index.css";
import { RecoilRoot } from "recoil";
import Redirect from "./components/main/Redirect.js";

function App() {
  return (
    <RecoilRoot>
      <ToastContainer />
      <Router>
        <Routes>
          {/* <Route path="/hello" element={<h1>Hello</h1>} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/signUp" element={<Signup />} />

          <Route path="/single" element={<Single />} />
          <Route path="/game" element={<Game />} />
          <Route path="/single/result" element={<Result />} />

          <Route path="/multi" element={<Multi />} />
          <Route path="/redirect" element={<Redirect />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
