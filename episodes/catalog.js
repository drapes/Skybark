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
      title: "The Missing Sunbeam"
    },
    {
      id: "episode-02",
      number: "02",
      title: "The Great Flood"
    },
    {
      id: "episode-03",
      number: "03",
      title: "The Palo Alto Squiral Siege"
    },
    {
      id: "episode-04",
      number: "04",
      title: "The Calgary Cup Caper"
    },
    {
      id: "episode-05",
      number: "05",
      title: "The Sutro Surfkite Rescue"
    },
    {
      id: "episode-06",
      number: "06",
      title: "The Sonoma Cheese Flight"
    },
    {
      id: "episode-07",
      number: "07",
      title: "The Citywide Toy Rescue"
    },
    {
      id: "episode-08",
      number: "08",
      title: "The North Beach Bookshop Heist"
    },
    {
      id: "episode-09",
      number: "09",
      title: "The Colma Brain Drain"
    }
  ];

  window.SKYBARK_EPISODES = episodes.map((episode) => {
    const imageBase = `episodes/${episode.id}/images`;

    return {
      ...episode,
      imageBase,
      cover: `${imageBase}/cover.png`,
      pages: pageFiles.map((page) => ({
        title: page.title,
        src: `${imageBase}/${page.file}`
      }))
    };
  });
}());
