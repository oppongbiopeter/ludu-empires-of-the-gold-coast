import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import markup from "@/game/markup.html?raw";
import "@/game/game.css";

export const Route = createFileRoute("/")({ component: Home });

declare global {
  interface Window {
    __luduBooted?: boolean;
  }
}

function Home() {
  useEffect(() => {
    if (window.__luduBooted) return;
    window.__luduBooted = true;
    const s = document.createElement("script");
    s.src = "/ludu/game.js?v=board12";
    s.async = false;
    document.body.appendChild(s);
  }, []);

  return <div id="ludu-app" dangerouslySetInnerHTML={{ __html: markup }} />;
}
