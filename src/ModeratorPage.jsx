import { useState } from "react";
import { sampleReports } from "./data/sampleReports";

function ModeratorPage() {
  const [reports, setReports] = useState(sampleReports);

  function handleApprove(id) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
  }

  function handleReject(id) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Moderator Queue</h1>
      {reports.length === 0 && <p>No reports to review.</p>}

      {reports.map((report) => (
        <div
          key={report.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
            maxWidth: "400px",
          }}
        >
          <img
            src={report.image_url}
            alt={report.category}
            style={{ width: "100%", borderRadius: "6px" }}
          />
          <h3>{report.category}</h3>
          <p>{report.description}</p>
          <p><strong>Status:</strong> {report.status}</p>

          {report.status === "pending" && (
            <div>
              <button onClick={() => handleApprove(report.id)}>Approve</button>
              <button onClick={() => handleReject(report.id)} style={{ marginLeft: "8px" }}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ModeratorPage;