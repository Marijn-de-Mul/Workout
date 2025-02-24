import MobileNavbar from "./components/MobileNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function NewPage() {
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
            Home
          </h1>
          <p style={{ textAlign: "center", color: "#7D7D7D", marginBottom: "32px" }}>
            This page is still under development.
          </p>

        </div>
        <MobileNavbar />
      </div>
    </ProtectedRoute>
  );
}