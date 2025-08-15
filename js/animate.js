const { animate, utils, createDraggable, createSpring, inOutElastic } = anime;

// animation Class for animating elements
class Animation {
  animateFade(elem, duration) {
    animate(elem, {
      opacity: [{ from: 0, to: 1, ease: "inOut(3)", duration: duration }],
    });
  }
  animateIn(elem) {
    animate(elem, {
      scale: [
        { to: 1.25, ease: "inOut(3)", duration: 200 },
        { to: 1, ease: createSpring({ stiffness: 300 }) },
      ],
      //loop: true,
      //loopDelay: 250,
    });
  }
  animateInDown(elem) {
    animate(elem, {
      translateY : "0.5rem",
      scale: { from:0, to: 1, ease: "inOut(3)", duration: 200 },
    });
  }
  animateInUp(elem) {
    animate(elem, {
      translateY : "-1rem",
      opacity: { to: 0, ease: "inOut(3)", duration: 2000 },
      scale: { to: 0, ease: "inOut(3)", duration: 2000 },
    });
  }
  animateOut(elem) {
    animate(elem, {
      scale: [{ to: 0, ease: "inOut(3)", duration: 200 }],
      opacity: [{ to: 0, ease: "inOut(3)", duration: 200 }],
    });
  }
  animatePopup (element) {
    animate(element, {
      scale: [
        { to: 1.05, ease: "out(1.175)", duration: 200 },
        { to: 1, ease: createSpring({ stiffness: 300 }) },
      ],
    });  
  }  
  
};
export const animateElem = new Animation;    // initialized the class