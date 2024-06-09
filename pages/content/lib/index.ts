import { toggleTheme } from '@lib/toggleTheme';
import { startSelection } from './selector/register';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse();
  console.log('content script received message:', request);
  if (request.type !== 'start-css-selector-generation') {
    return;
  }
  const tabId = sender.tab?.id;
  startSelection(selector => {
    chrome.runtime.sendMessage({ type: 'css-selector-generated', selector, tabId });
  });
});
console.log('content script loaded');

void toggleTheme();

// const resultCallback = async (selector: string) => {
//   await navigator?.clipboard?.writeText(selector);
//   console.log('Selector copied to clipboard:', selector);
// };
