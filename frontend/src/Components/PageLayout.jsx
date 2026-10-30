function PageLayout({ children }) {
  return (
    <main className="invitation-page">
      <section className="invitation-card">
        {children}

        <p className="footer-message">
          Made with love, just for you.
        </p>
      </section>
    </main>
  );
}

export default PageLayout;