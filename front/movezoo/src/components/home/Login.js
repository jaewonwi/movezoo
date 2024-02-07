import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // sessionId가 변경될 때마다 실행되는 부분
    if (sessionId) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [sessionId]);

  const handleLogin = async () => {
    try {
      // Use FormData to send data as form data
      const formData = new FormData();
      formData.append('userEmail', username); // or 'useremail' depending on your backend
      formData.append('password', password);

      // Send the login request with form data
      // 백엔드에서 로그인성공시 200코드를 내려준는데, 실패시 401코드를 내려준다. axios요청은 200번대가 아니면 error로 간주
      const response = await axios.post('https://i10e204.p.ssafy.io/api/login', formData, {
        withCredentials: true,
      });

      console.log(response);
      console.log("------------------------");
      console.log(response.data);
      console.log("------------------------");
      console.log(response.data.success);
      console.log("------------------------");
      console.log(response.status);
      // API response handling
      if (response.status === 200) {
        setSessionId(response.data.sessionId); // 세션 식별자 저장

      // 로그인 요청 후 1초 동안 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));

        navigate('/main');
      } else {
        alert('id 또는 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('로그인에 실해했습니다.', error);
      alert('로그인 실패.');
    }
  };

  return (
    <div>
      <h1 className='login'>Login</h1>
      <form>
        <label className='id'>
          아이디:
          <input
            className='logininput'
            type="text"
            name="userEmail"
            placeholder='User-Email'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label className='password'>
          비밀번호:
          <input
            className='logininput'
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button className='loginbt' type="button" onClick={handleLogin}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;