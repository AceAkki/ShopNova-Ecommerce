document.addEventListener("DOMContentLoaded", () => {
  let sliderContainer = document.querySelector(".slider-container");
  let sliderWrapper = document.querySelector(".slider-wrapper");

  let defaultprop = 0;
  let currentProp = 0;
  let childWidth = sliderWrapper.firstElementChild.clientWidth;
  let childrenLength = sliderWrapper.children.length;

  document.querySelector(".slider-nav").addEventListener("click", (e) => {
    if (e.target.classList.contains("slider-prev")) {
        prevSlide()
    } else {
        nextSlide()
    }
  });
  
  setInterval(  ()=> {
    nextSlide();
  }, 5000)

  function nextSlide() {
    console.log("click", currentProp + childWidth < childWidth * childrenLength)
    if (currentProp + childWidth < childWidth * childrenLength) {
        console.log(currentProp + childWidth < childWidth * childrenLength)
      currentProp = currentProp + childWidth;
      sliderWrapper.style.transform = `translateX(-${currentProp}px)`;
    } else {
        sliderWrapper.style.transform = `translateX(-${defaultprop}px)`;
        currentProp = 0

    }
  }
  
  function prevSlide() {
    if (currentProp > 0) {
      currentProp = currentProp - childWidth;
      sliderWrapper.style.transform = `translateX(-${currentProp}px)`;
    }
  }

});
