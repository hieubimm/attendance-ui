import React from 'react';
import '../../styles/components/Welcome.css';

interface WelcomeProps {
  name?: string;
}

const Welcome: React.FC<WelcomeProps> = ({ name = 'Developer' }) => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="welcome-container">
      <h1>Chào mừng bạn đến với ReactJS! 👋</h1>
      <p>Xin chào, {name}!</p>
      
      <div className="counter-section">
        <p>Bạn đã click {count} lần</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="counter-button"
        >
          Click me! 🎯
        </button>
      </div>

      <div className="features">
        <h3>✨ Tính năng của project này:</h3>
        <ul>
          <li>✅ TypeScript support</li>
          <li>✅ Hot reload</li>
          <li>✅ CSS styling</li>
          <li>✅ Component-based architecture</li>
          <li>✅ State management với useState</li>
        </ul>
      </div>
    </div>
  );
};

export default Welcome; 