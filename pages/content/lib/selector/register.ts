import debounce from 'lodash/debounce';
import { addHighlight, checkTerminateKeys, grabSelectorFactory, updateHighlight } from './handlers';

export function startSelection(resultCallback: (selector: string) => void) {
  addHighlight();
  window.addEventListener('mousemove', debounce(updateHighlight));
  window.addEventListener('click', grabSelectorFactory(resultCallback), { capture: true, once: true });
  window.addEventListener('keydown', checkTerminateKeys);
}
