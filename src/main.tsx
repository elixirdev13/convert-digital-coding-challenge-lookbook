import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Lookbook } from "./components/Lookbook";
import type { LookbookPayload } from "./types";
import "./styles/tailwind.css";

// Each lookbook section rendered by Liquid outputs a mount element carrying a
// JSON payload (lookbook metaobject data + settings + market config). We hydrate
// every mount found on the page so a product page can show multiple lookbooks.
function mountAll(): void {
  const mounts = document.querySelectorAll<HTMLElement>("[data-lookbook-app]");

  mounts.forEach((mount) => {
    if (mount.dataset.lookbookMounted === "true") return;

    const script = mount.querySelector<HTMLScriptElement>(
      'script[type="application/json"][data-lookbook-payload]',
    );
    if (!script?.textContent) return;

    let payload: LookbookPayload;
    try {
      payload = JSON.parse(script.textContent) as LookbookPayload;
    } catch {
      return;
    }

    if (!payload.lookbooks?.length || !payload.config?.storefrontToken) return;

    mount.dataset.lookbookMounted = "true";
    createRoot(mount).render(
      <StrictMode>
        {payload.lookbooks.map((lookbook) => (
          <Lookbook
            key={lookbook.handle}
            lookbook={lookbook}
            settings={payload.settings}
            config={payload.config}
          />
        ))}
      </StrictMode>,
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAll);
} else {
  mountAll();
}

// Re-mount when sections are re-rendered in the theme editor.
document.addEventListener("shopify:section:load", mountAll);
