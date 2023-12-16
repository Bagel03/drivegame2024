// JSX type support - https:// www.typescriptlang.org/docs/handbook/jsx.html;
// modified from https://stackoverflow.com/a/68238924
// declare namespace JSX {
//     type JSXElementConstructor<P> =
//         | ((props: P) => ReactElement<any, any> | null)
//         | (new (props: P) => Component<any, any>);

//     /**
//      * The return type of a JSX expression.
//      *
//      * In reality, Fragments can return arbitrary values, but we ignore this for convenience.
//      */
//     interface Element {
//         type: string | JSXElementConstructor<any>
//     }

//     type transformProp<
//         T extends string,
//         El extends keyof HTMLElementTagNameMap
//     > = T extends "children" | "style" // exclude the children & style because those are treated differently
//         ? never
//         : T extends WritableKeys<HTMLElementTagNameMap[El]> // exclude readonly
//         ? HTMLElementTagNameMap[El][T] extends (...args: any[]) => any // exclude functions
//             ? T extends `on${string}` // allow "onXYZ" though
//                 ? T
//                 : never
//             : T
//         : never;

//     /*
//      * Key-value list of intrinsic element names and their allowed properties.
//      *
//      * Because children are treated as a property, the Node type cannot be excluded from the index signature.
//      */
//     type IntrinsicElements = {
//         [El in keyof HTMLElementTagNameMap]: {
//             [Prop in keyof HTMLElementTagNameMap[El] as transformProp<
//                 Prop,
//                 El
//             >]?: HTMLElementTagNameMap[El][Prop];
//         } & {
//             children?: Node | Node[];
//             style?: string;
//         };
//     };

//     /**
//      * The property of the attributes object storing the children.
//      */
//     type ElementChildrenAttribute = { children: unknown };

//     // The following do not have special meaning to TypeScript.

//     /**
//      * An attributes object.
//      */
//     type Props = { [k: string]: unknown; children?: Node | Node[] };

//     /**
//      * A functional component requiring attributes to match `T`.
//      */
//     type Component<T extends Props> = {
//         (props: T, ...children: JSX.Node[]): Element;
//     };

//     /**
//      * A child of a JSX element.
//      */
//     type Node = Element | string | boolean | null | undefined;
// }

// type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
//     T
// >() => T extends Y ? 1 : 2
//     ? A
//     : B;

// type WritableKeys<T> = T[keyof T];

declare namespace JSX {
    type Key = string | number;

    interface Attributes {
        key?: Key | null | undefined;
    }

    type ReactChild = ReactElement | string | number;
    type ReactFragment = Iterable<ReactNode>;

    interface ReactPortal extends ReactElement {
        // key: Key | null;
        children: ReactNode;
    }

    type ReactNode =
        | ReactChild
        | ReactFragment
        | ReactPortal
        | boolean
        | null
        | undefined;

    class Component<P, S = any> {
        constructor(props: Readonly<P> | P);

        // We MUST keep setState() as a unified signature because it allows proper checking of the method return type.
        // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18365#issuecomment-351013257
        // Also, the ` | S` allows intellisense to not be dumbisense
        // setState<K extends keyof S>(
        //     state:
        //         | ((
        //               prevState: Readonly<S>,
        //               props: Readonly<P>
        //           ) => Pick<S, K> | S | null)
        //         | (Pick<S, K> | S | null),
        //     callback?: () => void
        // ): void;

        // forceUpdate(callback?: () => void): void;
        render(): ReactNode;

        readonly props: Readonly<P>;
        state: Readonly<S>;
    }

    interface ComponentClass<P = {}, S = any> {
        new (props: P): Component<P, S>;
        // displayName?: string | undefined;
    }

    type FC<P> = (
        props: P & { children?: ReactNode | undefined }
    ) => ReactElement<any, any>;

    type JSXElementConstructor<P> =
        | ((props: P) => ReactElement<any, any> | null)
        | (new (props: P) => Component<any, any>);

    interface ReactElement<
        P = any,
        T extends string | JSXElementConstructor<any> =
            | string
            | JSXElementConstructor<any>
    > extends Node {
        // type: T;
        // props: P;
        // key: Key | null;
    }

    interface Element extends ReactElement<any, any> {}
    interface ElementClass extends Component<any> {
        render(): ReactNode;
    }

    interface ElementAttributesProperty {
        props: {};
    }
    interface ElementChildrenAttribute {
        children: {};
    }

    interface IntrinsicAttributes {
        key?: Key | null | undefined;
    }

    type RemoveIgnoredProps<
        TagName extends keyof HTMLElementTagNameMap,
        PropName extends keyof HTMLElementTagNameMap[TagName]
    > = PropName extends "children" | "style"
        ? never
        : HTMLElementTagNameMap[TagName][PropName] extends (...args: any[]) => any
        ? PropName extends `on${string}`
            ? PropName
            : never
        : PropName;

    type IntrinsicElements = {
        [TagName in keyof HTMLElementTagNameMap]: {
            [PropName in keyof HTMLElementTagNameMap[TagName] as RemoveIgnoredProps<
                TagName,
                PropName
            >]?: HTMLElementTagNameMap[TagName][PropName];
        } & {
            children?: ReactNode | undefined;
            style?: Partial<CSSStyleDeclaration>;
        };
    };

    function createElement<P extends {}, T extends Element>(
        type: string,
        props?: (Attributes & P) | null,
        ...children: ReactNode[]
    ): ReactElement<P, string>;

    // Custom components
    function createElement<P extends {}>(
        type: FC<P> | ComponentClass<P> | string,
        props?: (Attributes & P) | null,
        ...children: ReactNode[]
    ): ReactElement<P>;
}
// {
//     [P in keyof T]-?: IfEquals<
//         {
//             [Q in P]: T[P];
//         },
//         {
//             -readonly [Q in P]: T[P];
//         },
//         P
//     >;
// }[keyof T];
