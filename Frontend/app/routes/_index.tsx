import MobileNavbar from "./components/MobileNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Index() {
  return (
    <ProtectedRoute>
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "space-between",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingBottom: "60px",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "16px", color: "green" }}>
            Overview
          </h1>
          <p style={{ textAlign: "center", color: "#7D7D7D", marginBottom: "32px" }}>
            Your progress, upcoming tasks and more...
          </p>

          <div style={{ textAlign: "center", marginBottom: "16px", backgroundColor: "white", borderRadius: "8px", padding: "12px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ color: "green" }}>Progress</h2>
            <p style={{ color: "#7D7D7D" }}>You have completed 70% of your tasks this week.</p>
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px", backgroundColor: "white", borderRadius: "8px", padding: "12px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ color: "green" }}>Upcoming Tasks</h2>
            <ul style={{ listStyleType: "none", padding: 0, color: "#7D7D7D" }}>
              <li>Task 1: Complete workout plan</li>
              <li>Task 2: Review diet schedule</li>
              <li>Task 3: Update progress log</li>
            </ul>
          </div>

          <div style={{ textAlign: "center", backgroundColor: "white", borderRadius: "8px", padding: "12px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ color: "green" }}>Tips</h2>
            <p style={{ color: "#7D7D7D" }}>Stay hydrated and maintain a balanced diet for optimal performance.</p>
          </div>
        </div>

        <MobileNavbar />
      </div>
    </ProtectedRoute>
  );
}