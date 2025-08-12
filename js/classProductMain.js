import { Pagination } from "./classPagination.js";
import { APICalls } from "./classAPICalls.js";

const callAPI = new APICalls({
    msgClass : "form-message",
    msgColor : "var(--danger-color)"
  })


class ProductMain {
    async populateProducts(urlparam) {
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
        itemCreator: this.generateItems,
      });
      paginationMain.initiatePagination(
            productsData.products,
            document.querySelector(".pagination"),
            document.querySelector(".products-wrap .row")
          );
    }
  
    
  
    // callback function to create Items
    generateItems (data) { 
      let item = document.createElement("div");
      item.classList.add("col-6", "col-lg-2", "col-sm-6", "d-flex", "align-items-stretch");
      item.innerHTML =`
     <div class="product-card">
        <div class="product-thumb">
            <img src="${data.thumbnail}" alt="">
        </div>
    
        <div class="product-info">
          <div class="product-title">
          ${data.title} by ${ classProductMain.displayBrand(data.brand)}
          </div>      
          <div class="product-category"> 
          ${data.category} 
          </div>
          <div class="product-short-wrap">
            <div class="product-rating">
                        
            </div>
            <div class="product-price">
              <i class="ph ph-currency-dollar"></i> ${data.price}
            </div>
           
          <div class="addcart-btn-wrap">
            <div>
              <button class="addcart-btn"> Add to Cart</button>
            </div>
            </div>   
          </div>
    
        </div>
    
        </div>
      `
      classProductMain.createStar (classProductMain.generateRating(data.rating), item.querySelector(".product-rating"));
      return item;
    }
  
    displayBrand(data) {
      if (data === undefined) {
        return "ShopNova"
      } else {
        return data
      }
    }
    // to generate rating
    generateRating(rating) {
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
      for (const [key, condition ] of map) {
        if (condition) {
          return key;      
        }
      };
      return 0;
    }
    
    // to create star and add
    createStar (num, parent) {
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
        this.addFillStar(parent)
      }
      // on truthy value half star is added
      if (!Number.isInteger(num))  this.addHalfStar(parent);
      // empty stars are added if num is bigger
      if (emptyStarNum > 0) {
        emptyStarArr = [...Array(emptyStarNum).keys()];
        for(let i = 0; i < emptyStarArr.length; i++){
          this.addEmptyStar(parent)
        }
      }
    }
    
    addFillStar(parent){
      let createI = document.createElement("i");
      createI.classList.add("ph-fill", "ph-star");
      parent.appendChild(createI);
    }
    
    addHalfStar(parent){
      let createI = document.createElement("i");
      createI.classList.add("ph-fill", "ph-star-half");
      parent.appendChild(createI);
    }
    addEmptyStar(parent){
      let createI = document.createElement("i");
      createI.classList.add("ph", "ph-star");
      parent.appendChild(createI);
    }
}
export const classProductMain = new ProductMain ();