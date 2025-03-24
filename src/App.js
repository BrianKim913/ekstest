import React, { useState, useEffect } from 'react';

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
 margin-bottom: 12px;
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
 .input-field {
 width: 100%;
 padding: 10px;
 margin-bottom: 16px;
 border: 1px solid #ddd;
 border-radius: 4px;
 }
 .event-list {
 margin-top: 20px;
 width: 100%;
 }
 .event-item {
 padding: 12px;
 border: 1px solid #e1e4e8;
 border-radius: 4px;
 margin-bottom: 8px;
 }
 .event-title {
 font-weight: bold;
 margin-bottom: 4px;
 }
 .event-detail {
 color: #666;
 }
`;

const QuoteGenerator = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [dbStatus, setDbStatus] = useState('');

  // Load events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

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
      setError('로드 테스트 에러가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const submitEvent = async () => {
    if (!title || !detail) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          detail
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setDbStatus(`이벤트가 성공적으로,저장되었습니다. ID: ${result.id}`);
      
      // Clear the form
      setTitle('');
      setDetail('');
      
      // Refresh the events list
      fetchEvents();
    } catch (error) {
      console.error('데이터베이스 저장 에러:', error);
      setError('데이터베이스 저장 중 에러가 발생했습니다. 다시 시도해주세요.');
      setDbStatus('데이터베이스 연결 실패');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/retrieve');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
      setDbStatus('데이터베이스 연결 성공');
    } catch (error) {
      console.error('데이터베이스 조회 에러:', error);
      setDbStatus('데이터베이스 연결 실패');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="quote-box">
          <h1 className="title">Terraform-EKS-react-springboot-test</h1>
          <p style={{ textAlign: 'center', marginBottom: '16px' }}>API/DB 테스트 패널</p>

          {/* Load Test Button */}
          <button
            onClick={fetchQuote}
            disabled={loading}
            className="button"
          >
            {loading ? 'Loading...' : '(ALB)Ingress->EKS [FE{React}->BE{Spring Boot}] 통신 test'}
          </button>

          {/* DB Connection Status */}
          {dbStatus && (
            <p style={{ textAlign: 'center', margin: '10px 0', color: dbStatus.includes('실패') ? '#d8000c' : '#2e7d32' }}>
              {dbStatus}
            </p>
          )}

          {/* DB Form */}
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>데이터베이스 테스트</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="input-field"
            />
            <input
              type="text"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="내용"
              className="input-field"
            />
            <button
              onClick={submitEvent}
              disabled={loading}
              className="button"
            >
              {loading ? 'Saving...' : '데이터베이스에 저장'}
            </button>
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="button"
            >
              {loading ? 'Loading...' : '데이터 조회하기'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* Load Test Results */}
          {quote && !error && (
            <div className="quote-content">
              <p className="quote-text">"{quote}"</p>
              {author && (
                <p className="quote-author">— {author}</p>
              )}
            </div>
          )}

          {/* Event List */}
          {events.length > 0 && (
            <div className="event-list">
              <h3 style={{ marginBottom: '12px' }}>저장된 이벤트:</h3>
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-title">{event.title}</div>
                  <div className="event-detail">{event.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuoteGenerator;