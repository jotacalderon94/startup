import React from 'react'

export default function About() {
  return (
    <main className="container">
      <section>
        <h2>My Goal</h2>
        <p>
          I am not good at tracking my tasks if I don't have them written down.
          That's why I created HabitBuddy — so others like me can benefit from it too.
        </p>
      </section>

      <section>
        <h2>Our Team</h2>
        <p>
          Just me haha — Jose Calderon. I’m adding this just to fulfill the
          requirement of point 2 on the "deliverables."
          <br /><br />
          Here is also my repo:{' '}
          <a href="https://github.com/jotacalderon94/startup.git">
            My GitHub startup repo
          </a>
        </p>
        <img
          className="team-member"
          src="/images/Jose.jpg"
          alt="Jose Calderon"
        />
        </section>
    </main>
  )
}