document.addEventListener("DOMContentLoaded", init, false);
function init() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./assets/js/service-worker.js").then(
      (reg) => {
        // console.log("Service worker registered -->", reg);
      },
      (err) => {
        // console.error("Service worker not registered -->", err);
      }
    );
  }
}
