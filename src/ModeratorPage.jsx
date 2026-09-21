import { useState } from "react";
import { sampleReports } from "./data/sampleReports";
import "./ModeratorPage.css";

function ModeratorPage() {
  const [reports, setReports] = useState(sampleReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  function handleExport() {
    const headers = ["ID", "Category", "Description", "Status", "Latitude", "Longitude", "Reported At"];
    const rows = reports.map((r) => [
      r.id,
      r.category,
      r.description,
      r.status,
      r.latitude,
      r.longitude,
      r.created_at,
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.map((val) => `"${val}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "safecity_reports_export.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function findDuplicates(report) {
    return reports.filter(
      (r) =>
        r.id !== report.id &&
        r.category === report.category &&
        Math.abs(r.latitude - report.latitude) < 0.01 &&
        Math.abs(r.longitude - report.longitude) < 0.01
    );
  }

   const statusOrder = { pending: 0, approved: 1, rejected: 2 };

  const filteredReports = reports
    .filter((r) => {
      const categoryMatch = categoryFilter === "all" || r.category === categoryFilter;
      const statusMatch = statusFilter === "all" || r.status === statusFilter;
      return categoryMatch && statusMatch;
    })
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  function StatusBadge({ status }) {
    return <span className={`badge badge-${status}`}>{status}</span>;
  }

  return (
    <div className="moderator-page">
      <h1>Moderator Queue</h1>

      <div className="toolbar">
        <button className="export-btn" onClick={handleExport}>
          Export Report
        </button>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Pothole">Pothole</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Open Manhole">Open Manhole</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredReports.length === 0 && <p>No reports to review.</p>}

      <div className="report-grid">
        {filteredReports.map((report) => (
          <div key={report.id} className="report-card">
            <img src={report.image_url} alt={report.category} />
            <div className="report-card-body">
              <h3>{report.category}</h3>
              <StatusBadge status={report.status} />
              {findDuplicates(report).length > 0 && (
                <p className="duplicate-warning">⚠ Possible duplicate</p>
              )}
              <button className="view-btn" onClick={() => setSelectedReport(report)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <img src={selectedReport.image_url} alt={selectedReport.category} />
            <h2>{selectedReport.category}</h2>
            <StatusBadge status={selectedReport.status} />
            <p style={{ marginTop: "10px" }}>{selectedReport.description}</p>
            <p>
              <strong>Location:</strong> {selectedReport.latitude}, {selectedReport.longitude}
            </p>
            <p>
              <strong>Reported:</strong>{" "}
              {new Date(selectedReport.created_at).toLocaleString()}
            </p>

            {selectedReport.status === "pending" && (
              <div className="modal-actions">
                <button className="approve-btn" onClick={() => handleApprove(selectedReport.id)}>
                  Approve
                </button>
                <button className="reject-btn" onClick={() => handleReject(selectedReport.id)}>
                  Reject
                </button>
              </div>
            )}

            <button className="close-btn" onClick={() => setSelectedReport(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModeratorPage;