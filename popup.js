chrome.tabs.query({}, function(tabs) {
var myTabsArray = [];
console.log('Number of open tabs:', tabs.length);

tabs.forEach(function(tab) {
  var tabId = tab.id;
  var tabUrl = tab.url;
  var tabTitle = tab.title; 
  
  myTabsArray.push(tab);
  console.log('Tab URL:', tab.url);
  console.log('Tab Title:', tab.title);

});


});
