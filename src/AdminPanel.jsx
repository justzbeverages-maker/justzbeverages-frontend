import { useState, useEffect } from "react";
import { Welcome } from "./Welcome";
import { Hero } from "./Hero";
import { Products } from "./Products";
import { Enquiries } from "./Enquiries";
import { Analytics } from "./Analytics";
import { AdminLogin } from "./Adminlogin";
import { clearAdminAuth, isAdminAuthed } from "./Auth";
import "./AdminPanel.css";

const TABS = { Welcome, Hero, Products, Enquiries, Analytics };

export function AdminPanel() {
  const [tab, setTab] = useState("Welcome");
  const [authed, setAuthed] = useState(isAdminAuthed());
  const Page = TABS[tab];

  // If a stale/invalid token causes a 401 anywhere in the panel, components
  // can dispatch this event to kick the user back to the login screen.
  useEffect(() => {
    function handleUnauthorized() {
      clearAdminAuth();
      setAuthed(false);
    }
    window.addEventListener("admin-unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("admin-unauthorized", handleUnauthorized);
  }, []);

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  function handleLogout() {
    clearAdminAuth();
    setAuthed(false);
  }

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-logo">JUSTZ Admin</div>
        <nav>
          {Object.keys(TABS).map((t) => (
            <button
              key={t}
              className={t === tab ? "admin-tab active" : "admin-tab"}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
        <button className="admin-tab" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="admin-content">
        <Page />
      </main>
    </div>
  );
}