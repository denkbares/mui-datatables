const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMClient = require('react-dom/client');

// React 19 internals shim for enzyme/react-shallow-renderer compatibility.
if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  const clientInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE || {};

  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
    ReactCurrentDispatcher: {
      get current() {
        return clientInternals.H;
      },
      set current(v) {
        clientInternals.H = v;
      },
    },
    ReactCurrentOwner: {
      get current() {
        return clientInternals.A;
      },
      set current(v) {
        clientInternals.A = v;
      },
    },
    ReactCurrentBatchConfig: {
      get transition() {
        return clientInternals.T;
      },
      set transition(v) {
        clientInternals.T = v;
      },
    },
    ReactDebugCurrentFrame: {
      getCurrentStack: clientInternals.getCurrentStack || null,
      getStackAddendum: () => '',
    },
  };
}

const { flushSync } = ReactDOM;
if (!ReactDOM.render) {
  ReactDOM.render = function (element, container, callback) {
    if (!container._reactRoot) {
      container._reactRoot = ReactDOMClient.createRoot(container);
    }
    flushSync(() => {
      container._reactRoot.render(element);
    });
    if (callback) callback();

    const internalRoot = container._reactRoot._internalRoot;
    if (internalRoot && internalRoot.current) {
      let fiber = internalRoot.current;
      while (fiber) {
        if (fiber.stateNode && fiber.stateNode instanceof React.Component) {
          return fiber.stateNode;
        }
        fiber = fiber.child;
      }
    }
    return null;
  };
}

if (!ReactDOM.unmountComponentAtNode) {
  ReactDOM.unmountComponentAtNode = function (container) {
    if (container._reactRoot) {
      container._reactRoot.unmount();
      delete container._reactRoot;
      return true;
    }
    return false;
  };
}

if (!ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = function (componentOrElement) {
    if (componentOrElement == null) return null;
    if (componentOrElement.nodeType === 1) return componentOrElement;

    const fiber = componentOrElement._reactInternals || componentOrElement._reactInternalFiber;
    if (fiber) {
      let node = fiber;
      while (node) {
        if (node.stateNode && node.stateNode.nodeType === 1) {
          return node.stateNode;
        }
        node = node.child;
      }
    }
    return null;
  };
}

const TestUtils = require('react-dom/test-utils');
if (!TestUtils.Simulate) {
  const eventMap = {
    click: ['MouseEvent', { bubbles: true, cancelable: true }],
    doubleClick: ['MouseEvent', { bubbles: true, cancelable: true }],
    mouseDown: ['MouseEvent', { bubbles: true, cancelable: true }],
    mouseUp: ['MouseEvent', { bubbles: true, cancelable: true }],
    mouseEnter: ['MouseEvent', { bubbles: false }],
    mouseLeave: ['MouseEvent', { bubbles: false }],
    mouseMove: ['MouseEvent', { bubbles: true }],
    mouseOver: ['MouseEvent', { bubbles: true }],
    mouseOut: ['MouseEvent', { bubbles: true }],
    change: ['Event', { bubbles: true }],
    input: ['Event', { bubbles: true }],
    submit: ['Event', { bubbles: true }],
    focus: ['FocusEvent', { bubbles: false }],
    blur: ['FocusEvent', { bubbles: false }],
    keyDown: ['KeyboardEvent', { bubbles: true }],
    keyUp: ['KeyboardEvent', { bubbles: true }],
    keyPress: ['KeyboardEvent', { bubbles: true }],
    touchStart: ['Event', { bubbles: true }],
    touchEnd: ['Event', { bubbles: true }],
    touchMove: ['Event', { bubbles: true }],
    scroll: ['Event', { bubbles: false }],
    drag: ['DragEvent', { bubbles: true }],
    dragStart: ['DragEvent', { bubbles: true }],
    dragEnd: ['DragEvent', { bubbles: true }],
    dragEnter: ['DragEvent', { bubbles: true }],
    dragLeave: ['DragEvent', { bubbles: true }],
    dragOver: ['DragEvent', { bubbles: true }],
    drop: ['DragEvent', { bubbles: true }],
    contextMenu: ['MouseEvent', { bubbles: true }],
    copy: ['Event', { bubbles: true }],
    cut: ['Event', { bubbles: true }],
    paste: ['Event', { bubbles: true }],
    compositionEnd: ['CompositionEvent', { bubbles: true }],
    compositionStart: ['CompositionEvent', { bubbles: true }],
    compositionUpdate: ['CompositionEvent', { bubbles: true }],
    select: ['Event', { bubbles: true }],
    animationStart: ['AnimationEvent', { bubbles: true }],
    animationEnd: ['AnimationEvent', { bubbles: true }],
    animationIteration: ['AnimationEvent', { bubbles: true }],
    transitionEnd: ['TransitionEvent', { bubbles: true }],
    error: ['Event', { bubbles: false }],
    load: ['Event', { bubbles: false }],
    abort: ['Event', { bubbles: false }],
    reset: ['Event', { bubbles: true }],
    invalid: ['Event', { bubbles: false }],
  };

  const toDOMEventName = name => name.toLowerCase();
  TestUtils.Simulate = {};

  function dispatchSimulatedEvent(domNode, eventName, EventConstructor, defaults, eventData) {
    const Ctor = global[EventConstructor] || global.Event;
    const event = new Ctor(toDOMEventName(eventName), { ...defaults, ...eventData });

    if (eventData) {
      Object.keys(eventData).forEach(key => {
        if (!(key in event) || event[key] !== eventData[key]) {
          try {
            Object.defineProperty(event, key, { value: eventData[key], writable: true });
          } catch (e) {}
        }
      });

      if (eventData.target && eventData.target.value !== undefined) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(domNode), 'value');
        if (nativeInputValueSetter && nativeInputValueSetter.set) {
          nativeInputValueSetter.set.call(domNode, eventData.target.value);
        } else {
          domNode.value = eventData.target.value;
        }
      }

      if (eventData.target && eventData.target.checked !== undefined) {
        domNode.checked = eventData.target.checked;
      }
    }

    domNode.dispatchEvent(event);
  }

  Object.keys(eventMap).forEach(eventName => {
    const [EventConstructor, defaults] = eventMap[eventName];
    TestUtils.Simulate[eventName] = function (domNode, eventData) {
      dispatchSimulatedEvent(domNode, eventName, EventConstructor, defaults, eventData);
      if (eventName === 'change') {
        dispatchSimulatedEvent(domNode, 'input', 'Event', { bubbles: true }, eventData);
      }
    };
  });
}

const reactIs = require('react-is');
const REACT_ELEMENT_TYPE = Symbol.for('react.element');
const REACT_TRANSITIONAL_ELEMENT_TYPE = Symbol.for('react.transitional.element');
const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
const REACT_MEMO_TYPE = Symbol.for('react.memo');

const origIsForwardRef = reactIs.isForwardRef;
reactIs.isForwardRef = function (object) {
  if (origIsForwardRef(object)) return true;
  if (object && (object.$$typeof === REACT_TRANSITIONAL_ELEMENT_TYPE || object.$$typeof === REACT_ELEMENT_TYPE)) {
    return object.type && object.type.$$typeof === REACT_FORWARD_REF_TYPE;
  }
  return false;
};

const origIsMemo = reactIs.isMemo;
reactIs.isMemo = function (object) {
  if (origIsMemo(object)) return true;
  if (object && (object.$$typeof === REACT_TRANSITIONAL_ELEMENT_TYPE || object.$$typeof === REACT_ELEMENT_TYPE)) {
    return object.type && object.type.$$typeof === REACT_MEMO_TYPE;
  }
  return false;
};

const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
const adapter = new Adapter();
adapter.isValidElement = React.isValidElement;

const origNodeToHostNode = adapter.nodeToHostNode.bind(adapter);
function findFirstHostDOMNode(node) {
  if (!node) return null;
  if (typeof node === 'string' || typeof node === 'number') return null;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const result = findFirstHostDOMNode(node[i]);
      if (result) return result;
    }
    return null;
  }
  if (node.nodeType === 'host' && node.instance) return node.instance;
  if (node.nodeType === 'class' && node.instance) {
    const domNode = ReactDOM.findDOMNode(node.instance);
    if (domNode) return domNode;
    return findFirstHostDOMNode(node.rendered);
  }
  return findFirstHostDOMNode(node.rendered);
}

adapter.nodeToHostNode = function (node, supportsArray) {
  try {
    const result = origNodeToHostNode(node, supportsArray);
    if (result) return result;
  } catch (e) {}
  return findFirstHostDOMNode(node);
};

Enzyme.configure({ adapter });
