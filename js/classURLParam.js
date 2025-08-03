export class URLParam {
  setURL(param, value) {
    let [windowPath, params] = this.getURL(); // destructuring
    if (params.has(param)) {
      params.delete(param);
    }
    if (param && value) {
      params.set(param, value);
      let newURL = `${window.origin}${window.location.pathname}?${params.toString()}`; // using origin and pathname keeps this clean
      window.history.replaceState({}, "", newURL);
    }
  }

  getURL() {
    // gets the location, gets search params
    return [window.location, new URLSearchParams(window.location.search)];
  }
}

