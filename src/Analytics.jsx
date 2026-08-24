import "./Analytics.css";

export function Analytics() {
  return (
    <div className="analytics">
      <h1>Site Analytics</h1>
      <iframe
        className="analytics-frame"
        title="Umami Analytics"
        src="https://cloud.umami.is/share/lUntcaNztz120iJk"
      ></iframe>
    </div>
  );
}