export class CookieManager {
  setCookie(cookieName, cookieValue, mins) {
    const expTime = new Date();
    expTime.setTime(expTime.getTime() + mins * 60 * 1000);
    let expires = "expires=" + expTime.toUTCString();
    document.cookie =
      cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    console.log(document.cookie, expTime);
  }

  getCookie(cookieName) {
    let cookieKey = cookieName + "=";
    let cookieArray = document.cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      // for cookies with blank space, gets rest string with substring
      while (cookie.charAt(0) == " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieKey) == 0) {
        return cookie.substring(cookieKey.length, cookie.length);
      }
    }
    return "";
  }

  checkCookie(cookieKey) {
    let cookieValue = this.getCookie(cookieKey);
    if (cookieValue != "") {
        return cookieValue;
    } else {
        console.log(`No cookies exist with key ${cookieKey}`)
        return        
    }
  }
}
