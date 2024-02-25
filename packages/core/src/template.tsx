import { Text } from 'react-native';
import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

export type ComponentDefinition<ComponentProps extends {}> = {
  component: React.ComponentType<ComponentProps>;
  validator?: (input: any) => ComponentProps | undefined;
};

export type Store<V = unknown> = {
  get: () => V;
  subscribe: (handler: () => void) => () => void;
};

export type DataSource = {
  get: (key: string) => Store;
  sendEvent?: (path: string, name: string, value: any) => void;
};

export function useStore(store: Store) {
  return useSyncExternalStore(store.subscribe, store.get);
}

export type ComponentDataState = {
  key: string;
  $: 'component';
  component: string;
  children: DataState[];
  props: PropsState;
};

type RefLookup = string | [string, ...(string | number)[]];
export type ReferencedDataState = {
  key: string;
  $: 'ref';
  ref: RefLookup;
};
// export type DataState =
//   | ComponentDataState
//   | ReferencedDataState
//   | string
//   | number
//   | Record<string, DataState>;
export type DataState = any;
export type PropDataState = DataState | { key: string | number; $?: undefined };
export type PropsState = Record<string, PropDataState | PropDataState[]>;
export type RefsRecord = Record<string, PropDataState | null>;

function extractRefValue(
  dataValues: Record<string, DataState | null>,
  ref: RefLookup
) {
  if (typeof ref === 'string') return dataValues[ref];
  if (Array.isArray(ref)) {
    const [refKey, ...rest] = ref;
    let lookupValue = dataValues[refKey];
    rest.forEach((key) => {
      if (lookupValue && typeof lookupValue === 'object') {
        lookupValue = lookupValue[key];
      }
    });
    return lookupValue;
  }
  return null;
}
function extractRefKey(ref: RefLookup) {
  if (typeof ref === 'string') return ref;
  if (Array.isArray(ref)) {
    return ref[0];
  }
  return null;
}

function findAllRefs(
  rootNodeState: DataState,
  refValues: RefsRecord
): Set<string> {
  const currentRefKeys = new Set<string>();
  function searchRefs(state: DataState) {
    if (Array.isArray(state)) {
      state.forEach(searchRefs);
      return;
    }
    if (!state || typeof state !== 'object') return;
    if (state.$ === 'ref') {
      const refKey = extractRefKey(state.ref);
      if (!refKey) return;
      currentRefKeys.add(refKey);
      const lastValue = refValues[refKey];
      if (lastValue) searchRefs(lastValue);
      return;
    }
    if (state.$ === 'component') {
      if (Array.isArray(state.children)) {
        state.children.forEach(searchRefs);
      }
      if (state.props) {
        Object.entries(state.props).forEach(([_key, value]) => {
          searchRefs(value);
        });
      }
      return;
    }
    Object.values(state).forEach(searchRefs);
  }
  searchRefs(rootNodeState);

  return currentRefKeys;
}

function createRefStateManager(
  setDataValues: Dispatch<SetStateAction<RefsRecord>>,
  dataSource: DataSource,
  rootKey: string
) {
  let refsState: RefsRecord = {
    [rootKey]: dataSource.get(rootKey).get(),
  };
  let refSubscriptions: Record<string, () => void> = {};
  function setRefValue(refKey: string, value: PropDataState) {
    if (refsState[refKey] !== value) {
      refsState = { ...refsState, [refKey]: value };
      setDataValues(refsState);
      return true;
    }
    return false;
  }
  function ensureSubscription(key: string) {
    if (!refSubscriptions[key]) {
      const refValueProvider = dataSource.get(key);
      refSubscriptions[key] = refValueProvider.subscribe(() => {
        const didUpdate = setRefValue(key, refValueProvider.get());
        if (didUpdate) {
          performSubscriptions();
        }
      });
      setRefValue(key, refValueProvider.get());
    }
  }
  function performSubscriptions() {
    ensureSubscription(rootKey);
    const rootState = dataSource.get(rootKey).get();
    const referencedRefs = findAllRefs(rootState, refsState);
    referencedRefs.add(rootKey);
    referencedRefs.forEach(ensureSubscription);
    Object.entries(refSubscriptions).forEach(([key, release]) => {
      if (!referencedRefs.has(key)) {
        release();
        delete refSubscriptions[key];
      }
    });
  }
  function releaseSubscriptions() {
    Object.values(refSubscriptions).forEach((release) => release());
    refSubscriptions = {};
    refsState = {};
  }
  return {
    activate() {
      performSubscriptions();
      return releaseSubscriptions;
    },
  };
}

type RefStateManager = ReturnType<typeof createRefStateManager>;

function isPrimitive(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

function resolveValueRefs(dataValues: RefsRecord, value: DataState): DataState {
  if (isPrimitive(value)) return value;
  if (Array.isArray(value)) {
    return value.map((item) => resolveValueRefs(dataValues, item));
  }
  if (typeof value === 'object') {
    if (value.$ === 'ref') {
      return resolveRef(dataValues, value.ref);
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        return [key, resolveValueRefs(dataValues, item)];
      })
    );
  }
}

function resolveRef(dataValues: RefsRecord, lookup: RefLookup): DataState {
  const value = extractRefValue(dataValues, lookup);
  return resolveValueRefs(dataValues, value);
}

export function Template({
  components,
  dataSource,
  onEvent,
  ...props
}: {
  components: Record<string, ComponentDefinition<{}>>;
  dataSource: DataSource;
  onEvent: (key: string, name: string, payload: any) => void;
  path: string;
}) {
  const [dataValues, setDataValues] = useState<RefsRecord>({});
  const refStateManager = useRef<RefStateManager>(
    createRefStateManager(setDataValues, dataSource, props.path || '')
  );
  useEffect(() => {
    const release = refStateManager.current.activate();
    return () => release();
  }, []);

  function renderComponent(stateNode: ComponentDataState, path: string) {
    const componentDefinition = components[stateNode.component];
    if (!componentDefinition) {
      return <Text key={path}>Unknown component: {stateNode.component}</Text>;
    }
    const Component = componentDefinition.component;
    if (!Component)
      return <Text key={path}>Invalid Component "{stateNode.component}"</Text>;

    let componentProps = {};

    if (stateNode.props) {
      componentProps = Object.fromEntries(
        Object.entries(stateNode.props).map(([propKey, propValue]) => {
          let outputValue: unknown = propValue;
          if (
            propValue &&
            !Array.isArray(propValue) &&
            typeof propValue === 'object' &&
            propValue.$ === 'component'
          ) {
            outputValue = renderProp(propValue, `${path}.$props.${propKey}`);
          }
          return [propKey, outputValue];
        })
      );
    }
    const [errors, finalProps] = validateProps(
      componentProps,
      componentDefinition.validator
    ) as [unknown, PropsState];
    if (errors) {
      return <Text key={path}>Invalid props: {JSON.stringify(errors)}</Text>;
    }
    const children = stateNode.children
      ? renderElements(stateNode.children, path)
      : null;
    return (
      <Component
        key={path}
        {...finalProps}
        // @ts-expect-error
        children={children}
        onTemplateEvent={(name: string, payload: any) =>
          onEvent(path, name, payload)
        }
      />
    );
  }

  function renderProp(stateNode: PropDataState, path: string) {
    if (typeof stateNode === 'string') {
      return stateNode;
    }
    if (typeof stateNode === 'number') {
      return stateNode;
    }
    if (typeof stateNode !== 'object') {
      return null;
    }
    if (!stateNode) {
      return null;
    }
    if (stateNode.$ === 'component') return renderComponent(stateNode, path);
    return stateNode;
  }

  function renderElement(stateNode: DataState, path: string) {
    if (typeof stateNode === 'string') {
      return <Text key={path}>{stateNode}</Text>;
    }
    if (typeof stateNode === 'number') {
      return <Text key={path}>{stateNode}</Text>;
    }
    if (stateNode?.$ === 'component') {
      return renderComponent(stateNode, path);
    }
    return <Text key={path}>Unknown: {JSON.stringify(stateNode)}</Text>;
  }

  function renderElements(children: DataState | DataState[], path: string) {
    if (!children) return null;
    if (!Array.isArray(children)) {
      return renderElement(children, path);
    }
    return children.map((child, index) => {
      const childKey =
        (child && typeof child === 'object' ? child.key : null) ||
        String(index);
      const childPath = path === '' ? childKey : `${path}.${childKey}`;
      return renderElement(child, childPath);
    });
  }

  const rootNodeState = resolveRef(dataValues, props.path);
  return <>{renderElements(rootNodeState, props.path)}</>;
}

type ValidationErrors = any;

function validateProps<Value>(
  input: any,
  validator: (input: any) => Value | undefined
): [ValidationErrors | null, Value | undefined] {
  if (!validator) return [null, input];
  try {
    const value = validator(input);
    return [null, value];
  } catch (e) {
    console.log(e);
    return [
      // @ts-expect-error
      e.errors,
      undefined,
    ];
  }
}
