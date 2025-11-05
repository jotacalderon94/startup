import React from 'react';
import { AuthState } from '../components/auth/authState.js';
import { Unauthenticated } from '../components/auth/Unauthenticated.jsx';
import { Authenticated } from '../components/auth/Authenticated.jsx';

export default function Login({ userEmail, authState, onAuthChange }) {

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      onAuthChange(email, AuthState.Authenticated);
    }
  }

  async function create(email, password) {
    const res = await fetch('/api/auth/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      onAuthChange(email, AuthState.Authenticated);
    }
  }

  async function logout() {
    const res = await fetch('/api/auth/logout', { method: 'DELETE' });
    if (res.ok) {
      onAuthChange('', AuthState.Unauthenticated);
    }
  }

  return (
    <main className="container">
      {authState === AuthState.Authenticated && (
        <Authenticated userEmail={userEmail} onLogout={logout} />
      )}

      {authState !== AuthState.Authenticated && (
        <Unauthenticated onLogin={login} onCreate={create} />
      )}
    </main>
  );
}
