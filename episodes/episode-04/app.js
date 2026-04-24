const pages = [
  { title: "Cover", src: "images/cover.png" },
  { title: "Page 1", src: "images/page-01.png" },
  { title: "Page 2", src: "images/page-02.png" },
  { title: "Page 3", src: "images/page-03.png" },
  { title: "Page 4", src: "images/page-04.png" },
  { title: "Page 5", src: "images/page-05.png" },
  { title: "Page 6", src: "images/page-06.png" },
  { title: "Page 7", src: "images/page-07.png" },
  { title: "Page 8", src: "images/page-08.png" },
  { title: "Page 9", src: "images/page-09.png" },
  { title: "Page 10", src: "images/page-10.png" },
  { title: "End", src: "images/end-silent.png" }
];

const book = document.querySelector("#book");
const basePage = document.querySelector("#basePage");
const flipSheet = document.querySelector("#flipSheet");
const flipFront = document.querySelector("#flipFront");
const flipBack = document.querySelector("#flipBack");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const leftZone = document.querySelector("#leftZone");
const rightZone = document.querySelector("#rightZone");
const pageCounter = document.querySelector("#pageCounter");
const thumbTrack = document.querySelector("#thumbTrack");

let currentPage = 0;
let turning = false;
let touchStartX = 0;
let touchStartY = 0;

function preloadImages() {
  pages.forEach((page) => {
    const img = new Image();
    img.src = page.src;
  });
}

function pageLabel(index) {
  return `${index + 1} / ${pages.length}`;
}

function renderStaticPage() {
  const page = pages[currentPage];
  basePage.src = page.src;
  basePage.alt = page.title;
  pageCounter.textContent = pageLabel(currentPage);

  const atStart = currentPage === 0 || turning;
  const atEnd = currentPage === pages.length - 1 || turning;
  prevButton.disabled = atStart;
  leftZone.disabled = atStart;
  nextButton.disabled = atEnd;
  rightZone.disabled = atEnd;

  document.querySelectorAll(".thumb").forEach((thumb, index) => {
    if (index === currentPage) {
      thumb.setAttribute("aria-current", "page");
      thumb.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    } else {
      thumb.removeAttribute("aria-current");
    }
  });
}

function turnTo(targetPage) {
  if (turning || targetPage === currentPage || targetPage < 0 || targetPage >= pages.length) {
    return;
  }

  const goingNext = targetPage > currentPage;
  const fromPage = pages[currentPage];
  const toPage = pages[targetPage];

  turning = true;
  book.classList.add("turning");
  flipSheet.className = "flip-sheet active";

  if (goingNext) {
    basePage.src = toPage.src;
    flipFront.src = toPage.src;
    flipBack.src = fromPage.src;
    requestAnimationFrame(() => flipSheet.classList.add("next"));
  } else {
    basePage.src = toPage.src;
    flipFront.src = fromPage.src;
    flipBack.src = toPage.src;
    requestAnimationFrame(() => flipSheet.classList.add("previous"));
  }

  flipFront.alt = "";
  flipBack.alt = "";

  window.setTimeout(() => {
    currentPage = targetPage;
    turning = false;
    flipSheet.className = "flip-sheet";
    book.classList.remove("turning");
    renderStaticPage();
  }, 740);
}

function buildThumbnails() {
  pages.forEach((page, index) => {
    const button = document.createElement("button");
    const img = document.createElement("img");
    button.className = "thumb";
    button.type = "button";
    button.setAttribute("aria-label", page.title);
    img.src = page.src;
    img.alt = "";
    button.append(img);
    button.addEventListener("click", () => turnTo(index));
    thumbTrack.append(button);
  });
}

function onTouchStart(event) {
  const firstTouch = event.changedTouches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
}

function onTouchEnd(event) {
  const lastTouch = event.changedTouches[0];
  const deltaX = lastTouch.clientX - touchStartX;
  const deltaY = lastTouch.clientY - touchStartY;

  if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
    return;
  }

  if (deltaX < 0) {
    turnTo(currentPage + 1);
  } else {
    turnTo(currentPage - 1);
  }
}

prevButton.addEventListener("click", () => turnTo(currentPage - 1));
nextButton.addEventListener("click", () => turnTo(currentPage + 1));
leftZone.addEventListener("click", () => turnTo(currentPage - 1));
rightZone.addEventListener("click", () => turnTo(currentPage + 1));
book.addEventListener("touchstart", onTouchStart, { passive: true });
book.addEventListener("touchend", onTouchEnd, { passive: true });

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    turnTo(currentPage - 1);
  }

  if (event.key === "ArrowRight" || event.key === " ") {
    turnTo(currentPage + 1);
  }
});

preloadImages();
buildThumbnails();
renderStaticPage();
