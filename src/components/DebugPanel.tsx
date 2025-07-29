import React, { useState } from 'react';
import { testRegisterAPI, testLoginAPI } from '../utils/apiTest';
import './DebugPanel.css';

const DebugPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleTestRegister = async () => {
    setLoading(true);
    setResult('');
    try {
      const data = await testRegisterAPI();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setLoading(true);
    setResult('');
    try {
      const data = await testLoginAPI();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="debug-panel">
      <h3>🔧 Debug Panel</h3>
      <div className="debug-buttons">
        <button 
          onClick={handleTestRegister} 
          disabled={loading}
          className="debug-button"
        >
          {loading ? 'Testing...' : 'Test Register API'}
        </button>
        <button 
          onClick={handleTestLogin} 
          disabled={loading}
          className="debug-button"
        >
          {loading ? 'Testing...' : 'Test Login API'}
        </button>
      </div>
      
      {result && (
        <div className="debug-result">
          <h4>Result:</h4>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default DebugPanel; 