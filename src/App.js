import LoginMetamask from "./components/LoginMetamask";
import { useEffect, useState } from 'react';
import './App.css';
import SwapModal from "./components/SwapModal";
import Navbar from "./containers/Navbar";

function App() {

  // Current logged in user
  const [user, setUser] = useState('');

  // Token list from API
  const [tokens, setTokens] = useState([]);

  const handleUserSignIn = (userAddress) => {
    setUser(userAddress)
  }


  useEffect(() => {
    fetch('https://tokens.coingecko.com/uniswap/all.json')
      .then(res => res.json())
      .then(data => setTokens(data.tokens))
  }, [])

  return (
    <div className="app-bg">
      <Navbar handleUserSignIn={handleUserSignIn} user={user} />
      <h1>HOMEPAGE</h1>
      <h1>{user}</h1>
      <SwapModal tokens={tokens} user={user} />
    </div>
  );
}

export default App;
