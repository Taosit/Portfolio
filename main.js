const sendButton = document.querySelector(".send-button");
const contactCard = document.querySelector(".contact-card");
const sections = document.querySelectorAll("section")

const navItemContainer = document.querySelector(".nav-items");
const navItems = navItemContainer.querySelectorAll("span");

const navCollapsItemContainer = document.querySelector(".nav-collapse");
const navCollopasItems = navCollapsItemContainer.querySelectorAll("div");

sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    contactCard.classList.add("sent");
})

window.onscroll = (e) => {
    let current = "home";
  
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 48 ) {
        console.log({screenY:e.scrollY, sectionTop})
        current = section.getAttribute("id"); }
    });
    
    console.log({current})
    navItems.forEach((span) => {
    span.classList.remove("active");
      if ([...span.classList].some(className => className.includes(current))) {
        span.classList.add("active");
      }
    });

    navCollopasItems.forEach((span) => {
      span.classList.remove("active-item-collapse");
        if ([...span.classList].some(className => className.includes(current))) {
          span.classList.add("active-item-collapse");
        }
      });
  };