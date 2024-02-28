import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  // useNavigate 훅 사용

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/kakaologin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password })
    });
    
    const data = await response.json();
    setIsLoading(false);
    if (response.status === 200) {
      // 로그인 성공: 메인 페이지로 이동
      navigate('/main');
    } else {
      // 로그인 실패: 에러 메시지 출력
      alert(data.error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              ID:
              <input type="text" value={id} onChange={e => setId(e.target.value)} />
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        )}
      </header>
    </div>
  );
}

export default App;
