import { APICalls } from "./classAPICalls.js";
import { Pagination } from "./classPagination.js";

document.addEventListener("DOMContentLoaded",  inIt)


function inIt () {
  let formElm = document.querySelector("#loginForm");
  
  const callAPI = new APICalls({
    formElement : formElm,
    errorClass : "api-error"
  })
  loginUser (formElm)
  populateProducts() 

  function loginUser (formElm) {
    let loginData; 
    let userProfile;
    formElm.addEventListener("submit", async (event) => {
      let formData = callAPI.getFormData(formElm, event);
      if (formData) {
        loginData = await callAPI.fetchData ('https://dummyjson.com/user/login', "POST", formData);
      }
      if (loginData) {
        userProfile = await callAPI.fetchData ('https://dummyjson.com/user/me', "GET", loginData.accessToken);
        console.log(loginData, userProfile);  
        return userProfile;
      }
    })
  }

  async function populateProducts() {
    let productsData = await callAPI.fetchData ('https://dummyjson.com/products?limit=0');
    const paginationMain = new Pagination({
      pageSize: 20,
      maxPageNum: 3,
      headerClassSelector : "navbar",
      itemClassSelector : "product-card",
      enableSortList: true,
      itemCreator: generateItems,
    });
    paginationMain.initiatePagination(
          productsData.products,
          document.querySelector(".pagination"),
          document.querySelector(".products-wrap .row")
        );
  }
}


// callback function to create Items
function generateItems (data) { 
  let item = document.createElement("div");
  item.classList.add("col-lg-3", "col-med-12", "col-sm-12", "my-3");
  item.innerHTML =`
 <div class="product-card">
    <div class="product-thumb">
        <img src="${data.thumbnail}" alt="">
    </div>
    <div class="product-title">
        ${data.title}
    </div>
    <div class="product-short-wrap">
        <div class="product-price">
            ${data.price}
        </div>
        <div class="product-rating">
                     
        </div>
        <div class="addcart-btn-wrap">
        <button class="addcart-btn">Add to Cart</button>
        </div>
        
        </div>
        </div>
        ` 
  createStar (generateRating(data.rating), item.querySelector(".product-rating"));
  return item;
}

function generateRating(rating) {
  if (rating >= 4.50) {
    return 5
  }
  else if (rating >= 4 && rating < 4.50) {
    // console.log( rating, "4 full and half")
    return 4.5
  }
  else if (rating >= 3.50 && rating < 4) {
    // console.log(Math.ceil(rating), rating, "4")
    return 4
  }
  else if (rating >= 3 && rating < 3.50) {
    // console.log( rating, "3 full and half")
    return 3.5
  }
  else if (rating >= 2.50 && rating < 3) {
    // console.log(Math.ceil(rating), rating, "3")
    return 3
  }
  else if (rating >= 2 && rating < 2.50) {
    // console.log( rating, "2 full and half")
    return 2.5
  }
  else if (rating >= 1.50 && rating < 2) {
    // console.log(Math.ceil(rating), rating, "2")
    return 2
  }
  else if (rating >= 1 && rating < 1.50) {
    // console.log( rating, "1 full and half")
    return 1.5
  }
  else if (rating >= 1.50 && rating < 2) {
    // console.log(Math.ceil(rating), rating, "1")
    return 1
  } else {
    // console.log(Math.ceil(rating), rating, "0")
    return 0    
  }

}

function createStar (num, parent) {
  let maxStar = 5;
  let starArr;
  let emptyArr;
  if (Number.isInteger(num)) {
    let emptyNum = maxStar - num;
    starArr = [...Array(num).keys()];
    for(let i = 0; i < starArr.length; i++){
      addfillStar(parent)
    }
    if (emptyNum > 0) {
      emptyArr = [...Array(emptyNum).keys()];
      for(let i = 0; i < emptyArr.length; i++){
        addemptyStar(parent)
      }
    }
  } else {
    let fillNum = num - 0.5;
    let emptyNum = maxStar - Math.ceil(num);
    starArr = [...Array(fillNum).keys()];
    for(let i = 0; i < starArr.length; i++){
      addfillStar(parent)
    }
    addhalfStar(parent)
    if (emptyNum > 0) {
      emptyArr = [...Array(emptyNum).keys()];
      for(let i = 0; i < emptyArr.length; i++){
        addemptyStar(parent)
      }
    }
  }
}

function addfillStar(parent){
  let createI = document.createElement("i");
  createI.classList.add("ph-fill", "ph-star");
  parent.appendChild(createI);
}

function addhalfStar(parent){
  let createI = document.createElement("i");
  createI.classList.add("ph-fill", "ph-star-half");
  parent.appendChild(createI);
}
function addemptyStar(parent){
  let createI = document.createElement("i");
  createI.classList.add("ph", "ph-star");
  parent.appendChild(createI);
}