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
    // gets first string value that doesn't include forward slash "/" 9
    let stringValue = getKeys.find(key => {
      return typeof(data[0][key]) === "string" && !(data[0][key].includes("/")) 
    })
    if (stringValue) {
      data.sort((a, b) => a[stringValue].localeCompare(b[stringValue]) );
    } else {
      console.log("No Valid String found to sort the data")
    }
  }

  checkURL(pageNavElm, container, getParam) {
    let [windowPath, params] = classURLParam.getURL();
    if (!(params.has(this.param))) console.log(`${this.param} param doesn't exists`);

    let currentParam = parseInt(params.get(this.param));
    if (isNaN(currentParam) || currentParam <= 0) { currentParam = 1 };

    switch (getParam) {
      case "getParam":
        return currentParam;
      break
      default:
        if (params.has(this.param)) {
          let getActivePg = Array.from(pageNavElm.querySelectorAll("li a.page-num")).find(elm => parseInt(elm.dataset.value) === currentParam);
    
          if (getActivePg) {
            pageNavElm.querySelectorAll("a.active").forEach((elm) => elm.classList.remove("active"));
            getActivePg.classList.add("active");  
            classURLParam.setURL(this.param, this.getActivePage(pageNavElm));
            this.populateItems(container, currentParam);
            this.scrollToElement(container.querySelector(`.${this.itemClassSelector}`));
          };
          if (currentParam && !(getActivePg)) {
            if (!(currentParam > this.paginatedData.length)) {
              let tempNum = currentParam - 1;
              let indexNum;
              Array.from(this.navigationArrays.map(arr => arr.indexOf(tempNum))).forEach((elem, index) => {
                if (elem > -1) {
                  indexNum = index;
                }
              });
              this.populateSections(pageNavElm, container, indexNum, parseInt(params.get(this.param)));
            } else {
              classURLParam.setURL(this.param, this.getActivePage(pageNavElm));
              this.populateSections(pageNavElm, container, this.currentPage, this.currentPage);
            }
          };

        }
        break;
    }

  }

  populateSections (pageNavElm, container, sectionIndex, pageIndex) {
    this.populateItems(container, pageIndex);
    this.renderPageNavigation(pageNavElm, sectionIndex);
    this.addEventListenerPageNav(pageNavElm, container);
    // recursive issue - (priority - Medium)
    //this.checkURL(pageNavElm, container);  
    this.scrollToElement(container.querySelector(`.${this.itemClassSelector}`));
  }

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
    // craeted nav from navigationArrays based on indexNum value
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
        if (a+1 === this.checkURL(null, pageNavElm, "getParam")) {
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

  arrowNavigation (pageNavElm, container, liElm, selector, operation) {
    if (liElm.querySelector("i") &&liElm.querySelector("i").classList.contains(selector)) {
      //liElm.remove();
      let paramNum = this.checkURL(pageNavElm, container, "getParam");
      if (isNaN(paramNum)) paramNum = 1; 
      switch (operation) {
        case "add":
          console.log(this.currentPage);
          this.populateSections(pageNavElm,container,this.currentPage,paramNum + 1);
          setTimeout(() => {
            classURLParam.setURL(this.param, paramNum + 1);
          }, 10);
        break;
        case "minus":
          this.populateSections(pageNavElm,container,this.currentPage,paramNum - 1);
          setTimeout(() => {
            classURLParam.setURL(this.param, paramNum - 1);
          }, 10);
        break;
        default:
          console.log("Failed to match Operations");
        break;
      }    
    }
  }

  // scrolls to the element
  scrollToElement (element) {
    const header = document.querySelector(`.${this.headerClass}`);
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

  // returns active page's data-value as Int
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