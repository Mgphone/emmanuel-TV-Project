// JavaScript code for Level 300 implementation

let allEpisodes = [];

function setup() {
  fetchEpisodes()
    .then((episodes) => {
      allEpisodes = episodes;
      initializeSearchAndDropdown(allEpisodes);
      makePageForEpisodes(allEpisodes);
    })
    .then(() => {
      console.log(allEpisodes);
      let filterInput = allEpisodes;

      makeTopDisplay(allEpisodes, filterInput);
      makePageForEpisodes(filterInput);
    })
    .catch((error) => {
      displayError("Failed to load episodes. Please try again later.");
      console.error("Error fetching episodes:", error);
    });
}

function fetchEpisodes() {
  const API_URL = "https://api.tvmaze.com/shows/82/episodes";

  return new Promise((resolve, reject) => {
    displayLoading();
    fetch(API_URL)
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

  selectElement.id = "movie-list";
  const allOptions = document.createElement("option");
  allOptions.value = "all";
  allOptions.textContent = "All...";
  selectElement.appendChild(allOptions);

  allEpisodes.forEach((movie) => {
    const option = document.createElement("option");
    option.value = movie.name;
    option.textContent = `${movie.name} - S${String(movie.season).padStart(
      2,
      "0"
    )}E${String(movie.number).padStart(2, "0")}`;
    selectElement.appendChild(option);
  });

  selectElement.addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    let filteredEpisodes =
      selectedValue === "all"
        ? allEpisodes
        : allEpisodes.filter((film) => film.name === selectedValue);
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

//this is function for name and summary filter
function filterEpisodes(allEpisodes, searchName) {
  if (searchName) {
    filterInput = allEpisodes.filter(
      (film) =>
        film.name.toLocaleLowerCase().includes(searchName) ||
        film.summary.toLocaleLowerCase().includes(searchName)
    );
    return filterInput;
  } else {
    return allEpisodes;
  }
}
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear root element

  episodeList.forEach((episode) => {
    // Create episode container
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

    // Episode title
    const title = document.createElement("h2");
    title.textContent = `${episode.name} - S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}`;
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

function initializeSearchAndDropdown(allEpisodes) {
  const rootElem = document.getElementById("root");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.id = "search-bar";

  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-selector";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  episodeSelect.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const formattedSeason = String(episode.season).padStart(2, "0");
    const formattedNumber = String(episode.number).padStart(2, "0");
    option.value = `${episode.name}`;
    option.textContent = `S${formattedSeason}E${formattedNumber} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });
    makePageForEpisodes(filteredEpisodes);
  });

  episodeSelect.addEventListener("change", () => {
    const selectedValue = episodeSelect.value;
    if (selectedValue === "") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.filter(
        (episode) => episode.name === selectedValue
      );
      makePageForEpisodes(selectedEpisode);
    }
  });
}

function updateEpisodeCount(filtered, total) {
  const addLabel = document.createElement("label");
  addLabel.textContent = `Displaying ${filtered} / ${total} episodes.`;
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
