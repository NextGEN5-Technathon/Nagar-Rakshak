import { useState } from "react";
import { sampleReports } from "./data/sampleReports";

function ModeratorPage() {
  const [reports, setReports] = useState(sampleReports);
  const [selectedReport, setSelectedReport] = useState(null);

  function handleApprove(id) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    setSelectedReport(null);
  }

  function handleReject(id) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
    setSelectedReport(null);
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Moderator Queue</h1>
      {reports.length === 0 && <p>No reports to review.</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              width: "300px",
            }}
          >
            <img
              src={report.image_url}
              alt={report.category}
              style={{ width: "100%", borderRadius: "6px" }}
            />
            <h3>{report.category}</h3>
            <p><strong>Status:</strong> {report.status}</p>
            <button onClick={() => setSelectedReport(report)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedReport(null)}
        >
          <div
            style={{
              background: "white",
              color: "black",
              padding: "24px",
              borderRadius: "10px",
              maxWidth: "450px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedReport.image_url}
              alt={selectedReport.category}
              style={{ width: "100%", borderRadius: "6px" }}
            />
            <h2>{selectedReport.category}</h2>
            <p>{selectedReport.description}</p>
            <p><strong>Status:</strong> {selectedReport.status}</p>
            <p>
              <strong>Location:</strong> {selectedReport.latitude},{" "}
              {selectedReport.longitude}
            </p>
            <p>
              <strong>Reported:</strong>{" "}
              {new Date(selectedReport.created_at).toLocaleString()}
            </p>

            {selectedReport.status === "pending" && (
              <div style={{ marginTop: "12px" }}>
                <button onClick={() => handleApprove(selectedReport.id)}>
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedReport.id)}
                  style={{ marginLeft: "8px" }}
                >
                  Reject
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedReport(null)}
              style={{ marginTop: "12px", display: "block" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModeratorPage;