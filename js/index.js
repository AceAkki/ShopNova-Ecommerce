import { APICalls } from "./classAPICalls.js";


(async () => {  
 // await getData('https://dummyjson.com/users');
})();

document.addEventListener("DOMContentLoaded", ()=> {
  let formElm = document.querySelector("#loginForm");
  console.log(formElm)
  let loginData; 
  let userProfile;
  formElm.addEventListener("submit", async (event) => {
    let formData = callAPI.getFormData(formElm, event);
    loginData = await retrieveData ('https://dummyjson.com/user/login', "POST", formData);
    userProfile = await retrieveData ('https://dummyjson.com/user/me', "GET", loginData.accessToken);
    console.log(loginData, userProfile); 
  })
})

const callAPI = new APICalls({
  formElement : "#loginform",
  errorClass : "api-error"
})

async function getData(apiURL) {
  await callAPI.fetchData(apiURL);
  usersData = callAPI.data;
}

async function retrieveData (apiURL, method, callValue) {
    await callAPI.fetchData(apiURL, method, callValue);
    return callAPI.data;
}
