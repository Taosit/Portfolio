const sections = document.querySelectorAll("section");

const navItemContainer = document.querySelector(".nav-items");
const navItems = navItemContainer.querySelectorAll("span");
const hamburger = document.querySelector(".hamburger");
const navCollapseTexts = document.querySelectorAll(".nav-item-collapse-text");
const toggleButton = document.querySelector(".toggle-nav");
const navCollapsItemContainer = document.querySelector(".nav-collapse");
const navCollopasItems = navCollapsItemContainer.querySelectorAll("div");

const airplaneContainer = document.querySelector(".airplane-container");
const bigCloud = document.querySelector(".big-cloud");
const smallCloud = document.querySelector(".small-cloud");

const projectImageContainers = document.querySelectorAll(".individual-project-image-container");
const buttonGroups = document.querySelectorAll(".button-group");

const contactCard = document.querySelector(".contact-card");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");

const nameErrorMessage = document.querySelector(".name-error-message");
const emailErrorMessage = document.querySelector(".email-error-message");
const messageErrorMessage = document.querySelector(".message-error-message");

const sendButton = document.querySelector(".send-button");

const successMessageContainer = document.querySelector(".success-message");
const successText = successMessageContainer.querySelector("p");
const failureMessageContainer = document.querySelector(".failure-message");
const failureText = failureMessageContainer.querySelector("p");

const MAX_ROTATION = 15;
const MAX_DEPLACEMENT = 30;

/*
------------------Navbar tabing---------------------
*/

const showNav = () => {
  toggleButton.setAttribute("checked", "true");
  navCollapseTexts.forEach((item) => {
    item.setAttribute("tabindex", "0");
  });
  hamburger.dataset.state = "open";
}

const hideNav = () => {
  toggleButton.removeAttribute("checked");
  navCollapseTexts.forEach((item) => {
    item.setAttribute("tabindex", "-1");
  });
  hamburger.dataset.state = "closed";
}

hamburger.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if (hamburger.dataset.state === "closed") showNav(); 
  else hideNav();
});

navCollapseTexts.forEach((item) => {
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter") hideNav();
  });
});

/*
------------------Navbar Update---------------------
*/
const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

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

/*
------------------Airplane Rotation and Cloud Movement---------------------
*/

let rotationDegrees = 0;
let baseDeplacement = 0;
let airplaneTimer;
let cloudTimer;

const balanceAirplane = () => {
  if (airplaneTimer) return;
  airplaneTimer = setInterval(() => {
    if (rotationDegrees > 1) {
      rotationDegrees -= 0.08;
    } else if (rotationDegrees < 0) {
      rotationDegrees += 0.08;
    } else {
      clearInterval(airplaneTimer);
      airplaneTimer = null;
    }
    rotationDegrees = Math.min(rotationDegrees, MAX_ROTATION * 1);
    rotationDegrees = Math.max(rotationDegrees, MAX_ROTATION * -1.2);
    airplaneContainer.style.transform = `rotate(${rotationDegrees}deg)`
  }, 1000 / 60)
}

const recoverCloud = () => {
  if (cloudTimer) return;
  cloudTimer = setInterval(() => {
    if (baseDeplacement > 1) {
      baseDeplacement -= 0.06;
    } else {
      clearInterval(cloudTimer);
      cloudTimer = null;
    }
    baseDeplacement = Math.min(baseDeplacement, MAX_DEPLACEMENT);
    bigCloud.style.transform = `translateX(${baseDeplacement * (-1)}px)`;
    smallCloud.style.transform = `translateX(${baseDeplacement * 2}px)`;
  }, 1000 / 60)
}

let previousScrollY = 0;

const animate = () => {
  const scrollDirection = previousScrollY? scrollY - previousScrollY : 0;

  rotationDegrees += scrollDirection * -0.02;
  airplaneContainer.style.transform = `rotate(${rotationDegrees}deg)`

  baseDeplacement += Math.abs(scrollDirection) * 0.01;
  bigCloud.style.transform = `translateX(${baseDeplacement * (-1)}px)`;
  smallCloud.style.transform = `translateX(${baseDeplacement * 2}px)`;
  
  previousScrollY = scrollY
  balanceAirplane()
  recoverCloud()
}

/*
------------------Project Video Play---------------------
*/

const playVideo = (videoName, projectImageContainer) => {
  const video = document.createElement("video");
  video.src = `videos/${videoName}.mp4`;
  video.muted = true;
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
}

buttonGroups.forEach((buttonGroup, i) => {
  buttonGroup.addEventListener("click", (e) => {
    if (e.target.tagName === "LABEL")  return;
    const videoName = e.target.value;
    playVideo(videoName, projectImageContainers[i]);
  })

  const labels = buttonGroup.querySelectorAll("label");
  labels.forEach((label) => {
    label.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const videoName = label.getAttribute("for");
      const radio = buttonGroup.querySelector(`#${videoName}`);
      radio.checked = true;
      playVideo(videoName, projectImageContainers[i]);
    })
  })
})

/*
------------------Scroll Events for Nav Updates, Animation and Video Play---------------------
*/

let firstView = true;

window.onscroll = () => {
  const current = getCurrentSection();
  
  updateNavItems(current, navItems, "active");
  updateNavItems(current, navCollopasItems, "active-item-collapse");

  if (current === "projects" && !isReduced) animate();
  if (current === "projects" && firstView) {
    const firstVideoRadio = buttonGroups[0].querySelector("input");
    firstVideoRadio.checked = true;
    playVideo(firstVideoRadio.value, projectImageContainers[0]);
    firstView = false;
  }
};

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

/*
------------------Send Email---------------------
*/

const showSuccessMessage = (message) => {
  successMessageContainer.classList.remove("hidden");
  successText.textContent = message;
}

successMessageContainer.addEventListener("animationend", () => {
  successMessageContainer.classList.add("hidden");
  successText.textContent = "";
})

const showFailureMessage = (message) => {
  failureMessageContainer.classList.remove("hidden");
  failureText.textContent = message;
}

failureMessageContainer.addEventListener("animationend", () => {
  failureMessageContainer.classList.add("hidden");
  failureText.textContent = "";
})

const clearInputs = () => {
  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
}

const sendEmail = async (e) => {
  e.preventDefault();

  const url = "/.netlify/functions/sendEmail";
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value,
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((response) => {
    if (response.ok) return response.json();
    return Promise.reject(response);
  })
  .then((data) => {
    showSuccessMessage(data.message);
    clearInputs();
  })
  .catch((response) => {
    response.json().then((data) => {
      showFailureMessage(data.message)
    })
  });
};

sendButton.addEventListener("click", sendEmail)