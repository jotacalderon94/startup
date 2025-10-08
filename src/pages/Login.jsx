import React from 'react'

export default function Login() {
  return (
    <main className="container">
      <section id="auth">
      <h2>User Authentication</h2>
      <form>
        <label>Username: <input type="text" /></label>
        <label>Password: <input type="password" /></label>
        <button type="submit">Login</button>
      </form>
      <p className="userWelcome">Welcome Jose C</p>
    </section>
    </main>
  )
}