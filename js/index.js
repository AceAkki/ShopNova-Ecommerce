import { APICalls } from "./classAPICalls.js";

const callAPI = new APICalls({});
let usersData;

(async () => {  
  await getData('https://dummyjson.com/users');
})();

document.addEventListener("DOMContentLoaded", ()=> {
  let formElm = document.querySelector("#loginForm");
  let loginData; 
  let userProfile;
  formElm.addEventListener("submit", async (event) => {
    let formData = callAPI.getFormData(formElm, event);
    loginData = await retrieveData ('https://dummyjson.com/user/login', "POST", formData, formElm);
    userProfile = await retrieveData ('https://dummyjson.com/user/me', "GET", loginData.accessToken);
    console.log(loginData, userProfile); 
  })
})


async function getData(apiURL) {
  await callAPI.fetchData(apiURL);
  usersData = callAPI.data;
}

async function retrieveData (apiURL, method, callValue, container) {
    await callAPI.fetchData(apiURL, method, callValue, container);
    return callAPI.data;
}
