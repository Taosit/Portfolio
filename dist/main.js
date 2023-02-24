const sections = document.querySelectorAll("section");

const navItemContainer = document.querySelector(".nav-items");
const navItems = navItemContainer.querySelectorAll("a");
const hamburger = document.querySelector(".hamburger");
const toggleButton = document.querySelector(".toggle-nav");
const navCollapsItemContainer = document.querySelector(".nav-collapse");
const navCollopasItems = navCollapsItemContainer.querySelectorAll("a");

const airplane = document.querySelector(".airplane-container img");
const bigCloud = document.querySelector(".big-cloud");

const projectImageContainers = document.querySelectorAll(
  ".individual-project-image-container"
);
const buttonGroups = document.querySelectorAll(".button-group");
const playButtons = document.querySelectorAll(".play-button");
const pauseButtons = document.querySelectorAll(".pause-button");

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
    item.classList.remove("hidden");
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
      item.classList.add("hidden");
    });
    navCollapsItemContainer.ariaHidden = true;
  }, 500);
};

const toggleNav = () => {
  if (isNavOpen) hideNav();
  else showNav();
};

hamburger.addEventListener("click", toggleNav);
window.addEventListener("click", (e) => {
  if (e.target.closest(".nav-collapse") || e.target.closest(".hamburger"))
    return;
  if (isNavOpen) toggleNav();
});

navCollapsItemContainer.addEventListener("click", hideNav);

/*
------------------Navbar Update---------------------
*/
const isReduced =
  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

const getCurrentSection = () => {
  let current = "home";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 48) {
      current = section.getAttribute("id");
    }
  });
  return current;
};

const updateNavItems = (currentSection, navItems, activeClassName) => {
  navItems.forEach((span) => {
    span.classList.remove(activeClassName);
    if (
      [...span.classList].some((className) =>
        className.includes(currentSection)
      )
    ) {
      span.classList.add(activeClassName);
    }
  });
};

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
  airplane.style.transform = `rotate(${rotationDegrees}deg)`;
  requestAnimationFrame(moveAirplane);
};

const moveCloud = () => {
  acceleration = Math.max(0.5, acceleration - 0.03);
  baseValue = baseValue > 2 ? 0 : baseValue + acceleration * 0.004;
  const deplacement = Math.max(0, baseValue * baseValue - 0.3);
  const opacity = -baseValue * baseValue + 2 * baseValue;
  const scale = baseValue < 1 ? 0.7 : (baseValue - 1) * (baseValue - 1) + 0.7;
  bigCloud.style.transform = `translateX(${
    deplacement * 100
  }px) scale(${scale}) rotate(-2.88deg)`;
  bigCloud.style.opacity = opacity;
  requestAnimationFrame(moveCloud);
};

let previousScrollY = 0;

const animate = () => {
  const scrollDirection = previousScrollY ? scrollY - previousScrollY : 0;
  previousScrollY = scrollY;

  rotationDegrees += scrollDirection * -0.02;
  acceleration = Math.min(4, acceleration + Math.abs(scrollDirection) * 0.01);
};

if (window.innerWidth > 1023) {
  moveCloud();
}

moveAirplane();

/*
------------------Project Video Play---------------------
*/

const projectNames = ["lingpal", "recipear", "ready", "pet_home"];

const videoNames = [
  ["lingpal_options", "lingpal_notes", "lingpal_chat"],
  ["recipear_filter", "recipear_voice", "recipear_create"],
  ["ready_phonetics", "ready_meanings", "ready_download"],
  ["pet_home_search", "pet_home_filter", "pet_home_details"],
];

const playVideo = (videoName, projectIndex) => {
  const projectImageContainer = projectImageContainers[projectIndex];
  const radio = projectImageContainer.parentElement.querySelector(
    `#${videoName}`
  );
  radio.checked = true;
  const video = document.createElement("video");
  video.src = `videos/${videoName}.mp4`;
  video.muted = true;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    video.autoplay = true;
    video.addEventListener("pause", () => {
      playButtons[projectIndex].classList.remove("hidden");
    });
    video.addEventListener("play", () => {
      playButtons[projectIndex].classList.add("hidden");
    });
  }
  video.addEventListener("loadeddata", () => {
    const oldVideo = projectImageContainer.querySelector("video");
    if (oldVideo) oldVideo.remove();
    projectImageContainer.append(video);
    projectImageContainer
      .querySelector(".prompt-container")
      .classList.add("hidden");
    video.play();
    playButtons[projectIndex].classList.add("hidden");
  });
  projectImageContainer.addEventListener("mouseover", () => {
    if (video.paused) return;
    projectImageContainer
      .querySelector(".pause-button")
      .classList.remove("hidden");
  });
  projectImageContainer.addEventListener("mouseleave", () => {
    if (video.paused) return;
    projectImageContainer
      .querySelector(".pause-button")
      .classList.add("hidden");
  });
  video.addEventListener("ended", () => {
    const videoIndex = videoNames[projectIndex].indexOf(videoName);
    if (videoIndex === 2) {
      projectImageContainer
        .querySelector(".pause-button")
        .classList.add("hidden");
      radio.checked = false;
      video.remove();
      projectImageContainer
        .querySelector(".prompt-container")
        .classList.remove("hidden");
    } else {
      const nextVideoName = videoNames[projectIndex][videoIndex + 1];
      playVideo(nextVideoName, projectIndex);
    }
  });
};

buttonGroups.forEach((buttonGroup, i) => {
  buttonGroup.addEventListener("click", (e) => {
    if (e.target.tagName === "LABEL") return;
    const videoName = e.target.value;
    playVideo(videoName, i);
  });

  const labels = buttonGroup.querySelectorAll("label");
  labels.forEach((label) => {
    label.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const videoName = label.getAttribute("for");
      playVideo(videoName, i);
    });
  });
});

const handlePlayVideo = (e) => {
  const existingVideo = e.target.parentElement.querySelector("video");
  if (existingVideo) {
    if (existingVideo.paused) {
      existingVideo.play();
    }
  } else {
    const projectName = e.target.nextElementSibling.src
      .split("/")
      .pop()
      .split(".")[0];
    const projectIndex = projectNames.indexOf(projectName);
    const firstVideoName = videoNames[projectIndex][0];
    playVideo(firstVideoName, projectIndex);
  }
  e.target.classList.add("hidden");
};

const handlePauseVideo = (pauseButton) => {
  if (pauseButton.classList.contains("hidden")) return;
  const projectName = pauseButton.dataset.project;
  const projectIndex = projectNames.indexOf(projectName);
  const playingVideo =
    projectImageContainers[projectIndex].querySelector("video");
  if (!playingVideo) console.log({ projectName });
  // FIX: cannot read property pause of null
  playingVideo.pause();
  pauseButton.classList.add("hidden");
  playButtons[projectIndex].classList.remove("hidden");
};

playButtons.forEach((playButton) => {
  playButton.addEventListener("click", handlePlayVideo);
  playButton.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    handlePlayVideo(e);
  });
});

pauseButtons.forEach((pauseButton) => {
  pauseButton.addEventListener("click", () => handlePauseVideo(pauseButton));
  pauseButton.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    handlePauseVideo(pauseButton);
  });
});

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
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return;
    const firstVideoRadio = buttonGroups[0].querySelector("input");
    firstVideoRadio.checked = true;
    playVideo(firstVideoRadio.value, 0);
    firstView = false;
  }
};

/*
------------------Form Validation---------------------
*/

const inputChecker = {
  name: { isValid: false, message: "" },
  email: { isValid: false, message: "" },
  message: { isValid: false, message: "" },
};

const errorMessageElements = {
  name: nameErrorMessage,
  email: emailErrorMessage,
  message: messageErrorMessage,
};

const updateErrorMessage = (field) => {
  const errorMessageElement = errorMessageElements[field];
  if (inputChecker[field].message !== "") {
    errorMessageElement.textContent = inputChecker[field].message;
    errorMessageElement.parentElement.classList.remove("opacity-zero");
  } else {
    errorMessageElement.innerHTML = "&nbsp;";
    errorMessageElement.parentElement.classList.add("opacity-zero");
  }
};

const updateFormStatus = (field) => {
  errorMessageElements[field].innerHTML = "&nbsp;";
  errorMessageElements[field].parentElement.classList.add("opacity-zero");
  const canSubmit = Object.values(inputChecker).every((input) => input.isValid);
  sendButton.disabled = !canSubmit;
};

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
});

emailInput.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  const regex =
    /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

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
});

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
});

nameInput.addEventListener("blur", () => updateErrorMessage("name"));
emailInput.addEventListener("blur", () => updateErrorMessage("email"));
messageInput.addEventListener("blur", () => updateErrorMessage("message"));

/*
------------------Send Email---------------------
*/

const showSuccessMessage = (message) => {
  successMessageContainer.classList.remove("hidden");
  successText.textContent = message;
};

successMessageContainer.addEventListener("animationend", () => {
  successMessageContainer.classList.add("hidden");
  successText.textContent = "";
});

const showFailureMessage = (message) => {
  failureMessageContainer.classList.remove("hidden");
  failureText.textContent = message;
};

failureMessageContainer.addEventListener("animationend", () => {
  failureMessageContainer.classList.add("hidden");
  failureText.textContent = "";
});

const clearInputs = () => {
  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
};

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
      "Content-Type": "application/json",
    },
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
        showFailureMessage(data.message);
      });
    });
};

sendButton.addEventListener("click", sendEmail);
