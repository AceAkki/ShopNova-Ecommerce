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

  signUpUser (formHTML) {
    let signupData; 
    let userProfile;
    formHTML.addEventListener("submit", async (event) => {
      let formData = callAPI.getFormData(formHTML, event);
      if (formData) {
        signupData = await callAPI.fetchData ('https://dummyjson.com/users/add', "POST", formData, formHTML);
        this.successMessage(formHTML, "Sign Up Successful!")
        return userProfile;
      }
      // if (loginData) {
      //   userProfile = await callAPI.fetchData ('https://dummyjson.com/user/me', "GET", loginData.accessToken, formHTML);
      //   console.log(loginData, userProfile);  
      // }
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
  <form action="/signup" method="POST" class="container mt-5">
    <div class="mb-4">
      <h2>Personal Info</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">First Name</label>
          <input type="text" name="firstName" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Last Name</label>
          <input type="text" name="lastName" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Maiden Name</label>
          <input type="text" name="maidenName" class="form-control">
        </div>
        <div class="col-md-2">
          <label class="form-label">Age</label>
          <input type="number" name="age" class="form-control" min="0">
        </div>
        <div class="col-md-3">
          <label class="form-label">Gender</label>
          <select name="gender" class="form-select">
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Birth Date</label>
          <input type="date" name="birthDate" class="form-control">
        </div>
        <div class="col-md-2">
        <label class="form-label">Height (cm)</label>
        <input type="number" name="height" step="0.01" class="form-control">
        </div>
        <div class="col-md-2">
        <label class="form-label">Weight (kg)</label>
        <input type="number" name="weight" step="0.01" class="form-control">
        </div>
        <div class="col-md-2">
        <label class="form-label">Blood Group</label>
        <input type="text" name="bloodGroup" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">Eye Color</label>
          <input type="text" name="eyeColor" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">Hair Color</label>
          <input type="text" name="hairColor" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">Hair Type</label>
          <input type="text" name="hairType" class="form-control">
        </div>
      </div>
    </div>


    <div class="mb-4">
      <h2>Account Details</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Username</label>
          <input type="text" name="username" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Email</label>
          <input type="email" name="email" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Password</label>
          <input type="password" name="password" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Role</label>
          <select name="role" class="form-select">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Contact Info</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Phone</label>
          <input type="tel" name="phone" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">IP Address</label>
          <input type="text" name="ip" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">MAC Address</label>
          <input type="text" name="macAddress" class="form-control">
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Address</h2>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Street Address</label>
          <input type="text" name="address" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">City</label>
          <input type="text" name="city" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">State</label>
          <input type="text" name="state" class="form-control">
        </div>
        <div class="col-md-2">
          <label class="form-label">State Code</label>
          <input type="text" name="stateCode" class="form-control">
        </div>
        <div class="col-md-2">
          <label class="form-label">Postal Code</label>
          <input type="text" name="postalCode" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">Country</label>
          <input type="text" name="country" class="form-control">
        </div>
        <div class="col-md-2">
          <label class="form-label">Latitude</label>
          <input type="number" name="lat" step="0.00001" class="form-control">
        </div>
        <div class="col-md-2">
          <label class="form-label">Longitude</label>
          <input type="number" name="lng" step="0.00001" class="form-control">
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Company</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Company Name</label>
          <input type="text" name="companyName" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">Department</label>
          <input type="text" name="department" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">Title</label>
          <input type="text" name="title" class="form-control">
        </div>
        <div class="col-md-6">
          <label class="form-label">Company Address</label>
          <input type="text" name="companyAddress" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">City</label>
          <input type="text" name="companyCity" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">State</label>
          <input type="text" name="companyState" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">Postal Code</label>
          <input type="text" name="companyPostalCode" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">Country</label>
          <input type="text" name="companyCountry" class="form-control">
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Education & Identity</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">University</label>
          <input type="text" name="university" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">EIN</label>
          <input type="text" name="ein" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">SSN</label>
          <input type="text" name="ssn" class="form-control">
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Bank Info</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Card Number</label>
          <input type="text" name="cardNumber" class="form-control">
        </div>
        <div class="col-md-2">
          <label class="form-label">Card Expiry</label>
          <input type="text" name="cardExpire" class="form-control" placeholder="MM/YY">
        </div>
        <div class="col-md-2">
          <label class="form-label">Card Type</label>
          <input type="text" name="cardType" class="form-control">
        </div>
        <div class="col-md-2">
          <label class="form-label">Currency</label>
          <input type="text" name="currency" class="form-control">
        </div>
        <div class="col-md-2">
          <label class="form-label">IBAN</label>
          <input type="text" name="iban" class="form-control">
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Crypto</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Coin</label>
          <input type="text" name="coin" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">Wallet Address</label>
          <input type="text" name="wallet" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">Network</label>
          <input type="text" name="network" class="form-control">
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Other</h2>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">User Agent</label>
          <input type="text" name="userAgent" class="form-control">
        </div>
        <div class="col-md-6">
          <label class="form-label">Profile Image URL</label>
          <input type="url" name="image" class="form-control">
        </div>
      </div>
    </div>

    <div class="text-end mb-5">
      <button type="submit" class="btn btn-primary px-4">Sign Up</button>
    </div>
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
    item.classList.add("col-6", "col-lg-2", "col-sm-6", "d-flex", "align-items-stretch");
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
            <button class="addcart-btn"> Add to Cart</button>
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