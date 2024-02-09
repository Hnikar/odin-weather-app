import DomManipulation from "./dom";

DomManipulation.setData("Amsterdam").then(() => {
  document.getElementById("loading-screen").style.opacity = "0";
  setTimeout(function () {
    document.getElementById("loading-screen").style.display = "none";
  }, 500);
});
