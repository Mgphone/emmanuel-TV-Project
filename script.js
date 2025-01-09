// let allEpisodes = [];
let allShows = [];

function setup() {
  fetchEpisodes("https://api.tvmaze.com/shows")
    .then((shows) => {
      console.log(shows);
      allShows = shows;
      return selectAndModifyShowsList(shows);
    })
    .catch((error) => {
      displayError("Failed to load episodes. Please try again later.");
      console.error("Error fetching episodes:", error);
    });
}

function selectAndModifyShowsList(shows) {
  const topDisplayElem = document.getElementById("top-display");
  const showListHtml = document.getElementById("show-list");

  topDisplayElem.innerHTML = "";

  let defaultIndex = 10;
  let path = shows[defaultIndex]._links.self.href + "/episodes";

  const selectElement = document.createElement("select");

  shows.forEach((show, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = show.name;
    selectElement.appendChild(option);
  });

  showListHtml.appendChild(selectElement);

  selectElement.addEventListener("change", (e) => {
    const selectedIndex = e.target.value;
    path = shows[selectedIndex]._links.self.href + "/episodes";

    topDisplayElem.innerHTML = "";
    //eventlistener select fetching
    fetchEpisodes(path)
      .then((episodes) => {
        makeTopDisplay(episodes);
      })
      .catch((error) => {
        displayError("Failed to load episodes. Please try again later.");
        console.error("Error fetching episodes:", error);
      });
  });
  //initial fetching
  fetchEpisodes(path)
    .then((episodes) => {
      makeTopDisplay(episodes);
    })
    .catch((error) => {
      displayError("Failed to load episodes. Please try again later.");
      console.error("Error fetching episodes:", error);
    });
}

function fetchEpisodes(url) {
  return new Promise((resolve, reject) => {
    displayLoading();
    fetch(url)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        hideLoading();
        resolve(data);
      })
      .catch((error) => {
        hideLoading();
        reject(error);
      });
  });
}

function makeTopDisplay(allEpisodes) {
  const topDisplayElem = document.getElementById("top-display");
  const selectElement = document.createElement("select");
  const inputElement = document.createElement("input");

  selectElement.id = "episode-list";
  const allOptions = document.createElement("option");
  allOptions.value = "all";
  allOptions.textContent = "All Episodes";
  selectElement.appendChild(allOptions);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.name;
    option.textContent = `${episode.name} ${
      episode.season
        ? `-S${String(episode.season).padStart(2, "0")}E${String(
            episode.number
          ).padStart(2, "0")}`
        : ""
    }`;
    selectElement.appendChild(option);
  });

  selectElement.addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    let filteredEpisodes =
      selectedValue === "all"
        ? allEpisodes
        : allEpisodes.filter((episode) => episode.name === selectedValue);
    updateDisplay(filteredEpisodes);
  });

  inputElement.type = "text";
  inputElement.placeholder = "Search for episodes...";
  const addLabel = document.createElement("label");

  const updateDisplay = (filterInput) => {
    addLabel.textContent = `This is the list of Episode ${filterInput.length}/${allEpisodes.length}`;
    makePageForEpisodes(filterInput);
  };

  inputElement.addEventListener("input", () => {
    const searchName = inputElement.value.toLowerCase();
    const filteredEpisodes = filterEpisodes(allEpisodes, searchName);
    updateDisplay(filteredEpisodes);
  });

  updateDisplay(allEpisodes);

  topDisplayElem.appendChild(selectElement);
  topDisplayElem.appendChild(inputElement);
  topDisplayElem.appendChild(addLabel);
}

function filterEpisodes(allEpisodes, searchName) {
  return searchName
    ? allEpisodes.filter(
        (episode) =>
          episode.name.toLowerCase().includes(searchName) ||
          episode.summary.toLowerCase().includes(searchName)
      )
    : allEpisodes;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    // Create episode container
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

    // Episode title
    const title = document.createElement("h2");
    title.textContent = `${episode.name} ${
      episode.season
        ? `-S${String(episode.season).padStart(2, "0")}E${String(
            episode.number
          ).padStart(2, "0")}`
        : ""
    }`;
    episodeCard.appendChild(title);

    // Episode image
    if (episode.image && episode.image.medium) {
      const img = document.createElement("img");
      img.src = episode.image.medium;
      img.alt = episode.name;
      episodeCard.appendChild(img);
    }

    // Episode summary
    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";
    episodeCard.appendChild(summary);

    // Episode link to TVmaze
    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.textContent = "More info on TVmaze";
    episodeCard.appendChild(link);

    rootElem.appendChild(episodeCard);
  });
}

// Utility functions
function displayLoading() {
  const rootElem = document.getElementById("root");
  const loadingMessage = document.createElement("p");
  loadingMessage.id = "loading-message";
  loadingMessage.textContent = "Loading episodes, please wait...";
  rootElem.appendChild(loadingMessage);
}

function hideLoading() {
  const loadingMessage = document.getElementById("loading-message");
  if (loadingMessage) loadingMessage.remove();
}

function displayError(message) {
  const rootElem = document.getElementById("root");
  const errorMessage = document.createElement("p");
  errorMessage.id = "error-message";
  errorMessage.textContent = message;
  errorMessage.style.color = "red";
  rootElem.appendChild(errorMessage);
}

window.onload = setup;
