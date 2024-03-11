import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BingoApp.css'; // Import your CSS file

const BingoGame = () => {
  const [searchParams] = useSearchParams();
  const gameCodeFromURL = searchParams.get('bcode') || 'HEelhJos';
  const [gameCode, setGameCode] = useState(gameCodeFromURL);
  const [cardData, setCardData] = useState(null);
  const [isInsideGame, setIsInsideGame] = useState(false);
  const [winStatus, setWinStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        if (!gameCode) {
          console.error('Missing gameCode parameter');
          return;
        }

        const response = await axios.get(`http://www.hyeumine.com/getcard.php?bcode=${gameCode}`);
        setCardData(response.data);
        setIsInsideGame(true);
        setWinStatus(null);
      } catch (error) {
        setIsInsideGame(false);
        console.error('Error fetching card data:', error);
      }
    };

    fetchCardData();
  }, [gameCode]);

  const handleGenerateNewPlayer = async () => {
    try {
      if (!gameCode) {
        console.error('Missing gameCode parameter');
        return;
      }

      const response = await axios.get(`http://www.hyeumine.com/getcard.php?bcode=${gameCode}`);
      setCardData(response.data);
      setWinStatus(null);
    } catch (error) {
      console.error('Error generating new player card:', error);
    }
  };

  const checkCardWin = async () => {
    try {
      if (!cardData || !cardData.playcard_token) {
        console.error('Playcard_token not found');
        return;
      }

      const response = await axios.get(`http://www.hyeumine.com/checkwin.php?playcard_token=${cardData.playcard_token}`);
      setWinStatus(response.data);
    } catch (error) {
      console.error('Error checking card win status:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameCode);
    alert(`Game code ${gameCode} copied to clipboard!`);
  };

  const renderCardDetails = () => (
    <div className="card-details">
      <p onClick={copyToClipboard} className="game-code">Game Code: {gameCode}</p>
      <h2>Card Details</h2>
      <div className="card-data">
        {cardData ? (
          Object.entries(cardData).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {JSON.stringify(value)}
            </p>
          ))
        ) : (
          <p>Loading card data...</p>
        )}
      </div>
    </div>
  );

  const renderGenerateNewPlayerButton = () => (
    <div className="button-container">
      <button className="generate-button" onClick={handleGenerateNewPlayer}>
        Generate New Player
      </button>
    </div>
  );

  const renderCheckCardWinButton = () => (
    <div className="button-container">
      <button className="check-win-button" onClick={checkCardWin}>
        Check Card Win
      </button>
      {winStatus !== null && (
        <p className="win-status">
          {winStatus === 1 ? 'Congratulations! You have a winning card!' : 'Sorry, not a winning card.'}
        </p>
      )}
    </div>
  );

  return (
    <div className="container">
      <h1>Bingo Game</h1>
      {renderCardDetails()}
      {isInsideGame && (
        <div className="button-container">
          {renderGenerateNewPlayerButton()}
          {cardData && renderCheckCardWinButton()}
        </div>
      )}
    </div>
  );
};

export default BingoGame;
