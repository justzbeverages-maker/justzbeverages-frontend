import { useEffect, useState } from "react";
import axios from "axios"
import { getAdminAuthHeader } from "./AdminAuth";
import "./Enquiries.css";

export function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);//stores response from the backend
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    async function fetchData(){
      try {
        const response = await axios.get("https://justzbeverages.onrender.com/admin", {
          headers: { Authorization: getAdminAuthHeader() },
        });
        setEnquiries(response.data);
        setStatus("ready");
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          window.dispatchEvent(new Event("admin-unauthorized"));
        }
        setStatus("error");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="enquiries">
      <h1>Enquiries</h1>

      {status === "loading" && <p className="enquiries-msg">Loading...</p>}
      {status === "error" && <p className="enquiries-msg">Could not load enquiries.</p>}
      {status === "ready" && enquiries.length === 0 && (
        <p className="enquiries-msg">No enquiries yet.</p>
      )}

      {status === "ready" && enquiries.length > 0 && (
        <div className="enquiries-list">
          {enquiries.map((e) => (
            <div className="enquiry-card" key={e.id}>
              <div className="enquiry-top">
                <strong>{e.name}</strong>
                <span>{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ""}</span>
              </div>
              <p className="enquiry-contact">
                {e.email} {e.phone && `· ${e.phone}`}
              </p>
              <p className="enquiry-message">{e.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}