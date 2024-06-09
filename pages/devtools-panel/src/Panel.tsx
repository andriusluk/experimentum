import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import '@src/Panel.css';
import { ComponentPropsWithoutRef, useCallback, useState } from 'react';
import { sendMessage, useMessageListener } from './MessagingContext';
import { useTabId } from './TabContext';

const Panel = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const [selector, setSelector] = useState<string | null>(null);

  useMessageListener('css-selector-generated', ({ selector }) => {
    setSelector(selector);
  });

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#eee' : '#222',
      }}>
      <header className="App-header" style={{ color: theme === 'light' ? '#222' : '#eee' }}>
        <img src={chrome.runtime.getURL('devtools-panel/logo.svg')} className="App-logo" alt="logo" />
        <p>
          Edit <code>pages/devtools-panel/src/Panel.tsx</code> and save to reload.
        </p>
        {selector && (
          <p>
            Selector: <code>{selector}</code>
          </p>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === 'light' ? '#0281dc' : undefined, marginBottom: '10px' }}>
          Learn React!
        </a>
        <ToggleButton>Toggle theme</ToggleButton>
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const tabId = useTabId();

  const toggleTheme = useCallback(async () => {
    exampleThemeStorage.toggle();
    if (!tabId) {
      return;
    }
    sendMessage(tabId, { type: 'start-css-selector-generation', tabId });
  }, [tabId]);

  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={toggleTheme}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
