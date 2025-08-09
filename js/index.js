import { APICalls } from "./classAPICalls.js";
import { Pagination } from "./classPagination.js";
import { URLParam } from "./classURLParam.js";
import { header, footer } from "./main.js";

document.addEventListener("DOMContentLoaded",  init)

const classURLParam = new URLParam ();

function init () {
  let formElm = document.querySelector("#loginForm");
  // intializes APICalls class
  const callAPI = new APICalls({
    formElement : formElm,
    errorClass : "api-error"
  })
  loginUser (formElm)
  populateProducts(getCategoryParam ());
  searchProduct ()

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
  async function populateProducts(urlparam) {
    let mainURL = 'https://dummyjson.com/products';
    let param;
    param = urlparam ? `/${urlparam}` : '?limit=0'
    console.log(mainURL+param)
    let productsData = await callAPI.fetchData (mainURL+param);
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

  function getCategoryParam () {
    let mainParam = 'category';
    let [windowPath, params] = classURLParam.getURL(); // destructuring
    if (params.has(mainParam)) {
      return `${mainParam}/${params.get(mainParam)}`
    } else {
      return
    } 
  
  }

  function searchProduct () {
    document.addEventListener("layoutLoaded", () => {
      header.querySelector("#searchBtn").addEventListener("click", () => {
        let searchValue = header.querySelector("#searchInput").value;
        populateProducts(`search?q=${searchValue}`); 
      })
    });
    
  }
}


// callback function to create Items
function generateItems (data) { 
  let item = document.createElement("div");
  item.classList.add("col-lg-2", "col-med-12", "col-sm-12", "my-3");
  item.innerHTML =`
 <div class="product-card">
    <div class="product-thumb">
        <img src="${data.thumbnail}" alt="">
    </div>

    <div class="product-info">
      <div class="product-title">
      ${data.title} 
      </div>      
      <div class="product-category"> 
      ${data.category} 
      </div>
      <div class="product-short-wrap">
        <div class="product-rating">
                    
        </div>
       
      <div class="addcart-btn-wrap">
        <div class="product-price">
          <i class="ph ph-currency-dollar"></i> ${data.price}
        </div>
          <button class="addcart-btn"><i class="ph ph-shopping-cart"></i></button>
        </div>   
      </div>

    </div>

    </div>
        ` 
  createStar (generateRating(data.rating), item.querySelector(".product-rating"));
  return item;
}

// to generate rating
function generateRating(rating) {
  // hashmaps maps rating with conditions
  const map = new Map([
    [5, rating >= 4.50],
    [4.5, rating >= 4 && rating < 4.50],
    [4, rating >= 3.50 && rating < 4],
    [3.5, rating >= 3 && rating < 3.50],
    [3, rating >= 2.50 && rating < 3],
    [2.5 ,rating >= 2 && rating < 2.50],
    [2, rating >= 1.50 && rating < 2],
    [1.5, rating >= 1 && rating < 1.50],
    [1, rating >= 0.50 && rating < 1],
  ]);

  // on truthy value to condition we return rating
  for (const key of map) {
    if (key[1]) {
      return key[0];      
    }
  };
}

// to create star and add
function createStar (num, parent) {
  let maxStar = 5;
  let fillStarArr;
  let emptyStarArr;
  let emptyStarNum;
  let fillStarNum = num;

  // on truthy value for num emptyStar num and fill star nums are updated while on falsy only empty stat num
  !Number.isInteger(num) ? (emptyStarNum = maxStar - Math.ceil(num), fillStarNum = num - 0.5 ): (emptyStarNum = maxStar - num);
  // fill star num is added
  fillStarArr = [...Array(fillStarNum).keys()];
  for(let i = 0; i < fillStarArr.length; i++){
    addFillStar(parent)
  }
  // on truthy value half star is added
  if (!Number.isInteger(num))  addHalfStar(parent);
  // empty stars are added if num is bigger
  if (emptyStarNum > 0) {
    emptyStarArr = [...Array(emptyStarNum).keys()];
    for(let i = 0; i < emptyStarArr.length; i++){
      addEmptyStar(parent)
    }
  }
}

function addFillStar(parent){
  let createI = document.createElement("i");
  createI.classList.add("ph-fill", "ph-star");
  parent.appendChild(createI);
}

function addHalfStar(parent){
  let createI = document.createElement("i");
  createI.classList.add("ph-fill", "ph-star-half");
  parent.appendChild(createI);
}
function addEmptyStar(parent){
  let createI = document.createElement("i");
  createI.classList.add("ph", "ph-star");
  parent.appendChild(createI);
}