import { NavLink, Link } from 'react-router-dom';

function PageLayout({ children, pageLabel = 'A little time, just for us' }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Date Night home">
          <span className="brand-mark">d<span>n</span></span>
          <span className="brand-name">date night<small>MADE FOR TWO</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/restaurants">Plan a date</NavLink>
          <NavLink to="/invitations">Our dates</NavLink>
        </nav>
        <Link className="header-cta" to="/restaurants">Let's plan <span>↗</span></Link>
      </header>

      <main className="page-content">
        <div className="page-kicker"><span />{pageLabel}</div>
        {children}
      </main>

      <footer className="site-footer">
        <span>date night <b>♥</b></span>
        <span>Made with love, just for you.</span>
        <span>THE BEST PLANS ARE MADE TOGETHER</span>
      </footer>
    </div>
  );
}

export default PageLayout;
