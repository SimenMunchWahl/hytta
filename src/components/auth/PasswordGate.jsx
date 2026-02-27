import { useState } from "react";

export function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const ok = onUnlock(password);

    if (ok) {
      setError("");
      return;
    }

    setError("Wrong password. Try again.");
  };

  return (
    <div className="gate-shell">
      <div className="gate-panel">
        <h1 className="gate-title">Elkjærvegen 28</h1>

        <form className="gate-form" onSubmit={handleSubmit}>
          <label htmlFor="gate-password" className="gate-label">
            Passord
          </label>
          <input
            id="gate-password"
            type="password"
            className="gate-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />

          <button type="submit" className="btn btn-primary gate-submit">
            Enter
          </button>

          {error ? <p className="gate-error">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
