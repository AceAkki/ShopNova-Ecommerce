import { APICalls } from "./classAPICalls.js";
import { URLParam } from "./classURLParam.js";
import { animateElem } from "./animate.js";
import { CookieManager } from "./classCookieManager.js";

const classURLParam = new URLParam ();
const classCookieManager = new CookieManager ();
const callAPI = new APICalls({
    msgClass : "form-message",
    msgColorFail : "var(--danger-color)",
    msgColorSuccess : "var(--success-color)"
  })

export class UserMain {
    constructor ({ mainKey, mainUser, formLogin, formSignup, dashBoard, cookieOne, userSelector, containerSelector}) {
      this.mainParam = mainKey || "view"; // screen, mode, section, pagetype, route
      this.loginParam = mainUser || "username";
      
      this.loginForm = formLogin || "login";
      this.signUpForm = formSignup || "signup";
      this.displayDashboard = dashBoard || "dashboard";
      this.cookieKeyOne = cookieOne || "accessToken";

      this.userElem = userSelector;
      this.containerElem = containerSelector;
  
    }
  
    getLoginData (formHTML) {
      let loginData; 
      let userProfile;
      formHTML.addEventListener("submit", async (event) => {
        let formData = callAPI.getFormData(formHTML, event);
        if (formData) {
          loginData = await callAPI.fetchData ('https://dummyjson.com/user/login', "POST", formData, formHTML);
        }
        if (loginData) {
          userProfile = await callAPI.fetchData ('https://dummyjson.com/user/me', "GET", loginData.accessToken);
          callAPI.message(formHTML, "true", "Login Successful!")
          console.log(loginData, userProfile);  
           setTimeout( ()=> {
            animateElem.animateOut(formHTML);
            formHTML.remove();
            classCookieManager.setCookie(this.cookieKeyOne, loginData.accessToken, 30);
            classURLParam.deleteParam(this.mainParam);
            this.displayElem(document.getElementsByClassName(this.userElem)[0], document.getElementsByClassName(this.containerElem)[0])
            this.loggedInState(userProfile)
          }, 2000)
          return userProfile;
        }
      })
    }  

    getSignUpData (formHTML) {
      let signupData; 
      this.formNavigation(formHTML)
      formHTML.addEventListener("submit", async (event) => {
        let formData = callAPI.getFormData(formHTML, event);
        if (formData) {
          signupData = await callAPI.fetchData ('https://dummyjson.com/users/add', "POST", formData, formHTML);
          callAPI.message(formHTML, "true", "Sign Up Successful!")
          console.log(signupData);
          setTimeout( ()=> {
            animateElem.animateOut(formHTML);
          }, 5000)
          return signupData;
        }
      })
    }

    // helper function for Form Navigation
    getSection(array) {
      return Array.from(array).find((entry) => {
          let [key, value ] = entry;
          if (value.classList.contains("show")) return entry
      })
    }

    // helper function for Form Navigation
    navigateForm (sectionMap, currentIndex, getMapKey) {
      let targetKey = getMapKey;
      let targetSection = sectionMap.get(targetKey);
      targetSection.classList.remove("hide");
      targetSection.classList.add("show");
      sectionMap.get(currentIndex).classList.remove("show");
      sectionMap.get(currentIndex).classList.add("hide");
    }

    // formNavigation for Long form
    formNavigation(formHTML) {
      let allSections = formHTML.querySelectorAll(".form-section");
      const sectionMap = new Map ();
      allSections.forEach((section, index) => {
        sectionMap.set((index +1).toString(), section);
      })
      let nextBtn = document.querySelector("#nextBtn");
      let prevBtn = document.querySelector("#prevBtn");
      let signUpBtn = document.querySelector("#signupBtn");
      
      nextBtn.addEventListener("click", (e)=> {
        let currentSecArr = this.getSection(sectionMap.entries());
        let [currentIndex, currentSection] = currentSecArr;
        console.log(this.validateFormSection (currentSection))
        if (this.validateFormSection (currentSection)) {
          if (parseInt(currentIndex) > 0) { prevBtn.style.display = "block"; }
          if ((parseInt(currentIndex) + 1) === allSections.length) {
            e.target.classList.add("hide");
           signUpBtn.style.display = "block";
          }
          if (currentIndex < allSections.length) {
            this.navigateForm(sectionMap, currentIndex, (parseInt(currentIndex) + 1).toString())
          }        
        }
      })
      prevBtn.addEventListener("click", (e)=> {
        let currentSecArr = this.getSection(sectionMap.entries());
        let [currentIndex, currentSection] = currentSecArr;
        console.log(parseInt(currentIndex) <= 2, parseInt(currentIndex))
        if (parseInt(currentIndex) <= 2) {
         prevBtn.style.display = "none";          
        }
        if (parseInt(currentIndex) <= allSections.length) {
          nextBtn.classList.remove("hide");
         signUpBtn.style.display = "none";
        }
        if (currentIndex > 1) {
          this.navigateForm(sectionMap, currentIndex, (parseInt(currentIndex) - 1).toString())
        }
      })
    }

    // invalidates empty fields
    validateFormSection (section) {
      const allFields = section.querySelectorAll("input, select");

      for (const field of allFields) {
        if (field.value === "" || field.value === "0") {
          console.log(field.value)
          return false;
        } 
      }
      return true
    }   

    // adds event action to button array
    btnEvent(elemArray, formElem, mainElem, param) {
      elemArray.forEach(btn => {
        btn.addEventListener("click", () => {        
            let [windowPath, params] = classURLParam.getURL(); // destructuring
            console.log((params.get(this.mainParam) !== param), param)
            switch (true) {
                case (classURLParam.checkParam(this.mainParam) && params.get(this.mainParam) !== param) : {
                    classURLParam.setURL(this.mainParam, param);
                    this.getUserState(formElem, mainElem) 
                    break;
                }
                case (classURLParam.checkParam(this.mainParam)): {
                    console.log(classURLParam.checkParam(this.mainParam), params.get(this.mainParam), param, "delete")
                    classURLParam.deleteParam(this.mainParam, param)
                    formElem.innerHTML = "";
                    this.getUserState(formElem, mainElem); 
                    break;
                }
                case ((!classURLParam.checkParam(this.mainParam))) :  {
                    console.log((!classURLParam.checkParam(this.mainParam)), "does not")        
                    classURLParam.setURL(this.mainParam, param);
                    this.getUserState(formElem, mainElem); 
                    break;
                }
            }
      
        });
      })
    } 
    
    // displayElem(formElem, mainElem) {
    //   let formDisplay = window.getComputedStyle(formElem).display;
    //   formElem.style.display = (formDisplay === "none") ? "block" : "none";
    //   mainElem.style.display = formElem.style.display === "block" ? "none" : "block";
    // }
    
    displayElem(formElem, mainElem) {
      //mainElem.style.display = formElem.querySelector("form") ? "none" : "block";
      console.log(formElem.children.length)
      mainElem.style.display = formElem.children.length > 0 ? "none" : "block";
    }
  
    // param based form creation 
    createForm (formElem, param) {
      if (param === this.loginForm) {
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
         animateElem.animateFade(formElem);
        this.getLoginData (document.querySelector("#loginForm"))
      } else if (param === this.signUpForm) {
        formElem.innerHTML = 
          `          
            <form action="/signup" method="POST" class="container mt-5" id="signupForm">
      <div class="mb-4 form-section show">
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
  
  
      <div class="mb-4 form-section hide">
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
  
      <div class="mb-4 form-section hide">
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
  
      <div class="mb-4 form-section hide">
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
  
      <div class="mb-4 form-section hide">
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
  
      <div class="mb-4 form-section hide">
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
  
      <div class="mb-4 form-section hide">
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
  
      <div class="mb-4 form-section hide">
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
  
      <div class="mb-4 form-section hide">
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
        
        <div class="btn-wrap">
        <div class="text-end mb-5">
            <button id="prevBtn" >Previous</button>
        </div>
        <div class="text-end mb-5">
            <button id="nextBtn" >Next</button>
        </div>
        <div class="text-end mb-5">
          <button type="submit" id="signupBtn">Sign Up</button>
        </div>
            
        </div>
            </form>
          
          `
       
        animateElem.animateFade(formElem);
        this.getSignUpData(document.querySelector("#signupForm"))
        }
    }
      
    createDashboard(parentNode, data){  
      parentNode.innerHTML = `
       <div class="dashboard-wrap">
                 <div class="btn-wrap"> 
                 <i class="ph ph-pencil"></i>
                 <i class="ph ph-sign-out"></i> 
                 </div>
                 <div class="basic-details">
                     <div class="img-wrap">
                         <img src="https://dummyjson.com/icon/emilys/128" alt="">
                     </div>
 
                     <div class="text-details">
                         <div class="name-wrap">
                             <h4> ${data.firstName}</h4>
                             <h4> ${data.lastName}</h4>
 
                         </div>
 
                         <div class="info-wrap">
                             <p>
                               <strong>${data.role} : ${data.ip} - ${data.macAddress}</strong>
                             </p>
                         </div>
                         
                     </div>
 
                     <hr>
 
                 </div>
 
                 <div class="main-details">
                     <div class="account-details">
                         <h5> Account Details</h5>
                         <p>
                             <strong> Username : </strong>
                             <span>${data.username}</span>
                         </p>
                         <p>
                             <strong> Password : </strong>
                             <span>${data.password}</span>
                         </p>
                         <p>
                             <strong> Email : </strong>
                             <span>${data.email}</span>
                         </p>
                         <p>
                             <strong> Phone : </strong>
                             <span>${data.phone}</span>
                         </p>
                         <p>
                             <strong> Age : </strong>
                             <span>${data.age}</span>
                         </p>
                         <p>
                             <strong> Gender : </strong>
                             <span>${data.gender}</span>
                         </p>
                         <p>
                             <strong> Birthdate : </strong>
                             <span>${data.birthDate}</span>
                         </p>
 
                         
                     </div>
 
 
 
                     <div class="address-details">
                         <h5> Address Details </h5>
                         <p>
                             <strong> Address : </strong>
                             <span>${data.address.address}</span>
                         </p>
                         <p>
                             <strong> City : </strong>
                             <span>${data.address.city}</span>
                         </p>
                         <p>
                             <strong> State : </strong>
                             <span>${data.address.state}</span>
                         </p>
                         <p>
                             <strong> State Code : </strong>
                             <span>${data.address.stateCode}</span>
                         </p>
                         <p>
                             <strong> Postal Code : </strong>
                             <span>${data.address.postalCode}</span>
                         </p>
                         <p>
                             <strong> Coordinates : </strong>
                             <span>Latitude: ${data.address.coordinates.lat}, Longitude: ${data.address.coordinates.lng}</span>
                         </p>
                         <p>
                             <strong> Country : </strong>
                             <span>${data.address.country}</span>
                         </p>
                     </div>
 
 
 
                     <div class="bank-details">
                         <h5> Bank Details</h5>
                         <p>
                             <strong> Card Expiry : </strong>
                             <span>${data.bank.cardExpire}</span>
                         </p>
                         <p>
                             <strong> Card Number : </strong>
                             <span>${data.bank.cardNumber}</span>
                         </p>
                         <p>
                             <strong> Card Type : </strong>
                             <span>${data.bank.cardType}</span>
                         </p>
                         <p>
                             <strong> Currency : </strong>
                             <span>${data.bank.currency}</span>
                         </p>
                         <p>
                             <strong> IBAN : </strong>
                             <span>${data.bank.iban}</span>
                         </p>
                     </div>
 
 
 
                     <div class="crypto-details">
                         <h5> Crypto Details</h5>
                         <p>
                             <strong> Coin : </strong>
                             <span>${data.crypto.coin}</span>
                         </p>
                         <p>
                             <strong> Wallet Address : </strong>
                             <span>${data.crypto.wallet}</span>
                         </p>
                         <p>
                             <strong> Network : </strong>
                             <span>${data.crypto.network}</span>
                         </p>
                     </div>
 
 
                 </div>
 
 
             </div>` 
    }

    loggedIn = false;

    loggedInState(userProfile) {
      let [windowPath, params] = classURLParam.getURL(); // destructuring
      classURLParam.setURL(this.loginParam, userProfile.username)
      this.loggedIn = true;
      
      // hides login and signup buttons 
      document.querySelectorAll(".ph-sign-in, .ph-user-plus").forEach(elm => {
        elm.closest(".nav-item").classList.add("hide");
      })
      // shows profile image
      document.querySelectorAll(".userProfile").forEach(elm => {
        elm.classList.remove("hide");
        elm.querySelector("img").src = userProfile.image;
      })

    }
  
    async getUserState(formParentElem, mainElem) {
      let [windowPath, params] = classURLParam.getURL(); // destructuring
      if (!formParentElem || !mainElem) return;
      console.log(classCookieManager.checkCookie(this.cookieKeyOne), classCookieManager.checkCookie(this.cookieKeyOne) !== undefined)

      let userProfile; 
      if (classCookieManager.checkCookie(this.cookieKeyOne) !== undefined) {
        userProfile = await callAPI.fetchData ('https://dummyjson.com/user/me', "GET", classCookieManager.checkCookie(this.cookieKeyOne));
        console.log(userProfile)
        this.loggedInState(userProfile);        
      }



      if (classURLParam.checkParam(this.mainParam)) {
        let currentParam = params.get(this.mainParam);
        if(this.loggedIn) return classURLParam.setURL(this.mainParam, this.displayDashboard), this.createDashboard(formParentElem, userProfile),this.displayElem(formParentElem, mainElem);

        if (currentParam === this.loginForm) {
          this.createForm (formParentElem, this.loginForm);  
        } else if (currentParam === this.signUpForm) {
          this.createForm (formParentElem, this.signUpForm);        
        }
        this.displayElem(formParentElem, mainElem);
      }
      else {
        this.displayElem(formParentElem, mainElem);
      }
    }
  }