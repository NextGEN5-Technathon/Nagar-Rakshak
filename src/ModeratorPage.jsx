import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import "./ModeratorPage.css";


function ModeratorPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
  const checkUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("CURRENT USER:", user);
    console.log("AUTH ERROR:", error);
  };

  checkUser();
}, []);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    console.error("Could not load reports:", error.message, error.details, error.hint);
    return;
  }

  setReports(data ?? []);
}

  async function handleApprove(id) {
    const { error } = await supabase
      .from("reports")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Approval failed:", error);
      return;
    }

    await fetchReports();
    setSelectedReport(null);
  }

  async function handleReject(id) {
    const { error } = await supabase
      .from("reports")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error("Rejection failed:", error);
      return;
    }

    await fetchReports();
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

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${val ?? ""}"`).join(","))
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
    if (report.latitude == null || report.longitude == null) return [];

    return reports.filter(
      (r) =>
        r.id !== report.id &&
        r.category === report.category &&
        r.latitude != null &&
        r.longitude != null &&
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

  const categories = [...new Set(reports.map((r) => r.category).filter(Boolean))];

  return (
    <div className="moderator-page">
      <h1>Moderator Queue</h1>

      <div className="toolbar">
        <button className="export-btn" onClick={handleExport}>
          Export Report
        </button>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
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
            {report.image_url ? (
              <img src={report.image_url} alt={report.category || "Report image"} />
            ) : (
              <div className="report-image-placeholder">No image</div>
            )}

            <div className="report-card-body">
              <h3>{report.category}</h3>
              <StatusBadge status={report.status} />

              {findDuplicates(report).length > 0 && (
                <p className="duplicate-warning">Possible duplicate</p>
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
            {selectedReport.image_url ? (
              <img src={selectedReport.image_url} alt={selectedReport.category || "Report image"} />
            ) : (
              <div className="report-image-placeholder">No image</div>
            )}

            <h2>{selectedReport.category}</h2>
            <StatusBadge status={selectedReport.status} />

            <p style={{ marginTop: "10px" }}>{selectedReport.description}</p>

            <p>
              <strong>Location:</strong>{" "}
              {selectedReport.latitude != null && selectedReport.longitude != null
                ? `${selectedReport.latitude}, ${selectedReport.longitude}`
                : "Not provided"}
            </p>

            <p>
              <strong>Reported:</strong>{" "}
              {selectedReport.created_at
                ? new Date(selectedReport.created_at).toLocaleString()
                : "Unknown"}
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