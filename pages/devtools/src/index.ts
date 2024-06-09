try {
  console.log("Edit 'pages/devtools/src/index.ts' and save to reload.");
  chrome.devtools.panels.create('Experimentum', 'icon-34.png', 'devtools-panel/index.html');
} catch (e) {
  console.error(e);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('init', request, sender);
  sendResponse();
});
