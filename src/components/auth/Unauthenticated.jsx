import React, { useState } from 'react';

export function Unauthenticated({ onLogin, onCreate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h2>Login / Register</h2>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={() => onLogin(email, password)}>Login</button>
      <button onClick={() => onCreate(email, password)}>Create Account</button>
    </div>
  );
}
