import { URLParam } from "./classURLParam.js";
import { UserMain } from "./classUserMain.js";
import { classProductMain } from "./classProductMain.js";
import { header, footer } from "./main.js";

const classURLParam = new URLParam ();
const classUserMain = new UserMain ({
  userSelector : "user-wrap",
  containerSelector : "products-container",
});

document.addEventListener("DOMContentLoaded",  init)

function init () {

  (function removeIndex() {
    let [windowPath, params] = classURLParam.getURL(); // destructuring
    let newURL = `${window.origin}${window.location.pathname.replace("index.html", "")}?${params.toString()}`; // using origin and pathname keeps this clean
    window.history.replaceState({}, "", newURL);
  })()
  //let formElm = document.querySelector("#loginForm");
  let userFormWrap = document.querySelector(".user-wrap");
  let productContainer = document.querySelector(".products-container");

  // intializes APICalls class
  classProductMain.populateProducts(getParam ("category"));
  layoutLoaded ()
  classUserMain.getUserState(userFormWrap, productContainer)
  

  function layoutLoaded () {
    document.addEventListener("layoutLoaded", () => {
      header.querySelector("#searchBtn").addEventListener("click", () => {
        let searchValue = header.querySelector("#searchInput").value;
        classProductMain.populateProducts(`search?q=${searchValue}`); 
      })
      classUserMain.btnEvent(document.querySelectorAll(".nav-link .ph-sign-in"), userFormWrap, productContainer, "login")
      classUserMain.btnEvent(document.querySelectorAll(".nav-link .ph-user-plus"), userFormWrap, productContainer, "signup")
      classUserMain.btnEvent(document.querySelectorAll(".userProfile"), userFormWrap, productContainer, "dashboard")
    });
    
  }
}

function getParam (param) {
  let mainParam = param;
  let [windowPath, params] = classURLParam.getURL(); // destructuring
  if (params.has(mainParam)) {
    return `${mainParam}/${params.get(mainParam)}`
  } else {
    return
  }   
}