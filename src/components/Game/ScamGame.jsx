import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const ScamGame = () => {
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/messages.json');
        const data = await response.json();
        
        // Shuffle the messages for randomness
        const shuffled = [...data.messages].sort(() => 0.5 - Math.random());
        setMessages(shuffled);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleAnswer = (isScam) => {
    const currentMessage = messages[currentIndex];
    const isCorrect = (isScam && currentMessage.type === 'scam') || 
                     (!isScam && currentMessage.type === 'legitimate');
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < messages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    // Shuffle the messages again
    const shuffled = [...messages].sort(() => 0.5 - Math.random());
    setMessages(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setGameOver(false);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading game...</div>;
  }

  if (gameOver) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-primary-800 mb-4">Game Over!</h2>
        <p className="text-lg text-gray-800 mb-4">Your final score: <span className="font-bold">{score}</span> out of {messages.length}</p>
        
        {score === messages.length ? (
          <div className="bg-green-50 p-4 rounded-md mb-6">
            <p className="text-green-800 font-medium">Perfect score! You're a scam detection expert!</p>
          </div>
        ) : score >= messages.length * 0.7 ? (
          <div className="bg-green-50 p-4 rounded-md mb-6">
            <p className="text-green-800 font-medium">Great job! You're getting good at spotting scams!</p>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md mb-6">
            <p className="text-yellow-800 font-medium">Keep practicing! Spotting scams takes time to master.</p>
          </div>
        )}
        
        <button
          onClick={resetGame}
          className="bg-primary-600 text-white py-2 px-6 rounded-md hover-darker-red transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  const currentMessage = messages[currentIndex];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary-800">Scam Detection Game</h2>
        <div className="text-sm bg-gray-100 py-1 px-3 rounded-full text-gray-800 font-medium">
          Score: <span className="font-bold">{score}</span> / {currentIndex + (showResult ? 1 : 0)}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <p className="text-gray-800 font-medium mb-1">Message {currentIndex + 1} of {messages.length}:</p>
        <p className="text-gray-700 border-l-4 border-gray-300 pl-3 py-2">{currentMessage.text}</p>
      </div>
      
      {!showResult ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(true)}
            className="bg-red-100 text-red-800 border border-red-200 py-3 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Scam
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="bg-green-100 text-green-800 border border-green-200 py-3 rounded-md hover:bg-green-200 transition-colors flex items-center justify-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Legitimate
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-md ${
            currentMessage.type === 'scam' ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {currentMessage.type === 'scam' ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  currentMessage.type === 'scam' ? 'text-red-800' : 'text-green-800'
                }`}>
                  This message is {currentMessage.type === 'scam' ? 'a SCAM' : 'LEGITIMATE'}
                </h3>
                <p className="mt-2 text-sm text-gray-700">{currentMessage.explanation}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleNext}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover-darker-red transition-colors"
          >
            Next Message
          </button>
        </div>
      )}
    </div>
  );
};

export default ScamGame; 