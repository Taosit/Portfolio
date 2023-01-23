const sections = document.querySelectorAll("section");

const navItemContainer = document.querySelector(".nav-items");
const navItems = navItemContainer.querySelectorAll("a");
const hamburger = document.querySelector(".hamburger");
const toggleButton = document.querySelector(".toggle-nav");
const navCollapsItemContainer = document.querySelector(".nav-collapse");
const navCollopasItems = navCollapsItemContainer.querySelectorAll("a");

const airplaneContainer = document.querySelector(".airplane-container");
const bigCloud = document.querySelector(".big-cloud");
// const smallCloud = document.querySelector(".small-cloud");

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
------------------Navbar Toggle ---------------------
*/

let isNavOpen = false;

const showNav = () => {
  navCollapsItemContainer.ariaHidden = false;
  navCollopasItems.forEach((item) => {
    item.style.display = "flex";
  });
  hamburger.classList.add("active");
  navCollapsItemContainer.classList.add("active");
  isNavOpen = true;
};

const hideNav = () => {
  hamburger.classList.remove("active");
  navCollapsItemContainer.classList.remove("active");
  isNavOpen = false;
  setTimeout(() => {
    navCollopasItems.forEach((item) => {
      item.style.display = "none";
    });
    navCollapsItemContainer.ariaHidden = true;
  }, 500);
};

const toggleNav = () => {
  if (isNavOpen) hideNav();
  else showNav();
}

hamburger.addEventListener("click", toggleNav);
window.addEventListener("click", (e) => {
  if (e.target.closest(".nav-collapse") || e.target.closest(".hamburger")) return;
  if (isNavOpen) toggleNav();
});

navCollapsItemContainer.addEventListener("click", hideNav);

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
let baseValue = 0.5;
let acceleration = 0;

const moveAirplane = () => {
  if (rotationDegrees > 1) {
    rotationDegrees -= 0.08;
  } else if (rotationDegrees < 0) {
    rotationDegrees += 0.08;
  } else {
    airplaneTimer = null;
  }
  rotationDegrees = Math.min(rotationDegrees, MAX_ROTATION * 1);
  rotationDegrees = Math.max(rotationDegrees, MAX_ROTATION * -1.2);
  airplaneContainer.style.transform = `rotate(${rotationDegrees}deg)`;
  requestAnimationFrame(moveAirplane);
}

const moveCloud = () => {
  acceleration = Math.max(0.5, acceleration - 0.02);
  baseValue = baseValue > 2? 0 : baseValue + acceleration * 0.004;
  const deplacement = Math.max(0, baseValue * baseValue - 0.3);
  const opacity = - baseValue * baseValue + 2 * baseValue;
  const scale = baseValue < 1? 1 : (baseValue - 1) * (baseValue - 1) + 1;
  bigCloud.style.transform = `translateX(${deplacement * 100}px) scale(${scale})`;
  bigCloud.style.opacity = opacity;
  requestAnimationFrame(moveCloud);
}

let previousScrollY = 0;

const animate = () => {
  const scrollDirection = previousScrollY? scrollY - previousScrollY : 0;
  previousScrollY = scrollY

  rotationDegrees += scrollDirection * -0.02;
  acceleration = Math.min(4, acceleration + Math.abs(scrollDirection) * 0.01);
}

moveCloud();
moveAirplane();

/*
------------------Project Video Play---------------------
*/

const playVideo = (videoName, projectImageContainer) => {
  const video = document.createElement("video");
  video.src = `videos/${videoName}.mp4`;
  video.muted = true;
  video.addEventListener("loadeddata", () => {
    if (projectImageContainer.children.length === 3) {
      projectImageContainer.children[2].remove();
    }
    projectImageContainer.append(video);
    video.play();
  });
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
  updateNavItems(current, navCollopasItems, "active");

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