import { IconHome, IconList, IconSettings, IconWeight } from "@tabler/icons-react";
import { useLocation } from "@remix-run/react";

export default function MobileNavbar() {
  const location = useLocation();

  const getLinkStyle = (path: string) => ({
    color: location.pathname === path ? "blue" : "green",
    textAlign: "center",
  });

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        backgroundColor: "white",
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 0",
        boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <a href="/" style={getLinkStyle("/")}>
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconHome size={24} />
          <span style={{ fontSize: "12px" }}>Home</span>
        </span>
      </a>

      <a href="/routines" style={getLinkStyle("/routines")}>
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconList size={24} />
          <span style={{ fontSize: "12px" }}>Routines</span>
        </span>
      </a>

      <a href="/exercises" style={getLinkStyle("/exercises")}>
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconWeight size={24} />
          <span style={{ fontSize: "12px" }}>Exercises</span>
        </span>
      </a>

      <a href="/settings" style={getLinkStyle("/settings")}>
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconSettings size={24} />
          <span style={{ fontSize: "12px" }}>Settings</span>
        </span>
      </a>
    </nav>
  );
}