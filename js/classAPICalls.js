export class APICalls {
  constructor({ apiURL }) {
   this.apiURL = apiURL;
   this.data
  }

  async fetchData(apiURL, method, bodyData) {
    this.data = null;

    try {
      const response = await fetch(this.requestCall(apiURL, method, bodyData));
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      this.data = data;
      return data;
    } catch (error) {
      console.error(`Failed Operations due to : ${error}`);
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
}
