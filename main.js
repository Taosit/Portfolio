const sendButton = document.querySelector(".send-button");
const contactCard = document.querySelector(".contact-card");
const sections = document.querySelectorAll("section");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");

const nameErrorMessage = document.querySelector(".name-error-message");
const emailErrorMessage = document.querySelector(".email-error-message");
const messageErrorMessage = document.querySelector(".message-error-message");

const navItemContainer = document.querySelector(".nav-items");
const navItems = navItemContainer.querySelectorAll("span");

const navCollapsItemContainer = document.querySelector(".nav-collapse");
const navCollopasItems = navCollapsItemContainer.querySelectorAll("div");

const airplaneContainer = document.querySelector(".airplane-container");

const projectImageContainers = document.querySelectorAll(".individual-project-image-container");

const buttonGroups = document.querySelectorAll(".button-group");

/*
------------------Navbar update and airplane rotation---------------------
*/
const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

let rotationDegrees = 0;
let airplaneTimer;

const getCurrentSection = () => {
  let current = "home";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 48 ) {
      current = section.getAttribute("id"); 
    }
  });
  return current;
}

const updateNavItems = (currentSection, navItems, activeClassName) => {
  navItems.forEach((span) => {
    span.classList.remove(activeClassName);
    if ([...span.classList].some(className => className.includes(currentSection))) {
      span.classList.add(activeClassName);
    }
  });
}

const balanceAirplane = () => {
  if (airplaneTimer) return;
  airplaneTimer = setInterval(() => {
    if (rotationDegrees > 1) {
      if (rotationDegrees > -35) rotationDegrees -= 0.08;
    } else if (rotationDegrees < 0) {
      if (rotationDegrees < 35) rotationDegrees += 0.08;
    } else {
      clearInterval(airplaneTimer);
      airplaneTimer = null;
    }
    airplaneContainer.style.transform = `rotate(${rotationDegrees}deg)`
  }, 1000 / 60)
}

const rotateAirplane = () => {
  balanceAirplane()
  const scrollDirection = scrollY - previousScrollY;
  rotationDegrees += scrollDirection * -0.02;
  airplaneContainer.style.transform = `rotate(${rotationDegrees}deg)`
  previousScrollY = scrollY
}

let previousScrollY = 0;

window.onscroll = () => {
  const current = getCurrentSection();
  
  updateNavItems(current, navItems, "active");
  updateNavItems(current, navCollopasItems, "active-item-collapse");

  if (current === "projects" && !isReduced) rotateAirplane();
};

/*
------------------Project Video Play---------------------
*/

[...buttonGroups].forEach((buttonGroup, i) => {
  buttonGroup.addEventListener("click", (e) => {
    if (e.target.tagName === "LABEL")  return;
    const videoName = e.target.value;
    const video = document.createElement("video");
    video.src = `videos/${videoName}.mp4`;
    const projectImageContainer = projectImageContainers[i];
    if (projectImageContainer.children.length === 3) {
      projectImageContainer.children[2].remove();
    }
    projectImageContainer.append(video);
    video.play();
    video.addEventListener('ended', () => {
      video.classList.add("opacity-zero");
      setTimeout(() => {
        video.remove()
      }, 1000);
    });
  })
})

/*
------------------Form Validation---------------------
*/

const inputChecker = {
  name: {isValid: false, message: ""},
  email: {isValid: false, message: ""},
  message: {isValid: false, message: ""},
}

const errorMessageElements = {
  "name": nameErrorMessage,
  "email": emailErrorMessage,
  "message": messageErrorMessage
}

const updateErrorMessage = (field) => {
  const errorMessageElement = errorMessageElements[field];
  if (inputChecker[field].message !== "") {
    errorMessageElement.textContent = inputChecker[field].message;
    errorMessageElement.parentElement.classList.remove("opacity-zero");
  } else {
    errorMessageElement.innerHTML = "&nbsp;";
    errorMessageElement.parentElement.classList.add("opacity-zero");
  }
}

const updateFormStatus = (field) => {
  errorMessageElements[field].innerHTML = "&nbsp;";
  errorMessageElements[field].parentElement.classList.add("opacity-zero");
  const canSubmit = Object.values(inputChecker).every(input => input.isValid);
  sendButton.disabled = !canSubmit;
}

nameInput.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  if (inputValue.length === 0) {
    inputChecker.name.isValid = false;
    inputChecker.name.message = "Name must be filled.";
  } else if (inputValue.length < 3) {
    inputChecker.name.isValid = false;
    inputChecker.name.message = "Name is too short.";
  } else {
    inputChecker.name.isValid = true;
    inputChecker.name.message = "";
  }

  updateFormStatus("name");
})

emailInput.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
  if (inputValue.length === 0) {
    inputChecker.email.isValid = false;
    inputChecker.email.message = "Email must be filled.";
  } else if (!regex.test(inputValue)) {
    inputChecker.email.isValid = false;
    inputChecker.email.message = "Invalid email.";
  } else {
    inputChecker.email.isValid = true;
    inputChecker.email.message = "";
  }

  updateFormStatus("email");
})

messageInput.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  if (inputValue.length === 0) {
    inputChecker.message.isValid = false;
    inputChecker.message.message = "Message must be filled.";
  } else if (inputValue.length <= 10) {
    inputChecker.message.isValid = false;
    inputChecker.message.message = "Message is too short.";
  } else {
    inputChecker.message.isValid = true;
    inputChecker.message.message = "";
  }

  updateFormStatus("message");
})

nameInput.addEventListener("blur", () => updateErrorMessage("name"))
emailInput.addEventListener("blur", () => updateErrorMessage("email"));
messageInput.addEventListener("blur", () => updateErrorMessage("message"));

