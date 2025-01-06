// JavaScript code for Level 300 implementation

let allEpisodes = []; // Store episodes fetched from API

function setup() {
  fetchEpisodes()
    .then((episodes) => {
      allEpisodes = episodes;
      initializeSearchAndDropdown(allEpisodes);
      makePageForEpisodes(allEpisodes);
    })
    .catch((error) => {
      displayError("Failed to load episodes. Please try again later.");
      console.error("Error fetching episodes:", error);
    });
}

function fetchEpisodes() {
  const API_URL = "https://api.tvmaze.com/shows/82/episodes";

  return new Promise((resolve, reject) => {
    displayLoading(); // Show loading message
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        hideLoading(); // Remove loading message
        resolve(data);
      })
      .catch((error) => {
        hideLoading(); // Ensure loading is removed even on error
        reject(error);
      });
  });
}

function makePageForEpisodes(episodeList) {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = ""; // Clear previous episodes

  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    const title = document.createElement("h2");
    const formattedSeason = String(episode.season).padStart(2, "0");
    const formattedNumber = String(episode.number).padStart(2, "0");
    title.textContent = `${episode.name} - S${formattedSeason}E${formattedNumber}`;

    const img = document.createElement("img");
    img.src = episode.image ? episode.image.medium : "placeholder.jpg"; // Handle missing images
    img.alt = `${episode.name} - S${formattedSeason}E${formattedNumber}`;

    const refButton = document.createElement("button");
    refButton.textContent = "Reference";
    refButton.addEventListener("click", () => {
      window.open(episode.url, "_blank");
    });

    const description = document.createElement("p");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = episode.summary;
    description.textContent = tempDiv.textContent || tempDiv.innerText;

    episodeDiv.append(title, img, refButton, description);
    mainContainer.appendChild(episodeDiv);
  });
}

function initializeSearchAndDropdown(allEpisodes) {
  const rootElem = document.getElementById("root");

  // Create search bar
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.id = "search-bar";

  // Create dropdown
  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-selector";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode...";
  episodeSelect.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const formattedSeason = String(episode.season).padStart(2, "0");
    const formattedNumber = String(episode.number).padStart(2, "0");
    option.value = `${episode.name}`;
    option.textContent = `S${formattedSeason}E${formattedNumber} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  // Event listeners
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });
    makePageForEpisodes(filteredEpisodes);
    updateEpisodeCount(filteredEpisodes.length, allEpisodes.length);
  });

  episodeSelect.addEventListener("change", () => {
    const selectedValue = episodeSelect.value;
    if (selectedValue === "") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.filter((episode) => episode.name === selectedValue);
      makePageForEpisodes(selectedEpisode);
    }
  });

  // Add elements to DOM
  const controlsDiv = document.createElement("div");
  controlsDiv.id = "controls";
  controlsDiv.append(searchInput, episodeSelect);
  rootElem.prepend(controlsDiv);

  // Episode count display
  const episodeCount = document.createElement("p");
  episodeCount.id = "episode-count";
  rootElem.append(episodeCount);
  updateEpisodeCount(allEpisodes.length, allEpisodes.length);
}

function updateEpisodeCount(filtered, total) {
  const episodeCount = document.getElementById("episode-count");
  episodeCount.textContent = `Displaying ${filtered} / ${total} episodes.`;
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
