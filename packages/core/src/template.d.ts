import React from 'react';
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
};
export declare function useStore(store: Store): unknown;
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
export type DataState = any;
export type PropDataState = DataState | {
    key: string | number;
    $?: undefined;
};
export type PropsState = Record<string, PropDataState | PropDataState[]>;
export type RefsRecord = Record<string, PropDataState | null>;
export declare function Template({ components, dataSource, onEvent, ...props }: {
    components: Record<string, ComponentDefinition<{}>>;
    dataSource: DataSource;
    onEvent: (key: string, name: string, payload: any) => void;
    path: string;
}): React.JSX.Element;
export {};
//# sourceMappingURL=template.d.ts.map