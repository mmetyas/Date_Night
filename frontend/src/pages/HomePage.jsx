
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="invitation-page">
      <section className="invitation-card">
        <div className="heart-icon">♥</div>

        <p className="eyebrow">A LITTLE SURPRISE FOR YOU</p>

        <h1>
          Date Night
          <span>Just Us Two</span>
        </h1>

        <p className="invitation-message">
          I'd love to take you on a special date.
          Pick the place and date, and I'll take care of the rest.
        </p>

        <div className="home-actions">
          <Link to="/restaurants" className="invitation-button">
            Plan Our Date ❤️
          </Link>

          <Link to="/invitations" className="invitation-button">
            View Our Planned Dates 💕
          </Link>
        </div>

        <p className="footer-message">
          Made with love, just for you.
        </p>
      </section>
    </main>
  );
}

export default HomePage;
