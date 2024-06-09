export function generateSelector(element: HTMLElement | null) {
  if (!element) return '';

  let selector = getSelector(element);
  while (!isUnique(selector) && element) {
    element = element.parentElement;
    const newSelector = getSelector(element);
    if (newSelector) selector = newSelector + '>' + selector;
  }

  return selector;
}

function getSelector(element: HTMLElement | null) {
  if (!element) return '';

  const { tagName, id } = element;
  const tag = tagName.toLowerCase();
  if (tag === 'body' || tag === 'html') return tag;

  let selector = tag;
  if (!isUnique(selector)) selector += id ? '#' + id : '';

  return appendPseudoSelector(element, selector);
}

function appendPseudoSelector(element: HTMLElement, selector: string) {
  return isUnique(selector) ? selector : `${selector}:nth-child(${getChildIndex(element)})`;
}

function getChildIndex({ previousElementSibling: sibling }: Element): number {
  return sibling ? getChildIndex(sibling) + 1 : 1;
}

function getQueryLength(selector: string) {
  return document.querySelectorAll(selector).length;
}

function isUnique(selector: string) {
  return getQueryLength(selector) <= 1;
}
