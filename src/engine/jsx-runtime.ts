// JSX type support - https:// www.typescriptlang.org/docs/handbook/jsx.html;
// modified from https://stackoverflow.com/a/68238924

/**
 * JSX factory.
 */

// function jsx<T extends keyof JSX.IntrinsicElements>(
//     tag: T,
//     props: JSX.IntrinsicElements[T],
//     ...children: JSX.Node[]
// ): JSX.Element;
// function jsx<U extends JSX.Props>(
//     tag: JSX.Component<U>,
//     props: U,
//     ...children: JSX.Node[]
// ): JSX.Element;

function assertType<T>(param: any): asserts param is T {}
type assertType<T, U> = T extends U ? T : never;

function jsx<U extends {}>(
    tag: keyof JSX.IntrinsicElements | JSX.FC<U>,
    props: U,
    ...children: JSX.ReactNode[]
): JSX.ReactElement {
    props ??= {} as any;
    //@ts-expect-error
    props.children = children;

    if (typeof tag === "function") return tag(props as U);

    assertType<keyof JSX.IntrinsicElements>(tag);
    assertType<JSX.IntrinsicElements[typeof tag]>(props);

    // props ??= {} as any;

    const element = document.createElement(tag);

    // Assign attributes:

    Object.entries(props as Record<string, any>).forEach(([key, value]) => {
        // if (key in element) {
        //     //@ts-expect-error
        //     element[key] = value;
        // }

        if (key == "className") {
            element.className = value;
            return;
        }

        if (key == "children") return;

        if (key === "style") {
            element.style.cssText = Object.entries(value).reduce(
                (prev, [key, val]) => prev + `${key}: ${val};`,
                ""
            );
            return;
        }

        switch (typeof value) {
            case "function":
                return element.addEventListener(key.slice(2), value);
            case "boolean":
                if (!value) return;
                return element.setAttribute(key, "");
            case "number":
            case "string":
                return element.setAttribute(key, `${value}`);
        }

        throw new TypeError("JSX element attribute assigned invalid type");
    });

    element.append(
        ...children
            .flat()
            .filter(
                (
                    node
                ): node is Exclude<
                    JSX.ReactNode,
                    boolean | undefined | null | JSX.ReactFragment
                > => typeof node !== "boolean" && node != null
            )
            .map((node) =>
                typeof node == "string" || typeof node == "number"
                    ? document.createTextNode(node.toString())
                    : node
            )
    );

    return element;
}

// functional component, called indirectly as `jsx(Fragment, props)`
/**
 * Groups elements without introducing a parent element.
 */
const Fragment = <T extends { children: JSX.ReactNode }>(props: T) => props.children;

declare global {
    interface Window {
        jsx<U extends {}>(
            tag: keyof JSX.IntrinsicElements | JSX.FC<U>,
            props: U,
            ...children: JSX.ReactNode[]
        ): JSX.ReactElement;
        jsxFrag(props: { children: JSX.ReactNode }): JSX.ReactNode;
    }
}

window.jsx = jsx;
window.jsxFrag = Fragment;
export {};
// // jsxs is used when there are multiple children
// export { jsx, jsx as jsxs, Fragment };
