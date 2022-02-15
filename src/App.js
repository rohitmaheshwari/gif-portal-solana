import React, { useState, useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState(null);

  useEffect(() => {
    const onload = async () => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener('load', onload);
    return () => window.removeEventListener('load, onload');
  }, []);

  useEffect(() => {
    if(walletAddress) {
      console.log("Fetching Gif list");
      

      setGifList(TEST_GIFS);
      console.log(gifList);
    }
  }, [walletAddress]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if(solana) {
        if(solana.isPhantom) {
          console.log("Phantom Wallet found!");

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("Connected Wallet With Public Key: ", response.publicKey.toString());

          setWalletAddress(response.publicKey.toString());
        }
        else {
          alert("Solana object not found, please install phantom wallet!");
        }
      }
    } catch(error) {
      console.error(error);
    }
  }

  const connectWallet = async () => {
    const { solana } = window;

    if(solana) {
      const response = await solana.connect();
      console.log("Connected Wallet With Public Key: ", response.publicKey.toString());s
      setWalletAddress(response.publicKey.toString());
    }
  }

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={() => connectWallet()}>
      Connect Wallet
    </button>
  );

  const onInputChange = (e) => {
    const {value} = e.target;
    setInputValue(value);
    console.log(inputValue);
  }

  const sendGif = () => {
    if(inputValue.length > 0) {
      console.log("Gif link: ", inputValue);
    }
    else {
      console.log("Empty input. Try again!");
    }
  }

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
       onSubmit={(e) => {
         e.preventDefault();
         sendGif();
       }}
      >
        <input type="text" placeholder="Enter Gif link" value={inputValue} onChange={(e) => onInputChange(e)} />
        <button className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {TEST_GIFS.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* 
            // <div className={walletAddress ? 'authed-container' : 'container'}>
            
          // </div>
          */}
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
