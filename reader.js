const params = new URLSearchParams(window.location.search);
const episodes = window.SKYBARK_EPISODES || [];
const requestedEpisode = params.get("episode") || (episodes[0] && episodes[0].id);
const episode = episodes.find((entry) => entry.id === requestedEpisode);
const pages = episode ? episode.pages : [];

const episodeTitle = document.querySelector("#episodeTitle");
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

function showReaderError() {
  document.body.innerHTML = `
    <main class="reader-error">
      <p class="kicker">The Adventures of Skybark and Bitebolt</p>
      <h1>Episode not found</h1>
      <p class="intro">Head back to the library to choose an available episode.</p>
      <p><a class="library-link" href="index.html">Library</a></p>
    </main>
  `;
}

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
  const thumbnails = pages.map((page, index) => {
    const button = document.createElement("button");
    const img = document.createElement("img");

    button.className = "thumb";
    button.type = "button";
    button.setAttribute("aria-label", page.title);

    img.src = page.src;
    img.alt = "";

    button.append(img);
    button.addEventListener("click", () => turnTo(index));
    return button;
  });

  thumbTrack.replaceChildren(...thumbnails);
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

function onKeyDown(event) {
  if (event.key === "ArrowLeft") {
    turnTo(currentPage - 1);
  }

  if (event.key === "ArrowRight" || event.key === " ") {
    turnTo(currentPage + 1);
  }
}

function bindReaderControls() {
  prevButton.addEventListener("click", () => turnTo(currentPage - 1));
  nextButton.addEventListener("click", () => turnTo(currentPage + 1));
  leftZone.addEventListener("click", () => turnTo(currentPage - 1));
  rightZone.addEventListener("click", () => turnTo(currentPage + 1));
  book.addEventListener("touchstart", onTouchStart, { passive: true });
  book.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKeyDown);
}

function initReader() {
  if (!episode || pages.length === 0) {
    showReaderError();
    return;
  }

  document.title = `Skybark & Bitebolt: ${episode.title}`;
  episodeTitle.textContent = episode.title;

  preloadImages();
  buildThumbnails();
  bindReaderControls();
  renderStaticPage();
}

initReader();
