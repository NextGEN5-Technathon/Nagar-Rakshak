# Moderator Module — Manual Test Checklist

## Setup
- [ ] Run `npm run dev`
- [ ] Open the local server link in browser
- [ ] Confirm "Moderator Queue" page loads with report cards

## Approve / Reject
- [ ] Click "View Details" on a pending report → modal opens with image, description, status, location, date
- [ ] Click "Approve" → modal closes, card status changes to "approved"
- [ ] Click "View Details" on another pending report → click "Reject" → status changes to "rejected"
- [ ] Approved/Rejected reports no longer show Approve/Reject buttons in the modal

## Duplicate Detection
- [ ] Two "Pothole" reports with close coordinates both show "⚠ Possible duplicate"
- [ ] Reports with different categories or far-apart locations do NOT show the warning

## Filters
- [ ] Selecting a category (e.g. "Pothole") shows only matching reports
- [ ] Selecting a status (e.g. "Approved") shows only matching reports
- [ ] Selecting "All Categories" / "All Statuses" resets the view
- [ ] Combining both filters (e.g. Pothole + Pending) narrows correctly

## Export
- [ ] Clicking "Export Report" downloads a `.csv` file
- [ ] Opening the CSV shows all report fields (ID, Category, Description, Status, Latitude, Longitude, Reported At)
- [ ] CSV reflects current data (e.g. if a report was approved, CSV shows "approved")

## Empty States
- [ ] Filtering to a combination with no matches shows no cards (no crash)
- [ ] (Optional) Temporarily empty the reports array → "No reports to review." message shows

## Known Limitations (expected, not bugs)
- Data is sample/hardcoded, not connected to Supabase yet
- Refreshing browser resets any approve/reject changes (expected until real DB is connected)