import debounce from 'lodash/debounce';
import { generateSelector } from './css-selector-generator';

/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-undef */
const HIGHLIGHTER_ID = 'selector-grab-highlighter';
let lastHighlightTarget: HTMLElement | null = null;

function terminate() {
  // The `click` listener is automatically removed after it has been called once
  window.removeEventListener('mousemove', debounce(updateHighlight, 100));
  window.removeEventListener('keydown', checkTerminateKeys);
  removeHighlight();
}

export function addHighlight() {
  const div = document.createElement('div');
  div.id = HIGHLIGHTER_ID;
  const { style } = div;
  style.backgroundColor = '#1d234280';
  style.boxSizing = 'border-box';
  style.border = 'solid 4px #f0bb8980';
  style.position = 'fixed';
  style.zIndex = '9999';
  style.pointerEvents = 'none';
  document.body.appendChild(div);
}

export function updateHighlight({ target }: MouseEvent) {
  if (!(target instanceof HTMLElement) || target === lastHighlightTarget) {
    return;
  }
  lastHighlightTarget = target;
  const { top, left, width, height } = target.getBoundingClientRect();
  const highlighter = document.getElementById(HIGHLIGHTER_ID);
  if (!highlighter) return;
  const { style } = highlighter;
  style.top = top - 4 + 'px';
  style.left = left - 4 + 'px';
  style.width = width + 8 + 'px';
  style.height = height + 8 + 'px';
}

function removeHighlight() {
  const highlighter = document.getElementById(HIGHLIGHTER_ID);
  if (highlighter) {
    document.body.removeChild(highlighter);
  }
}

export function grabSelectorFactory(callback: (selector: string) => void) {
  return (event: MouseEvent) => grabSelector(event, callback);
}

async function grabSelector(event: MouseEvent, callback: (selector: string) => void) {
  event.preventDefault();
  const { target } = event;
  if (!(target instanceof HTMLElement)) {
    terminate();
    return;
  }

  try {
    const selector = generateSelector(target);
    callback(selector);
  } catch (err) {
    console.error('Could not write selector to clipboard\nError: ' + err);
  }
  terminate();
}

export function checkTerminateKeys(event: KeyboardEvent) {
  const { key } = event;
  if (key === 'Escape' || key === 'Esc') {
    event.preventDefault();
    terminate();
  }
}
