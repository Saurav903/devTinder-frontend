import { useCallback, useEffect, useMemo, useState } from "react";
import { devTinderApi } from "./api";
import "./App.css";

const navItems = [
  { id: "discover", label: "Discover", icon: "✦" },
  { id: "requests", label: "Requests", icon: "↙" },
  { id: "connections", label: "Connections", icon: "◎" },
  { id: "profile", label: "My profile", icon: "◒" },
];

function profileFields(user = {}) {
  return {
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
    photoUrl: user.photoUrl || "",
    skills: Array.isArray(user.skills)
      ? user.skills.join(", ")
      : user.skills || "",
  };
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "DT"
  );
}

function Avatar({ user, size = "medium" }) {
  const label = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return user?.photoUrl ? (
    <img
      className={`avatar avatar--${size}`}
      src={user.photoUrl}
      alt={label ? `${label}'s profile` : ""}
    />
  ) : (
    <span
      className={`avatar avatar--${size} avatar--fallback`}
      aria-label={label || "DevTinder user"}
    >
      {getInitials(label)}
    </span>
  );
}

function Notice({ notice, onDismiss }) {
  if (!notice) return null;
  return (
    <div className={`notice notice--${notice.type || "info"}`} role="status">
      <span>{notice.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss message">
        ×
      </button>
    </div>
  );
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;
      if (mode === "login") await devTinderApi.login(body);
      else await devTinderApi.signup(body);
      if (mode === "signup") {
        setMode("login");
        setForm((current) => ({ ...current, password: "" }));
        setError("Account created. Sign in to start connecting.");
        return;
      }
      onAuthenticated({
        firstName: form.firstName || form.email.split("@")[0] || "Developer",
        lastName: form.lastName,
        email: form.email,
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <a className="brand brand--large" href="/" aria-label="DevTinder home">
          <span className="brand-mark">&lt;/&gt;</span>
          <span>devtinder</span>
        </a>
        <p className="eyebrow">Build your dev circle</p>
        <h1>Find people you’ll love building with.</h1>
        <p className="intro-copy">
          Meet developers, swap ideas, and turn mutual interest into a real
          connection.
        </p>
        <div className="stat-row">
          <div>
            <strong>01</strong>
            <span>One tap to connect</span>
          </div>
          <div>
            <strong>∞</strong>
            <span>Possibilities to build</span>
          </div>
        </div>
      </section>
      <section className="auth-card-wrap">
        <div className="auth-card">
          <p className="auth-kicker">
            {mode === "login" ? "Welcome back" : "Join the network"}
          </p>
          <h2>
            {mode === "login"
              ? "Pick up where you left off."
              : "Start meeting your people."}
          </h2>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Sign in to browse your next great collaboration."
              : "Create your DevTinder account in a minute."}
          </p>
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <div className="field-row">
                <label>
                  First name
                  <input
                    required
                    minLength="4"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    placeholder="Ada"
                  />
                </label>
                <label>
                  Last name
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    placeholder="Lovelace"
                  />
                </label>
              </div>
            )}
            <label>
              Email address
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button--primary button--wide"
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}{" "}
              <span>→</span>
            </button>
          </form>
          <p className="auth-switch">
            {mode === "login" ? "New around here?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

function DeveloperCard({ developer, onAction, pending }) {
  const skills = developer.skills?.slice(0, 4) || [];
  return (
    <article className="developer-card">
      <div className="card-photo-wrap">
        <Avatar user={developer} size="card" />
        <span className="availability">
          <i /> Available to connect
        </span>
      </div>
      <div className="developer-card__body">
        <div className="developer-card__headline">
          <div>
            <h3>
              {developer.firstName} {developer.lastName}
            </h3>
            {developer.age && <span>{developer.age} years old</span>}
          </div>
          {developer.gender && (
            <span className="gender-pill">{developer.gender}</span>
          )}
        </div>
        <p className="developer-about">
          {developer.about ||
            "Developer looking for their next great build partner."}
        </p>
        <div className="skill-list">
          {skills.length ? (
            skills.map((skill) => <span key={skill}>{skill}</span>)
          ) : (
            <span>curious builder</span>
          )}
        </div>
        <div className="card-actions">
          <button
            className="button button--ghost"
            type="button"
            disabled={pending}
            onClick={() => onAction(developer, "ignore")}
          >
            Skip
          </button>
          <button
            className="button button--primary"
            type="button"
            disabled={pending}
            onClick={() => onAction(developer, "interested")}
          >
            {pending ? "Sending…" : "Connect"} <span>↗</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ title, body, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">✦</span>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}

function Discover({ setNotice }) {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const loadFeed = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await devTinderApi.getFeed({ limit: 12 });
      setDevelopers(response.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(loadFeed, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const handleAction = async (developer, status) => {
    setPendingId(developer._id);
    try {
      await devTinderApi.sendRequest({ status, userId: developer._id });
      setDevelopers((current) =>
        current.filter((item) => item._id !== developer._id),
      );
      setNotice({
        type: "success",
        message:
          status === "interested"
            ? `Connection request sent to ${developer.firstName}.`
            : `${developer.firstName} won’t appear in your feed again.`,
      });
    } catch (requestError) {
      setNotice({ type: "error", message: requestError.message });
    } finally {
      setPendingId(null);
    }
  };
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your discovery queue</p>
          <h1>Developers worth meeting</h1>
          <p>Browse the people who are open to a new connection.</p>
        </div>
        <button
          className="refresh-button"
          type="button"
          onClick={loadFeed}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>
      {loading && (
        <div className="loading-grid">
          {[1, 2, 3].map((item) => (
            <div className="skeleton-card" key={item} />
          ))}
        </div>
      )}
      {!loading && error && (
        <EmptyState
          title="Couldn’t load your feed"
          body={error}
          action={
            <button className="button button--primary" onClick={loadFeed}>
              Try again
            </button>
          }
        />
      )}
      {!loading && !error && !developers.length && (
        <EmptyState
          title="You’re all caught up"
          body="There are no new developers in your discovery queue right now."
          action={
            <button className="button button--primary" onClick={loadFeed}>
              Refresh feed
            </button>
          }
        />
      )}
      {!loading && !error && developers.length > 0 && (
        <div className="developer-grid">
          {developers.map((developer) => (
            <DeveloperCard
              key={developer._id}
              developer={developer}
              onAction={handleAction}
              pending={pendingId === developer._id}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Requests({ setNotice }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await devTinderApi.getReceivedRequests();
      setRequests(response.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(loadRequests, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const review = async (request, status) => {
    setPendingId(request._id);
    try {
      await devTinderApi.reviewRequest({ status, requestId: request._id });
      setRequests((current) =>
        current.filter((item) => item._id !== request._id),
      );
      setNotice({
        type: "success",
        message:
          status === "accepted"
            ? `You and ${request.fromUserId.firstName} are now connected.`
            : "Request declined.",
      });
    } catch (requestError) {
      setNotice({ type: "error", message: requestError.message });
    } finally {
      setPendingId(null);
    }
  };
  return (
    <section className="content-section content-section--narrow">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Connection requests</p>
          <h1>Someone wants to build with you.</h1>
          <p>Review incoming requests and grow your dev circle.</p>
        </div>
      </div>
      {loading && <div className="list-skeleton" />}
      {!loading && error && (
        <EmptyState
          title="Couldn’t load requests"
          body={error}
          action={
            <button className="button button--primary" onClick={loadRequests}>
              Try again
            </button>
          }
        />
      )}
      {!loading && !error && !requests.length && (
        <EmptyState
          title="No requests right now"
          body="When someone is interested in connecting, they’ll show up here."
        />
      )}
      {!loading && !error && requests.length > 0 && (
        <div className="request-list">
          {requests.map((request) => {
            const developer = request.fromUserId;
            return (
              <article className="request-row" key={request._id}>
                <Avatar user={developer} size="large" />
                <div className="request-row__details">
                  <h3>
                    {developer.firstName} {developer.lastName}
                  </h3>
                  <p>
                    {developer.about || "Wants to add you to their dev circle."}
                  </p>
                  <div className="skill-list">
                    {developer.skills?.slice(0, 3).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="request-row__actions">
                  <button
                    type="button"
                    className="button button--ghost"
                    disabled={pendingId === request._id}
                    onClick={() => review(request, "rejected")}
                  >
                    Pass
                  </button>
                  <button
                    type="button"
                    className="button button--primary"
                    disabled={pendingId === request._id}
                    onClick={() => review(request, "accepted")}
                  >
                    {pendingId === request._id ? "Saving…" : "Accept"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Connections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    devTinderApi
      .getConnections()
      .then((response) => setConnections(response.data || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your people</p>
          <h1>Connections</h1>
          <p>The developers already in your circle.</p>
        </div>
      </div>
      {loading && (
        <div className="loading-grid">
          {[1, 2, 3].map((item) => (
            <div className="skeleton-card" key={item} />
          ))}
        </div>
      )}
      {!loading && error && (
        <EmptyState title="Couldn’t load connections" body={error} />
      )}
      {!loading && !error && !connections.length && (
        <EmptyState
          title="Your circle is just getting started"
          body="Accept a request or connect with someone from Discover to see them here."
        />
      )}
      {!loading && !error && connections.length > 0 && (
        <div className="connections-grid">
          {connections.map((developer) => (
            <article className="connection-card" key={developer._id}>
              <Avatar user={developer} size="large" />
              <div>
                <h3>
                  {developer.firstName} {developer.lastName}
                </h3>
                <p>{developer.about || "Developer in your network."}</p>
                <div className="skill-list">
                  {developer.skills?.slice(0, 3).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Profile({ user, setNotice, onProfileUpdated }) {
  const [form, setForm] = useState(() => profileFields(user));
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(true);
  const [profileStatus, setProfileStatus] = useState(
    "Verifying your DevTinder session…",
  );

  const checkProfileSession = useCallback(async () => {
    setChecking(true);
    try {
      const response = await devTinderApi.getProfile();
      if (response && typeof response === "object" && response.data) {
        const remoteUser = response.data;
        setForm(profileFields(remoteUser));
        onProfileUpdated(remoteUser);
      }
      setProfileStatus("Connected to your DevTinder account");
    } catch (requestError) {
      setProfileStatus("Unable to verify your DevTinder account");
      setNotice({ type: "error", message: requestError.message });
    } finally {
      setChecking(false);
    }
  }, [onProfileUpdated, setNotice]);

  useEffect(() => {
    const timer = window.setTimeout(checkProfileSession, 0);
    return () => window.clearTimeout(timer);
  }, [checkProfileSession]);

  const updateField = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = Object.fromEntries(
      Object.entries(form).filter(([, value]) => value !== ""),
    );
    if (payload.skills)
      payload.skills = payload.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    if (payload.age) payload.age = Number(payload.age);
    try {
      await devTinderApi.updateProfile(payload);
      onProfileUpdated(payload);
      setNotice({ type: "success", message: "Your profile has been updated." });
    } catch (requestError) {
      setNotice({ type: "error", message: requestError.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="content-section content-section--narrow">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Show your best work</p>
          <h1>Shape your profile</h1>
          <p>These fields map directly to your DevTinder backend profile.</p>
        </div>
        <button
          className="refresh-button"
          type="button"
          onClick={checkProfileSession}
          disabled={checking}
        >
          {checking ? "Checking…" : "↻ Verify API"}
        </button>
      </div>
      <form className="profile-form" onSubmit={save}>
        <div className="profile-preview">
          <Avatar user={{ ...user, photoUrl: form.photoUrl }} size="profile" />
          <div>
            <span>{profileStatus}</span>
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="field-row">
          <label>
            Age
            <input
              name="age"
              type="number"
              min="18"
              max="70"
              value={form.age}
              onChange={updateField}
              placeholder="28"
            />
          </label>
          <label>
            Gender
            <select name="gender" value={form.gender} onChange={updateField}>
              <option value="">Select an option</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Other</option>
            </select>
          </label>
        </div>
        <label>
          Photo URL
          <input
            name="photoUrl"
            type="url"
            value={form.photoUrl}
            onChange={updateField}
            placeholder="https://images.example.com/you.jpg"
          />
        </label>
        <label>
          About
          <textarea
            name="about"
            rows="5"
            value={form.about}
            onChange={updateField}
            placeholder="What are you building? What kind of people would you like to meet?"
          />
        </label>
        <label>
          Skills <span className="field-hint">Separate each with a comma</span>
          <input
            name="skills"
            value={form.skills}
            onChange={updateField}
            placeholder="React, Node.js, system design"
          />
        </label>
        <button
          className="button button--primary"
          disabled={saving}
          type="submit"
        >
          {saving ? "Saving…" : "Save profile"} <span>→</span>
        </button>
      </form>
    </section>
  );
}

function App() {
  const [session, setSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem("devtinder-session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activePage, setActivePage] = useState("discover");
  const [notice, setNotice] = useState(null);
  const user = useMemo(() => session?.user, [session]);
  const saveSession = (nextSession) => {
    sessionStorage.setItem("devtinder-session", JSON.stringify(nextSession));
    setSession(nextSession);
  };
  const completeLogin = (nextUser) => {
    saveSession({ user: nextUser });
    setNotice({
      type: "success",
      message: "You’re signed in. Start meeting developers.",
    });
  };
  const updateProfile = (profile) => {
    saveSession({ ...session, user: { ...session.user, ...profile } });
  };
  const logout = async () => {
    try {
      await devTinderApi.logout();
    } catch {
      /* Local session should still end. */
    }
    sessionStorage.removeItem("devtinder-session");
    setSession(null);
    setActivePage("discover");
  };
  if (!session) return <AuthScreen onAuthenticated={completeLogin} />;
  const page = {
    discover: <Discover setNotice={setNotice} />,
    requests: <Requests setNotice={setNotice} />,
    connections: <Connections />,
    profile: (
      <Profile
        user={user}
        setNotice={setNotice}
        onProfileUpdated={updateProfile}
      />
    ),
  }[activePage];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="DevTinder home">
          <span className="brand-mark">&lt;/&gt;</span>
          <span>devtinder</span>
        </a>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`nav-item ${activePage === item.id ? "nav-item--active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="signed-in">
            <Avatar user={user} size="small" />
            <div>
              <strong>{user.firstName}</strong>
              <span>Online</span>
            </div>
          </div>
          <button className="signout" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <div className="topbar__crumb">
            <span>devtinder</span>
            <span className="topbar__slash">/</span>
            <strong>
              {navItems.find((item) => item.id === activePage)?.label}
            </strong>
          </div>
          <div className="topbar__right">
            <span className="online-dot" /> You’re visible
          </div>
        </header>
        <Notice notice={notice} onDismiss={() => setNotice(null)} />
        {page}
      </main>
    </div>
  );
}

export default App;
