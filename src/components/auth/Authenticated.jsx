import React from 'react';

export function Authenticated({ userEmail, onLogout }) {
  return (
    <div>
      <h2>Welcome {userEmail}</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
