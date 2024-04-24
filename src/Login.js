import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login_id from './ico/login_id.svg';
import Login_pw from './ico/login_pw.svg';
import Loader from './ico/Loader.svg';
import "./styles/Login.css"

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authToken') !== null;
    // 이미 인증된 경우 메인페이지로 리다이렉트
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    let timerId;

    try {
      setIsLoading(true);
      timerId = setTimeout(() => {
        setIsLoadingText(true);
      }, 5000);

      const response = await fetch("/kakaologin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password })
      });

      const data = await response.json();
      console.log(response.status);
      console.log(data);
      if (response.status === 200) {
        localStorage.setItem('authToken', "Bearer "+data.authToken);
        navigate('/main');
      } else {
        // 로그인 실패: 에러 메시지 출력
        console.log(isLoadingText);
        alert(data.error);
      }
    } catch (e) {
      setIsLoading(false);
      setIsLoadingText(false);
      alert(e);
    } finally {
      // try 또는 catch 블록이 종료되면 실행됩니다.
      clearTimeout(timerId);
      setIsLoading(false);
      setIsLoadingText(false); // setTimeout을 취소합니다.
    }
  };

  // 로그인 폼
  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? (
          <div className='lodding_div'>
            {isLoadingText ? (<span>카카오톡 앱에서 2FA 인증을 실행해주세요</span>) : (<span>카카오톡과 통신 중</span>)}

            <span><img src={Loader} /></span>
          </div>
        ) : (
          <form className='login_form' onSubmit={handleSubmit}>
            <div>
              <label>
                <input type="text" value={id} onChange={e => setId(e.target.value)} placeholder='ID' />
                <img src={Login_id} />
              </label>
              <label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='PW' />
                <img src={Login_pw} />
              </label>
            </div>
            <input type="submit" value="Submit" />
          </form>

        )}
      </header>
    </div>
  );
}

export default Login;
