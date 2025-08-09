export let header = null;
export let footer = null;

document.addEventListener("DOMContentLoaded", async () => {
  header = document.querySelector("#header");
  footer = document.querySelector("#footer");

  try {
    const [headerHTML, footerHTML] = await Promise.all([
      fetch("header.html").then((res) => res.text()),
      fetch("footer.html").then((res) => res.text()),
    ]);

    header.innerHTML = headerHTML;
    footer.innerHTML = footerHTML;

    let headerSize =
      document.querySelector(".navbar").getBoundingClientRect().height + 20;
    const root = document.documentElement;
    root.style.setProperty("--header-size", `${headerSize}px`);

    let loginBtn = document.querySelector("#loginBtn");
    loginBtn.addEventListener("click", () => {
      let loginForm = document.querySelector(".login-wrap");
      let productContainer = document.querySelector(".main-container");
      let loginDisplay = window.getComputedStyle(loginForm).display;
      loginForm.style.display = loginDisplay === "none" ? "block" : "none";
      productContainer.style.display =
        loginForm.style.display === "block" ? "none" : "block";
    });
    // Optionally trigger a custom event after load
    document.dispatchEvent(new Event("layoutLoaded"));
  } catch (error) {
    console.error("Failed to load layout:", err);
  }
});
