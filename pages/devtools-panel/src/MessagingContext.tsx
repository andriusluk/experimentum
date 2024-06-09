import { PropsWithChildren } from 'react';

type Handler = (message: Message) => void;
const handlers = new Map<string, Handler[]>();

type Message =
  | {
      type: 'css-selector-generated';
      selector: string;
    }
  | {
      type: 'start-css-selector-generation';
      tabId: number;
    };

export const MessageListener = ({ children }: PropsWithChildren) => {
  chrome.runtime.onMessage.addListener(function (request: Message, _, sendResponse) {
    sendResponse();
    const handlersForType = getHandlers(request.type);
    for (const handler of handlersForType) {
      handler(request);
    }
  });

  return children;
};

function getHandlers(type: string) {
  return handlers.get(type) || ([] as Handler[]);
}

export const useMessageListener = (type: string, handler: Handler) => {
  const handlersForType = getHandlers(type);
  handlers.set(type, [...handlersForType, handler]);

  return () => {
    const handlersForType = getHandlers(type);
    handlers.set(
      type,
      handlersForType.filter(h => h !== handler),
    );
  };
};

export const sendMessage = (tabId: number, message: Message) => {
  chrome.tabs.sendMessage(tabId, message);
};
