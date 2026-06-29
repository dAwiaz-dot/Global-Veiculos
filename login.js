const loginForm = document.querySelector("[data-login-form]");
const loginError = document.querySelector("[data-login-error]");

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function nextAdminPath() {
  const next = new URLSearchParams(window.location.search).get("next") || "/admin.html";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/admin.html";
}

function isEditableTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function initMobileContentGuard() {
  const blockMobileCopy = (event) => {
    if (!isMobileViewport() || isEditableTarget(event.target)) return;
    event.preventDefault();
  };

  document.addEventListener("copy", blockMobileCopy);
  document.addEventListener("cut", blockMobileCopy);
  document.addEventListener("contextmenu", blockMobileCopy);
  document.addEventListener("selectstart", blockMobileCopy);
}

async function redirectIfLoggedIn() {
  try {
    const response = await fetch("/api/session", { cache: "no-store" });
    if (!response.ok) return;

    const session = await response.json();
    if (session.authenticated) {
      window.location.href = nextAdminPath();
    }
  } catch (error) {
    console.warn("Sessao indisponivel.", error);
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.hidden = true;

  const data = new FormData(loginForm);

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.get("username")?.toString().trim(),
        password: data.get("password")?.toString(),
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || "Usuario ou senha invalidos.");
    }

    window.location.href = nextAdminPath();
  } catch (error) {
    loginError.textContent = error.message;
    loginError.hidden = false;
  }
});

redirectIfLoggedIn();
initMobileContentGuard();
createIcons();
