/*
Author : Akshay P
Last Modified On :  2025 Sept 24th
Last Modified By : Akshay P
Important : 
  -  needs constructor parameters filled to work properly, 
  -  depends on URLParam class for state management, 
  -  need item creator function that will create the elements and return it, 
  -  needs phosphor-icons library for icons
Comments : pagesize, max page navigation, sorting list can be controlled with constructor params 
Change Log : 
  [2025-09-24] - Added this.stringParam parameter to avoid mistakes in future 
  [2025-09-24] - Updated logic for fallback if page limit is large, now takes user to the last page  
*/

import { URLParam } from "./classURLParam.js";

const classURLParam = new URLParam ();

export class Pagination {
  constructor({pageSize, maxPageNum, enableSortList, itemCreator, itemClassSelector, headerClassSelector, param}) {
    this.pageSize = pageSize || 10;   // page elements count
    this.currentPage = 0; // starts with 0    
    this.defaultPage = 1;  

    this.maxPageNum = maxPageNum || 4;  // max page numbers visible to users    
    this.enableSortList = enableSortList || false; // enable for String based sort
    this.itemClassSelector = itemClassSelector || "univ-list-item"; // uni item class
    this.headerClass = headerClassSelector || "header-box"; // header class
    this.param = param || "page"; 
    this.itemCreator = itemCreator;

    this.stringParam = "getParam"

    this.paginatedData = [];
    this.navigationArrays = [];  
  }

  // -----------------------------------------------------------------------------------------

  // parameters - data (array), navigation element, container to display data
  initiatePagination(data, pageNavElm, container) {
    // emptied for multiple initialisations of the method 
    this.paginatedData = [];
    this.navigationArrays = []; 
    this.currentPage = 0;

    if ((Array.isArray(data)) && data.length > 0 ) {
      // if enabled through the constructor parameter then sorts the list
      (this.enableSortList) ? this.sortList(data) : console.log("Data Not Sorted, Enable with [ enableSortList:true ]"); 
      for (let i = 0; i < data.length; i += this.pageSize) {
        // creates and pushes mini array's of data to paginatedData
        this.paginatedData.push(data.slice(i, i + this.pageSize));
      }
      // populates all elements, navigation
      this.renderPage(pageNavElm, container);
      this.checkURL(pageNavElm, container);  
    } else {
      console.log(`Failed to load Data - ${data}`)
    }
  }

  // sorts data based on string 
  sortList(data) {
    // gets first object's keys
    let getKeys = Object.keys(data[0]);
    // gets first string value that doesn't include forward slash "/" 
    let stringValue = getKeys.find(key => {
      return typeof(data[0][key]) === "string" && !(data[0][key].includes("/")) 
    })
    // if string value exists then sorts the list
    if (stringValue) {
      data.sort((a, b) => a[stringValue].localeCompare(b[stringValue]) );
    } else {
      console.log("No Valid String found to sort the data")
    }
  }

  // it can do two things - get URL param if such is mentioned or it will populate items
  checkURL(pageNavElm, container, getParam) {
    let [windowPath, params] = classURLParam.getURL();
    // in case param does not exist then it logs it
    if (!(params.has(this.param))) console.log(`${this.param} param doesn't exists`);

    // curretparam is used to track current position of the url and accordinly update the content
    let currentParam = parseInt(params.get(this.param));

    // in case of minus or NaN value set to 1 to avoid errors
    if (isNaN(currentParam) || currentParam <= 0) { currentParam = 1 };

    switch (getParam) {
      case this.stringParam :
        // returns the param if explicitly asked for
        return currentParam;
      break
      default:
        // sets nav button to active based on the URL param, updates the param 
        if (params.has(this.param)) {
          let getActivePg = Array.from(pageNavElm.querySelectorAll("li a.page-num")).find(elm => parseInt(elm.dataset.value) === currentParam);
    
          // if current navigation has the number that makes it active and populates all items 
          if (getActivePg) {
            pageNavElm.querySelectorAll("a.active").forEach((elm) => elm.classList.remove("active"));
            getActivePg.classList.add("active");  
            classURLParam.setURL(this.param, this.getActivePage(pageNavElm));
            this.populateItems(container, currentParam);
            this.scrollToElement(container.querySelector(`.${this.itemClassSelector}`));
          };
          // if page nav does't exists then it will load new nav then its content
          if (currentParam && !(getActivePg)) {
            // checks if current param is within the data length, accordingly it loads to content
            if (!(currentParam > this.paginatedData.length)) {
              let tempNum = currentParam - 1;
              let indexNum;
              // gets indexOf the tempNum then searches through that array to find 1 then sets its index num
              Array.from(this.navigationArrays.map(arr => arr.indexOf(tempNum))).forEach((elem, index) => {
                if (elem > -1) {
                  indexNum = index;
                }
              });
              this.populateSections({
                pageNavElm : pageNavElm, container: container, 
                sectionIndex: indexNum, pageIndex: parseInt(params.get(this.param))});
            } else {
              classURLParam.setURL(this.param, this.paginatedData.length);
              // loads the default page in scenario of param being higher number than data length
              // this.populateSections(pageNavElm, container, this.currentPage, this.currentPage);

              // loads last page in scenario of param being higher number than data length
              this.populateSections({
                pageNavElm : pageNavElm, container: container, sectionIndex: Array.from(this.navigationArrays.map(arr => arr.indexOf(this.paginatedData.length -1 ))).findIndex(elem => elem > -1), pageIndex: this.paginatedData.length});
            }
          };

        }
        break;
    }

  }

  // helper method used in checkURL poppulates all elems and nav
  populateSections ({pageNavElm, container, sectionIndex, pageIndex}) {
    this.populateItems(container, pageIndex);
    this.renderPageNavigation(pageNavElm, sectionIndex);
    this.addEventListenerPageNav(pageNavElm, container);
    // recursive issue - (priority - Medium)
    //this.checkURL(pageNavElm, container);  
    this.scrollToElement(container.querySelector(`.${this.itemClassSelector}`));
  }

  // renders all items and navigation
  renderPage(pageNavElm, container) {
    // adds prev Nav button
    this.addNav(pageNavElm, "prev");
    for (let i = 0; i < this.paginatedData.length; i += this.maxPageNum) {
      // creates array from length size of paginatedData then pushes mini array's to navigationArrays
      this.navigationArrays.push(Array.from(Array(this.paginatedData.length).keys()).slice(i, i + this.maxPageNum));
    }
    // pageNums are created, initiatin with 0
    this.renderPageNavigation(pageNavElm, this.currentPage);
    // unis are poppulated based on the number provided by active class's textcontent
    this.populateItems(container, this.getActivePage(pageNavElm));
    // adds page Nav
    requestAnimationFrame( ()=> {
      this.addEventListenerPageNav(pageNavElm, container);
    })
  }

  // populates all unis
  populateItems(container, num) {
    let itemArray = this.paginatedData[num-1];
    if (itemArray) {
      container.innerHTML = "";
      //container.querySelectorAll(`.${this.itemClassSelector}`).forEach((uni) => uni.remove());
      if(typeof(this.itemCreator) === "function") {
        // creates fragment & callback function creates all elements adds it to fragment then we add fragment to container this saves memory usage and increases overall speed
        const fragment = new DocumentFragment ();
        itemArray.forEach((item) => {
          let createItem = this.itemCreator(item, this.itemClassSelector); // callback function that needs to be created 
          fragment.appendChild(createItem);
        });
        container.appendChild(fragment);
      } else {
        console.log(`${this.itemCreator} is not a function`)
      }
    };  
  }

  // populate page nums
  renderPageNavigation(pageNavElm, num) {
    // remove all li elems
    pageNavElm.innerHTML = "";
    let indexNum = num;
    if (num <= 0 || num > this.paginatedData.length) { indexNum = 0 };
    // if num is bigger add prevNav button    
    if (indexNum > 0) { this.addNav(pageNavElm, "prev") };
    // created nav from navigationArrays based on indexNum value
    this.currentPage = indexNum;
    this.navigationArrays[indexNum].forEach((a, index) => {
        let createLi = document.createElement("li");
        let createHref = document.createElement("a");
        createLi.style.cursor = "pointer";
        createHref.textContent = a + 1;
        createHref.setAttribute("data-value", a + 1);
        createHref.classList.add("page-num");
        pageNavElm.appendChild(createLi);
        createLi.appendChild(createHref);
        if (a+1 === this.checkURL(undefined, pageNavElm, this.stringParam)) {
          createHref.classList.add("active");
        }

    });
    // num + 2 to match 0 index with navigationArrays length, adds next Button 
    if (indexNum + 2 <= this.navigationArrays.length) { this.addNav(pageNavElm, "next") };
  }

  // add page navigation
  addEventListenerPageNav(pageNavElm, container)  {
    // selects all li elements of page navigation
    pageNavElm.querySelectorAll("li").forEach((liElm) => {
      // adds click event listener
      liElm.addEventListener("click", () => {
        // removes all active classes
        pageNavElm.querySelectorAll("a.active").forEach((elm) => elm.classList.remove("active"));
        // if it's left arrow or back arrow
        this.arrowNavigation (pageNavElm, container, liElm, "ph-arrow-left", "minus");
        // if it's right arrow or next arrow
        this.arrowNavigation (pageNavElm, container, liElm, "ph-arrow-right", "add");
        if (liElm.querySelector(".page-num")) {
          // adds active class to the element
          liElm.querySelector("a").classList.add("active");
          classURLParam.setURL(this.param, this.getActivePage(pageNavElm));
          this.populateItems(container, this.getActivePage(pageNavElm));
        }
        // populate unis based on the active num
        setTimeout( ()=> {
          this.checkURL(pageNavElm, container);
        }, 20)
      });
    });
  }

  // helper method to add event listener on navigation buttons
  arrowNavigation (pageNavElm, container, liElm, selector, operation) {
    if (liElm.querySelector("i") && liElm.querySelector("i").classList.contains(selector)) {
      //liElm.remove();
      let paramNum = this.checkURL(pageNavElm, container, this.stringParam);
      if (isNaN(paramNum)) paramNum = 1; 

      // based on selector it either adds or minus page nav
      switch (operation) {
        case "add":
          setTimeout( ()=> {
            classURLParam.setURL(this.param, paramNum + 1);
          }, 10);
        break;
        case "minus" :
          setTimeout( ()=> {
            classURLParam.setURL(this.param, paramNum - 1);
          }, 10);
        break;
        default:
          console.log("Failed to match Operations")
        break;
      }
    }
  }

  // scrolls to the element
  scrollToElement (element) {
    const header = document.querySelector(`.${this.headerClass}`);
    // if element and header exists then scroll to that element 
    if (element && header) {
      var headerOffset = header.getBoundingClientRect().height + 10;
      // element's position from top to viewport height
      var elementPosition = element.getBoundingClientRect().top;
      // we get position by minusing element position from header height
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      setTimeout(()=> {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100)
    } else {
      console.error(`Failed to find element - ${element}, ${header}`)
    }    
  }

  // helper method that creates previous or next arrow
  addNav(pageNavElm, type) {
    let createLi = document.createElement("li");
    switch (type) {
      case "prev":
        createLi.setAttribute("title","Previous Section");
        createLi.innerHTML = `<a class="nav"><i class="ph ph-arrow-left"></i> </a>`;
        // pageNavElm.appendChild(createLi);        
        break;
      case "next":
        createLi.setAttribute("title","Next Section");
        createLi.innerHTML = `<a class="nav"><i class="ph ph-arrow-right"></i></a>`;
        // pageNavElm.appendChild(createLi);    
        break;    
      default:
        createLi.setAttribute("title","Section");
        createLi.innerHTML = `<a class="nav"><i class="ph ph-arrow-u-up-left"></i></a>`;
        break;
      }
    pageNavElm.appendChild(createLi);   
  }

  // helper method that returns active page's data-value as Int
  getActivePage(pageNavElm) {
    let active = pageNavElm.querySelector("a.active");
    if(active) { 
      return parseInt(active.dataset.value);
    }
    else {
      return this.defaultPage;
    }
  }


}

