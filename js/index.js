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
    let productsData = await callAPI.fetchData ('https://dummyjson.com/products');
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
  item.classList.add("col", "col-lg-2", "col-med-3", "col-sm-12", "my-3");
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
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star-half"></i>
            <i class="ph ph-star"></i>
            <i class="ph ph-star"></i>

        </div>
        <div class="addcart-btn-wrap">
            <button class="addcart-btn">Add to Cart</button>
        </div>

    </div>
</div>
  ` 
  return item;
}

