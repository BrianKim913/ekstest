import React, { useState } from 'react';


const styles = `
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    padding: 16px;
    font-family: Arial, sans-serif;
  }
  
  .quote-box {
    width: 100%;
    max-width: 500px;
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 24px;
    color: #333;
  }
  
  .button {
    width: 100%;
    padding: 12px 16px;
    background-color: #4361ee;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .button:hover {
    background-color: #3a56d4;
  }
  
  .button:disabled {
    background-color: #9ba4df;
    cursor: not-allowed;
  }
  
  .error {
    margin-top: 16px;
    padding: 12px;
    background-color: #ffdddd;
    color: #d8000c;
    border-radius: 4px;
  }
  
  .quote-content {
    margin-top: 24px;
    padding: 16px;
    border: 1px solid #e1e4e8;
    border-radius: 4px;
  }
  
  .quote-text {
    font-size: 18px;
    font-weight: 500;
    font-style: italic;
    color: #333;
    line-height: 1.5;
  }
  
  .quote-author {
    margin-top: 12px;
    text-align: right;
    color: #666;
  }
`;

const QuoteGenerator = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/loadtest');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const text = await response.text();
      setQuote(text);
      setAuthor('Spring Boot API');
    } catch (error) {
      console.error('에러:', error);
      setError('에러가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="quote-box">
          <h1 className="title">Terraform-EKS-react-springboot-test</h1>
          <p style={{textAlign: 'center', marginBottom: '16px'}}>api test</p>
          <button
            onClick={fetchQuote}
            disabled={loading}
            className="button"
          >
            {loading ? 'Loading...' : 'Get Quote'}
          </button>
          
          {error && (
            <div className="error">
              {error}
            </div>
          )}
          
          {quote && !error && (
            <div className="quote-content">
              <p className="quote-text">"{quote}"</p>
              {author && (
                <p className="quote-author">— {author}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuoteGenerator;