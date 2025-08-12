import { APICalls } from "./classAPICalls.js";
import { URLParam } from "./classURLParam.js";

const classURLParam = new URLParam ();
const callAPI = new APICalls({
    msgClass : "form-message",
    msgColor : "var(--danger-color)"
  })

export class UserMain {
    constructor ({ mainKey, stateLogin, stateSignup}) {
      this.mainParam = mainKey || "user";
      this.loginState = stateLogin || "login";
      this.signUpState = stateSignup || "signup";
  
    }
  
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
  
    addEventParam(elemArray, formElem, mainElem, param) {
      elemArray.forEach(btn => {
        btn.addEventListener("click", () => {        
            let [windowPath, params] = classURLParam.getURL(); // destructuring
            console.log((params.get(this.mainParam) !== param), param)
            switch (true) {
                case (classURLParam.checkParam(this.mainParam) && params.get(this.mainParam) !== param) : {
                    classURLParam.setURL(this.mainParam, param);
                    this.getUserStateURL(formElem, mainElem) 
                    break;
                }
                case (classURLParam.checkParam(this.mainParam)): {
                    console.log(classURLParam.checkParam(this.mainParam), params.get(this.mainParam), param, "delete")
                    classURLParam.deleteParam(this.mainParam, param)
                    formElem.innerHTML = "";
                    this.getUserStateURL(formElem, mainElem); 
                    break;
                }
                case ((!classURLParam.checkParam(this.mainParam))) :  {
                    console.log((!classURLParam.checkParam(this.mainParam)), "does not")        
                    classURLParam.setURL(this.mainParam, param);
                    this.getUserStateURL(formElem, mainElem); 
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
    <form action="/signup" method="POST" class="container mt-5" id="signupForm">
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
        <button type="submit" >Sign Up</button>
      </div>
    </form>
          `
      }
    }
  
    getUserStateURL(formElem, mainElem) {
      let [windowPath, params] = classURLParam.getURL(); // destructuring
      if (!formElem || !mainElem) return;

      if (classURLParam.checkParam(this.mainParam)) {
        let currentParam = params.get(this.mainParam);
        if (currentParam === this.loginState) {
          this.createForm (formElem, this.loginState);  
        } else if (currentParam === this.signUpState) {
          this.createForm (formElem, this.signUpState);        
        }
        this.displayElem(formElem, mainElem);
      }
      else {
        this.displayElem(formElem, mainElem);
      }
    }
  }