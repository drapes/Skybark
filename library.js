const episodeList = document.querySelector("#episodeList");
const filterButtons = document.querySelectorAll(".filter-button");
const progressCookieName = "skybarkReadProgress";
const libraryPage = document.body.dataset.libraryPage === "vault" ? "vault" : "main";
const statusAssets = {
  new: "assets/status/new.png",
  partial: "assets/status/partial.png",
  read: "assets/status/read.png"
};
const statusLabels = {
  new: "New episode",
  partial: "Partially read",
  read: "Fully read"
};

let activeFilter = "all";

function episodeIsPublished(episode) {
  return episode.published !== false;
}

function episodeBelongsOnCurrentPage(episode) {
  return libraryPage === "vault" ? !episodeIsPublished(episode) : episodeIsPublished(episode);
}

function readCookie(name) {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : "";
}

function readProgress() {
  try {
    return JSON.parse(readCookie(progressCookieName)) || {};
  } catch {
    return {};
  }
}

function readerHref(episodeId) {
  return `reader.html?episode=${encodeURIComponent(episodeId)}`;
}

function episodeStatus(episode, progress) {
  const maxPageSeen = progress[episode.id];

  if (typeof maxPageSeen !== "number") {
    return "new";
  }

  return maxPageSeen >= episode.pages.length - 1 ? "read" : "partial";
}

function buildEpisodeCard(episode, status) {
  const link = document.createElement("a");
  const coverWrap = document.createElement("span");
  const image = document.createElement("img");
  const badge = document.createElement("img");
  const meta = document.createElement("span");
  const copy = document.createElement("span");
  const detail = document.createElement("span");
  const title = document.createElement("h2");

  link.className = "episode";
  link.href = readerHref(episode.id);
  link.dataset.status = status;
  link.setAttribute("aria-label", `Open ${episode.name}`);

  coverWrap.className = "cover-wrap";

  image.src = episode.cover;
  image.alt = `${episode.title} cover`;

  badge.className = `status-badge status-badge-${status}`;
  badge.src = statusAssets[status];
  badge.alt = statusLabels[status];

  meta.className = "episode-meta";
  copy.className = "episode-copy";
  detail.className = "episode-detail";

  detail.textContent = `Season ${episode.season} - Episode ${episode.episodeNumber}`;
  title.textContent = episode.name;

  coverWrap.append(image);
  copy.append(detail, title);
  meta.append(copy, badge);
  link.append(coverWrap, meta);
  return link;
}

function renderLibrary() {
  const episodes = (window.SKYBARK_EPISODES || []).filter(episodeBelongsOnCurrentPage);
  const progress = readProgress();
  const visibleEpisodes = activeFilter === "all"
    ? episodes
    : episodes.filter((episode) => episodeStatus(episode, progress) === activeFilter);

  const cards = visibleEpisodes.map((episode) => buildEpisodeCard(episode, episodeStatus(episode, progress)));

  if (cards.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = episodes.length === 0
      ? "The vault is empty."
      : "No episodes match this status yet.";
    episodeList.replaceChildren(empty);
    return;
  }

  episodeList.replaceChildren(...cards);
}

function setFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });

  renderLibrary();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

renderLibrary();
