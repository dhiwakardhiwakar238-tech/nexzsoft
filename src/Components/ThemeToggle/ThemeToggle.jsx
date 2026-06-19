import { useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;