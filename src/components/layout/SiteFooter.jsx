export function SiteFooter({ onLogout }) {
  return (
    <footer className="site-footer">
      <button type="button" className="btn btn-ghost footer-logout" onClick={onLogout}>
        Log out
      </button>
      <span className="footer-copy">© {new Date().getFullYear()} Elkjærvegen 28</span>
    </footer>
  );
}
