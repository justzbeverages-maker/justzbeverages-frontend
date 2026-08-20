import { useState } from "react";
import { Welcome } from "./Welcome";
import { Hero } from "./Hero";
import { Products } from "./Products";
import { Enquiries } from "./Enquiries";
import { Analytics } from "./Analytics";
import "./AdminPanel.css";

const TABS = { Welcome, Hero, Products, Enquiries, Analytics };

export function AdminPanel() {
  const [tab, setTab] = useState("Welcome");
  const Page = TABS[tab];

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
      </aside>

      <main className="admin-content">
        <Page />
      </main>
    </div>
  );
}