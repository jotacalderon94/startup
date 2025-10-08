import React from 'react'
export default function Realtime() {
  return (
    <main className="container">
      <section>
      <h2>Friends Strike</h2>
      <div id="friend-list">
        <ul>
          <li>Matt M has a strike of 5 days!!</li>
        </ul>
      </div>

      <div>
        <label for="comment">Comment:</label>
        <textarea id="comment" name="user_comment" rows="5" required></textarea>
      </div>
    </section>
    </main>
  )
}