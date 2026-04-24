const episodeList = document.querySelector("#episodeList");

function readerHref(episodeId) {
  return `reader.html?episode=${encodeURIComponent(episodeId)}`;
}

function buildEpisodeCard(episode) {
  const link = document.createElement("a");
  const image = document.createElement("img");
  const title = document.createElement("h2");
  const action = document.createElement("p");

  link.className = "episode";
  link.href = readerHref(episode.id);

  image.src = episode.cover;
  image.alt = `${episode.title} cover`;

  title.textContent = `Episode ${episode.number}: ${episode.title}`;
  action.textContent = "Open reader";

  link.append(image, title, action);
  return link;
}

function renderLibrary() {
  const episodes = window.SKYBARK_EPISODES || [];

  episodeList.replaceChildren(...episodes.map(buildEpisodeCard));
}

renderLibrary();
