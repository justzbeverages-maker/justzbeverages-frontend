import "./Welcome.css";

export function Welcome() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="welcome">
      <p className="welcome-date">{today}</p>
      <h1>Welcome back</h1>
      <p className="welcome-sub">Check enquiries or view site analytics from the menu.</p>
    </div>
  );
}