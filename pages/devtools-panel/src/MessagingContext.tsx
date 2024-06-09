import { PropsWithChildren } from 'react';

type Message =
  | {
      type: 'css-selector-generated';
      selector: string;
    }
  | {
      type: 'start-css-selector-generation';
      tabId: number;
    };

type Handler<T> = (variant: T) => void;
const handlers = new Map<string, Handler<unknown>[]>();

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

function getHandlers<T extends string>(type: T) {
  return handlers.get(type) || ([] as Handler<Extract<Message, { type: T }>>[]);
}

export const useMessageListener = function <T extends string>(
  type: T,
  handler: Handler<Extract<Message, { type: T }>>,
) {
  const handlersForType = getHandlers(type);
  handlers.set(type, [...handlersForType, handler] as Handler<unknown>[]);

  return () => {
    const handlersForType = getHandlers(type);
    handlers.set(
      type,
      handlersForType.filter(h => (h as Handler<Extract<Message, { type: T }>>) !== handler) as Handler<unknown>[],
    );
  };
};

export const sendMessage = (tabId: number, message: Message) => {
  chrome.tabs.sendMessage(tabId, message);
};
