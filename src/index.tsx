import { HandshakeProvider } from "@replit/extensions-react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root") as Element).render(
  <HandshakeProvider>
    <App />
  </HandshakeProvider>,
);
