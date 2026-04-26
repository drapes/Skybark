(function () {
  const pageFiles = [
    { title: "Cover", file: "cover.png" },
    { title: "Page 1", file: "page-01.png" },
    { title: "Page 2", file: "page-02.png" },
    { title: "Page 3", file: "page-03.png" },
    { title: "Page 4", file: "page-04.png" },
    { title: "Page 5", file: "page-05.png" },
    { title: "Page 6", file: "page-06.png" },
    { title: "Page 7", file: "page-07.png" },
    { title: "Page 8", file: "page-08.png" },
    { title: "Page 9", file: "page-09.png" },
    { title: "Page 10", file: "page-10.png" },
    { title: "End", file: "end-silent.png" }
  ];

  const episodes = [
    {
      id: "episode-01",
      number: "01",
      name: "The Missing Sunbeam",
      season: 1,
      published: true
    },
    {
      id: "episode-02",
      number: "02",
      name: "The Great Flood",
      season: 1,
      published: true
    },
    {
      id: "episode-03",
      number: "03",
      name: "The Palo Alto Squiral Siege",
      season: 1,
      published: true
    },
    {
      id: "episode-04",
      number: "04",
      name: "The Calgary Cup Caper",
      season: 1,
      published: true
    },
    {
      id: "episode-05",
      number: "05",
      name: "The Sutro Surfkite Rescue",
      season: 1,
      published: true
    },
    {
      id: "episode-06",
      number: "06",
      name: "The Sonoma Cheese Flight",
      season: 1,
      published: true
    },
    {
      id: "episode-07",
      number: "07",
      name: "The Citywide Toy Rescue",
      season: 1,
      published: true
    },
    {
      id: "episode-08",
      number: "08",
      name: "The North Beach Bookshop Heist",
      season: 1,
      published: true
    },
    {
      id: "episode-09",
      number: "09",
      name: "The Colma Brain Drain",
      season: 1,
      published: true
    },
    {
      id: "episode-10",
      number: "10",
      name: "The Alcatraz Zoomie Breakout",
      season: 1,
      published: true
    },
    {
      id: "episode-11",
      number: "11",
      name: "The Penguin Heat Heist",
      season: 1,
      published: true
    },
    {
      id: "episode-12",
      number: "12",
      name: "The Golden Gate Picnic Pinch",
      season: 1,
      published: true
    }
  ];

  window.SKYBARK_EPISODES = episodes.map((episode) => {
    const imageBase = `episodes/${episode.id}/images`;
    const number = episode.episodeNumber || episode.number;
    const name = episode.name || episode.title;
    const season = episode.season || 1;
    const title = episode.title || `Episode ${number}: ${name}`;

    return {
      ...episode,
      title,
      number,
      episodeNumber: number,
      name,
      season,
      meta: {
        title,
        episodeNumber: number,
        name,
        season
      },
      imageBase,
      cover: `${imageBase}/cover.png`,
      pages: pageFiles.map((page) => ({
        title: page.title,
        src: `${imageBase}/${page.file}`
      }))
    };
  });
}());
