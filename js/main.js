document.addEventListener("DOMContentLoaded", ()=> {
    //$("#header").load("header.html");
    let header = document.querySelector("#header");

    fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
        header.innerHTML = data;
        let loginBtn = document.querySelector("#loginBtn");
        loginBtn.addEventListener("click", () => {
            let loginForm =  document.querySelector(".login-wrap");
            let productContainer =  document.querySelector(".products-container");
            let loginDisplay = window.getComputedStyle(loginForm).display;
            loginForm.style.display = (loginDisplay === "none") ? "block" : "none" ;
            productContainer.style.display = (loginForm.style.display === "block") ?  "none" : "block";
        })
    })
})