document.addEventListener("DOMContentLoaded", function () {
  var searchInput = document.getElementById("searchbar");
  searchInput.addEventListener("input", search_tab);
});

chrome.tabs.query({ currentWindow: true }, function (tabs) {
  var myTabsArray = tabs;
  console.log("Number of open tabs:", tabs.length);

  var tabContainer = document.getElementById("tab-container");
  myTabsArray.forEach(function (tab) {
    var tabElement = document.createElement("div");
    tabElement.className = "tabs";


    var iconElement = document.createElement("img");
    iconElement.src = tab.favIconUrl;
    iconElement.className = "tab-icon";
    tabElement.appendChild(iconElement);

    
    var nameElement = document.createElement("span");
    nameElement.textContent = tab.title;
    nameElement.className = "tab-name";
    tabElement.appendChild(nameElement);

    tabElement.addEventListener("click", function () {
      chrome.tabs.update(tab.id, { active: true });
    });

    tabContainer.appendChild(tabElement);
  });
});

function search_tab() {
  let input = document.getElementById("searchbar").value.toLowerCase();
  let x = document.getElementsByClassName("tabs");
  for (var i = 0; i < x.length; i++) {
    var tabTitle = x[i].textContent.toLowerCase();
    if (!tabTitle.includes(input)) {
      x[i].style.display = "none";
    } else {
      x[i].style.display = "block";
    }
  }
}
