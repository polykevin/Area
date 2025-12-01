export default function ServicesPage() {
  return (
    <div>
      <h1>Services</h1>
      <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
        This page will list all services exposed by the AREA backend and indicate
        whether the current user has connected each service (e.g. Google, GitHub,
        Outlook...). The web client does not implement integrations itself, it
        only triggers backend calls.
      </p>
    </div>
  );
}
