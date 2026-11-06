import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout'

function HomePage() {
  return (
    <PageLayout pageLabel="A little time, just for us">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">THE ART OF BEING TOGETHER</p>
          <h1>Make room for<br /><em>little moments.</em></h1>
          <p className="hero-description">The best dates don't need a reason. Pick a place, choose a day, and let the rest become a memory worth keeping.</p>
          <div className="hero-actions">
            <Link to="/restaurants" className="button button-dark">Plan our next date <span>↗</span></Link>
            <Link to="/invitations" className="text-link">See our plans <span>→</span></Link>
          </div>
          <div className="hero-note"><span className="note-heart">♥</span><span><b>Just the two of us</b><small>One date at a time.</small></span></div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=90" alt="An intimate candlelit dinner table" />
          <div className="image-caption"><span>01 / THE EVENING</span><b>Somewhere special. With someone special.</b></div>
          <div className="floating-stamp">made<br />with ♥</div>
        </div>
      </section>
      <section className="home-bottom">
        <div><span className="section-number">01</span><h2>Thoughtful plans.<br /><em>Beautiful memories.</em></h2></div>
        <p>From choosing the perfect spot to keeping track of every plan, this little space is all about making time for each other.</p>
        <Link to="/restaurants" className="round-link" aria-label="Plan a date">↗</Link>
      </section>
    </PageLayout>
  );
}

export default HomePage;
