export class APICalls {
  constructor({msgClass }) {
   this.msgSelector = msgClass;
   
  }

  async fetchData(apiURL, method, bodyData, HTMLElement) {
    let errorMSg; 
    try {
      const response = await fetch(this.requestCall(apiURL, method, bodyData));
      if (!response.ok) {
        errorMSg = await response.json();        
        throw new Error(`Response status: ${response.status} ${errorMSg.message}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`${error, errorMSg.message}`);
      this.errorMessage(HTMLElement, errorMSg.message);      
    }
  }

  getFormData(form, event) {    
    event.preventDefault();
    const formData = new FormData(form);
    let bodyData = new Object();
    for (const pair of formData.entries()) {
      Object.defineProperty(bodyData, pair[0], {
        value: pair[1],
        enumerable: true
      })
    }
    return bodyData;
  }

  requestCall(apiURL, method, callValue){
    let myHeaders = new Headers();
  
    switch (method) {
      case 'POST': {
        const request = new Request(apiURL, {
          method: method,
          headers : {'Content-Type': 'application/json'},
          body: JSON.stringify(callValue)
        })
        return request;
      }
      case 'GET' : {
        const request = new Request(apiURL, {
          method: method,
          headers : {
            'Authorization': `Bearer ${callValue}`
          }
        })
        return request;        
      }
      default:
        const request = new Request(apiURL)
        return request;
    }    
  }
  
  message(parent, message) {
    let createElm = document.createElement("p");
    createElm.classList.add(this.msgSelector);
    createElm.style.color = "Red"
    createElm.textContent = message;
    parent.appendChild(createElm);
  }
}
