document.addEventListener("DOMContentLoaded", function () {
  var searchInput = document.getElementById("searchbar");
  searchInput.addEventListener("input", search_tab);

  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    var myTabsArray = tabs;
    var tabCount = tabs.length;

    console.log("Number of open tabs:", tabCount);

    var tabCountElement = document.getElementById("tab-count");
    tabCountElement.textContent = "You have " + tabCount + " tabs open";

    var tabContainer = document.getElementById("tab-container");
    myTabsArray.forEach(function (tab) {
      var tabElement = document.createElement("div");
      tabElement.className = "tabs";
      tabElement.dataset.tabId = tab.id;

      var iconElement = document.createElement("img");
      iconElement.src = tab.favIconUrl;
      iconElement.className = "tab-icon";
      tabElement.appendChild(iconElement);

      var nameElement = document.createElement("span");
      nameElement.textContent = tab.title;
      nameElement.className = "tab-name";
      tabElement.appendChild(nameElement);

      var checkboxElement = document.createElement("input");
      checkboxElement.type = "checkbox";
      checkboxElement.className = "tab-checkbox";
      tabElement.appendChild(checkboxElement);

      checkboxElement.addEventListener("click", function (event) {
        event.stopPropagation();
      });

      tabElement.addEventListener("click", function () {
        chrome.tabs.update(tab.id, { active: true });
      });

      tabContainer.appendChild(tabElement);
    });

    var highlightDuplicatesBtn = document.getElementById(
      "highlightDuplicatesBtn"
    );
    highlightDuplicatesBtn.addEventListener("click", highlightDuplicates);

    var deleteSelectedTabsBtn = document.getElementById(
      "deleteSelectedTabsBtn"
    );
    deleteSelectedTabsBtn.addEventListener("click", deleteSelectedTabs);
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

function highlightDuplicates() {
  var tabs = Array.from(document.getElementsByClassName("tabs"));
  var tabTitles = tabs.map(function (tab) {
    return tab.textContent.toLowerCase();
  });
  var duplicateTitles = tabTitles.filter(function (tabTitle, index) {
    return tabTitles.indexOf(tabTitle) !== index;
  });

  var highlightedTabs = document.getElementsByClassName("highlighted");
  var isHighlighting = highlightedTabs.length > 0;

  var duplicateCountMap = new Map();

  tabs.forEach(function (tab) {
    var tabTitle = tab.textContent.toLowerCase();
    if (duplicateTitles.includes(tabTitle)) {
      if (!isHighlighting || !tab.classList.contains("highlighted")) {
        tab.classList.add("highlighted");
        var checkbox = tab.querySelector(".tab-checkbox");
        checkbox.checked = true;
      } else {
        tab.classList.remove("highlighted");
        var checkbox = tab.querySelector(".tab-checkbox");
        checkbox.checked = false;
      }

      if (duplicateCountMap.has(tabTitle)) {
        duplicateCountMap.set(tabTitle, duplicateCountMap.get(tabTitle) + 1);
      } else {
        duplicateCountMap.set(tabTitle, 1);
      }
    }
  });

  duplicateCountMap.forEach(function (count, tabTitle) {
    var duplicateTabs = Array.from(
      document.querySelectorAll('.tabs.highlighted .tab-name:not(.checkboxed)')
    );
    var selectedCount = 0;
    duplicateTabs.forEach(function (tab) {
      if (
        tab.textContent.toLowerCase() === tabTitle &&
        selectedCount < count - 1
      ) {
        var checkbox = tab.parentNode.querySelector(".tab-checkbox");
        checkbox.checked = true;
        tab.classList.add("checkboxed");
        selectedCount++;
      }
    });
  });
}



function deleteSelectedTabs() {
  var selectedTabs = document.querySelectorAll(".tab-checkbox:checked");
  var tabsToDelete = Array.from(selectedTabs).map(function (checkbox) {
    return checkbox.parentNode; 
  });

  
  tabsToDelete.forEach(function (tab) {
    var tabId = parseInt(tab.dataset.tabId, 10);
    chrome.tabs.remove(tabId, function () {
      tab.parentNode.removeChild(tab);
      updateTabCount(); 
    });
  });
}
function updateTabCount() {
  var tabCount = document.querySelectorAll(".tabs").length;
  var tabCountElement = document.getElementById("tab-count");
  tabCountElement.textContent = "You have " + tabCount + " tabs open";
}
