function setup() {
  const allEpisodes = getAllEpisodes();
  console.log(allEpisodes);
  let filterInput = allEpisodes;

  makeTopDisplay(allEpisodes, filterInput);
  makePageForEpisodes(filterInput);
}

function makeTopDisplay(allEpisodes, filterInput) {
  const topDisplayElem = document.getElementById("top-display");
  const selectElement = document.createElement("select");
  const inputElement = document.createElement("input");
  //add select
  selectElement.id = "movie-list";
  const allOptions = document.createElement("option");
  allOptions.value = "all";
  allOptions.textContent = "All...";
  selectElement.appendChild(allOptions);
  allEpisodes.map((movie) => {
    const option = document.createElement("option");
    option.value = movie.name;
    option.textContent = `${movie.name} - S${String(movie.season).padStart(
      2,
      "0"
    )}E${String(movie.number).padStart(2, "0")}`;
    selectElement.appendChild(option);
  });
  //select function
  selectElement.addEventListener("change", (e) => {
    // console.log("you click event", e.target.value);
    if (e.target.value == "all") {
      makePageForEpisodes(allEpisodes);
    } else {
      filterInput = allEpisodes.filter((film) => film.name == e.target.value);
      makePageForEpisodes(filterInput);
    }
  });
  //add input
  inputElement.type = "text";
  inputElement.placeholder = "Search It What you Like";
  //add label
  const addLabel = document.createElement("label");
  addLabel.textContent = `This is the list of Episode ${filterInput.length}/${allEpisodes.length}`;
  //input event listener
  inputElement.addEventListener("input", () => {
    const searchName = inputElement.value.toLocaleLowerCase();
    filterInput = filterEpisodes(allEpisodes, searchName);
    // console.log(filterInput);
    addLabel.textContent = `This is the list of Episode ${filterInput.length}/${allEpisodes.length}`;

    makePageForEpisodes(filterInput);
  });
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

window.onload = setup;
