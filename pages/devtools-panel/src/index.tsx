import Panel from '@src/Panel';
import '@src/index.css';
import { createRoot } from 'react-dom/client';
import { MessageListener } from './MessagingContext';
import { TabListener } from './TabContext';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(
    <TabListener>
      <MessageListener>
        <Panel />
      </MessageListener>
    </TabListener>,
  );
}

init();
