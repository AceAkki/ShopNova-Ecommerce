import { APICalls } from "./classAPICalls.js";
import { Pagination } from "./classPagination.js";
import { URLParam } from "./classURLParam.js";
import { header, footer } from "./main.js";

const classURLParam = new URLParam ();
const callAPI = new APICalls({
  msgClass : "form-message",
  msgColor : "var(--danger-color)"
})

document.addEventListener("DOMContentLoaded",  init)

function init () {
  //let formElm = document.querySelector("#loginForm");
  let userFormWrap = document.querySelector(".user-wrap");
  let productContainer = document.querySelector(".products-container");

  // intializes APICalls class
  classProductMain.populateProducts(getParam ("category"));
  layoutLoaded ()
  classUserMain.getUserStateURL(userFormWrap, productContainer)
  

  function layoutLoaded () {
    document.addEventListener("layoutLoaded", () => {
      header.querySelector("#searchBtn").addEventListener("click", () => {
        let searchValue = header.querySelector("#searchInput").value;
        classProductMain.populateProducts(`search?q=${searchValue}`); 
      })
     
    });
    
  }
}


class UserMain {
  mainParam = "user";
  loginState = "login";
  signUpState = "signup";

  loginUser (formHTML) {
    let loginData; 
    let userProfile;
    formHTML.addEventListener("submit", async (event) => {
      let formData = callAPI.getFormData(formHTML, event);
      if (formData) {
        loginData = await callAPI.fetchData ('https://dummyjson.com/user/login', "POST", formData, formHTML);
      }
      if (loginData) {
        userProfile = await callAPI.fetchData ('https://dummyjson.com/user/me', "GET", loginData.accessToken, formHTML);
        console.log(loginData, userProfile);  
        this.successMessage(formHTML, "Login Successful!")
        return userProfile;
      }
    })
  }

  createDashboard(userProfile){  

  }

  // addEventParam(elemArray, formElem, mainElem, param) {
  //   elemArray.forEach(btn => {
  //     btn.addEventListener("click", () => {       
  //       this.displayElem(formElem, mainElem);
  //       if (classURLParam.checkParam(this.mainParam)) {
  //         classURLParam.deleteParam(this.mainParam, param)
  //       } else {
  //         classURLParam.setURL(this.mainParam, param)
  //       }
  //     });
  //   })
  // } 

  // addEventParam(elemArray, formElem, mainElem, param) {
  //   elemArray.forEach(btn => {
  //     btn.addEventListener("click", () => {             
  //       if (classURLParam.checkParam(this.mainParam)) {
  //         classURLParam.deleteParam(this.mainParam, param)
  //         formElem.innerHTML = "";
  //         this.displayElem(formElem, mainElem)
  //       } else {
  //         classURLParam.setURL(this.mainParam, param);
  //         this.createForm(formElem, param)
  //         this.displayElem(formElem, mainElem)
  //       }
  //     });
  //   })
  // } 
  
  // displayElem(formElem, mainElem) {
  //   let formDisplay = window.getComputedStyle(formElem).display;
  //   formElem.style.display = (formDisplay === "none") ? "block" : "none";
  //   mainElem.style.display = formElem.style.display === "block" ? "none" : "block";
  // }
  
  displayElem(formElem, mainElem) {
    mainElem.style.display = formElem.querySelector("form") ? "none" : "block";
  }

  successMessage(parent, message) {
    let createElm = document.createElement("p");
    createElm.classList.add("form-message")
    createElm.style.color = "var(--success-color)"
    createElm.textContent = message;
    parent.appendChild(createElm);
  }

  createForm (formElem, param) {
    if (param === this.loginState) {
      formElem.innerHTML = 
          `
          <form action="" method="post" id="loginForm">
              <label for="username"> Name</label>
              <input type="text" name="username" id="username" autocomplete="username">
  
              <label for="password"> Password</label>
              <input type="password" name="password" id="password" autocomplete="current-password">
  
              <input type="submit" value="Submit" id="submitBtn">
  
          </form>
          `
      this.loginUser (document.querySelector("#loginForm"))
    } else if (param === this.signUpState) {
      formElem.innerHTML = 
        `
         <form action="/signup" method="POST">
    
    <div class="section">
      <h2>Personal Info</h2>
      <label>First Name: <input type="text" name="firstName" required></label>
      <label>Last Name: <input type="text" name="lastName" required></label>
      <label>Maiden Name: <input type="text" name="maidenName"></label>
      <label>Age: <input type="number" name="age" min="0"></label>
      <label>Gender: 
        <select name="gender">
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>Birth Date: <input type="date" name="birthDate"></label>
      <label>Eye Color: <input type="text" name="eyeColor"></label>
      <label>Height (cm): <input type="number" name="height" step="0.01"></label>
      <label>Weight (kg): <input type="number" name="weight" step="0.01"></label>
      <label>Blood Group: <input type="text" name="bloodGroup"></label>
    </div>
    
    <div class="section">
      <h2>Hair</h2>
      <label>Hair Color: <input type="text" name="hairColor"></label>
      <label>Hair Type: <input type="text" name="hairType"></label>
    </div>
    
    <div class="section">
      <h2>Account Details</h2>
      <label>Username: <input type="text" name="username" required></label>
      <label>Email: <input type="email" name="email" required></label>
      <label>Password: <input type="password" name="password" required></label>
      <label>Role: 
        <select name="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>
    </div>

    <div class="section">
      <h2>Contact Info</h2>
      <label>Phone: <input type="tel" name="phone"></label>
      <label>IP Address: <input type="text" name="ip"></label>
      <label>MAC Address: <input type="text" name="macAddress"></label>
    </div>
    
    <div class="section">
      <h2>Address</h2>
      <label>Street Address: <input type="text" name="address"></label>
      <label>City: <input type="text" name="city"></label>
      <label>State: <input type="text" name="state"></label>
      <label>State Code: <input type="text" name="stateCode"></label>
      <label>Postal Code: <input type="text" name="postalCode"></label>
      <label>Country: <input type="text" name="country"></label>
      <label>Latitude: <input type="number" name="lat" step="0.00001"></label>
      <label>Longitude: <input type="number" name="lng" step="0.00001"></label>
    </div>
    
    <div class="section">
      <h2>Company</h2>
      <label>Company Name: <input type="text" name="companyName"></label>
      <label>Department: <input type="text" name="department"></label>
      <label>Title: <input type="text" name="title"></label>
      <label>Company Address: <input type="text" name="companyAddress"></label>
      <label>City: <input type="text" name="companyCity"></label>
      <label>State: <input type="text" name="companyState"></label>
      <label>Postal Code: <input type="text" name="companyPostalCode"></label>
      <label>Country: <input type="text" name="companyCountry"></label>
    </div>
    
    <div class="section">
      <h2>Education & Identity</h2>
      <label>University: <input type="text" name="university"></label>
      <label>EIN: <input type="text" name="ein"></label>
      <label>SSN: <input type="text" name="ssn"></label>
    </div>

    <div class="section">
      <h2>Bank Info</h2>
      <label>Card Number: <input type="text" name="cardNumber"></label>
      <label>Card Expiry: <input type="text" name="cardExpire" placeholder="MM/YY"></label>
      <label>Card Type: <input type="text" name="cardType"></label>
      <label>Currency: <input type="text" name="currency"></label>
      <label>IBAN: <input type="text" name="iban"></label>
    </div>

    <div class="section">
      <h2>Crypto</h2>
      <label>Coin: <input type="text" name="coin"></label>
      <label>Wallet Address: <input type="text" name="wallet"></label>
      <label>Network: <input type="text" name="network"></label>
    </div>

    <div class="section">
      <h2>Other</h2>
      <label>User Agent: <input type="text" name="userAgent"></label>
      <label>Profile Image URL: <input type="url" name="image"></label>
    </div>

    <br>
    <button type="submit">Sign Up</button>
  </form>
        `
    }
  }

  getUserStateURL(formElem, mainElem) {
    let [windowPath, params] = classURLParam.getURL(); // destructuring
    if (classURLParam.checkParam(this.mainParam)) {
      if (params.get(this.mainParam) === this.loginState) {
        console.log("true")
        this.createForm (formElem, this.loginState);
        this.displayElem(formElem, mainElem);
        
      } else if (params.get(this.mainParam) === this.signUpState) {
        this.createForm (formElem, this.signUpState);        
        this.displayElem(formElem, mainElem);
      }
    }
  }
}
const classUserMain = new UserMain ();


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
      itemCreator: classProductMain.generateItems.bind(classProductMain),
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
    item.classList.add("col-6", "col-lg-2", "col-sm-6", "my-3");
    item.innerHTML =`
   <div class="product-card">
      <div class="product-thumb">
          <img src="${data.thumbnail}" alt="">
      </div>
  
      <div class="product-info">
        <div class="product-title">
        ${data.title} by ${ this.displayBrand(data.brand)}
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
            <button class="addcart-btn"> Add to Cart <i class="ph ph-shopping-cart"></i></button>
          </div>
          </div>   
        </div>
  
      </div>
  
      </div>
    `
    this.createStar (this.generateRating(data.rating), item.querySelector(".product-rating"));
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
const classProductMain = new ProductMain ();

function getParam (param) {
  let mainParam = param;
  let [windowPath, params] = classURLParam.getURL(); // destructuring
  if (params.has(mainParam)) {
    return `${mainParam}/${params.get(mainParam)}`
  } else {
    return
  }   
}