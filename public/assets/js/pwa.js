document.addEventListener("DOMContentLoaded", init, false);
function init() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./assets/js/service-worker.js")
      .then((reg) => {
        console.log("Service worker registered! Scope : ", +reg.scope);
      })
      .catch((err) => {
        console.error("Service worker not registered -->", err);
      });
  } else {
    console.log("The browser does not support Service Worker");
  }
}
