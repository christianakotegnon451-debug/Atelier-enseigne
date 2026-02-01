document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-button");
  const panes = document.querySelectorAll(".tab-pane");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      buttons.forEach(b => b.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
});
