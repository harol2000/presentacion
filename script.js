const slidesTrack = document.getElementById("slidesTrack");
const slides = Array.from(document.querySelectorAll(".slide"));
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const dotsNav = document.getElementById("dotsNav");
const progressBar = document.getElementById("progressBar");
const currentSlideLabel = document.getElementById("currentSlideLabel");

let currentSlide = 0;
let touchStartY = 0;
let touchEndY = 0;

function setViewportHeight() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}

function buildDots() {
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dot-button";
    button.setAttribute("aria-label", `Ir a la diapositiva ${index + 1}: ${slide.dataset.title}`);
    button.addEventListener("click", () => goToSlide(index));
    dotsNav.appendChild(button);
  });
}

function updateDeck() {
  slidesTrack.style.transform = `translateY(-${currentSlide * window.innerHeight}px)`;

  slides.forEach((slide, index) => {
    const isActive = index === currentSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  Array.from(dotsNav.children).forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentSlide);
  });

  prevButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;

  const progress = ((currentSlide + 1) / slides.length) * 100;
  progressBar.style.width = `${progress}%`;
  currentSlideLabel.textContent = `${currentSlide + 1} / ${slides.length}`;
}

function goToSlide(index) {
  const boundedIndex = Math.max(0, Math.min(index, slides.length - 1));

  if (boundedIndex === currentSlide) {
    return;
  }

  currentSlide = boundedIndex;
  updateDeck();
}

function handleKeyNavigation(event) {
  const nextKeys = ["ArrowDown", "ArrowRight", "PageDown", " "];
  const prevKeys = ["ArrowUp", "ArrowLeft", "PageUp"];

  if (nextKeys.includes(event.key)) {
    event.preventDefault();
    goToSlide(currentSlide + 1);
  }

  if (prevKeys.includes(event.key)) {
    event.preventDefault();
    goToSlide(currentSlide - 1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    goToSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    goToSlide(slides.length - 1);
  }
}

function handleTouchStart(event) {
  touchStartY = event.changedTouches[0].clientY;
}

function handleTouchEnd(event) {
  touchEndY = event.changedTouches[0].clientY;
  const travel = touchStartY - touchEndY;

  if (Math.abs(travel) < 45) {
    return;
  }

  if (travel > 0) {
    goToSlide(currentSlide + 1);
  } else {
    goToSlide(currentSlide - 1);
  }
}

function syncHeightOnResize() {
  setViewportHeight();
  updateDeck();
}

setViewportHeight();
buildDots();
updateDeck();

prevButton.addEventListener("click", () => goToSlide(currentSlide - 1));
nextButton.addEventListener("click", () => goToSlide(currentSlide + 1));
window.addEventListener("keydown", handleKeyNavigation);
window.addEventListener("resize", syncHeightOnResize);
window.addEventListener("touchstart", handleTouchStart, { passive: true });
window.addEventListener("touchend", handleTouchEnd, { passive: true });
