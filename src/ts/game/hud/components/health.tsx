interface HealthBarProps {
    initialPercent: number;
    growLeft?: boolean;
    handle: { update?: (percent: number) => void };
    color: string;
}

export const HealthBar: JSX.FC<HealthBarProps & JSX.IntrinsicElements["div"]> = (
    props
) => {
    const innerBar = (
        <div
            className={
                "h-full rounded-full  " +
                props.color +
                (props.growLeft ? " ml-auto" : " ")
            }
            style={{ width: props.initialPercent + "%" }}
        >
            {...props.children as any}
        </div>
    ) as HTMLDivElement;

    props.handle.update = (percent: number) => {
        innerBar.style.width = percent + "%";
    };

    const cleansedProps: Partial<HealthBarProps> = { ...props };
    delete cleansedProps.handle;
    delete cleansedProps.initialPercent;

    const el = (
        <div {...cleansedProps}>
            <div className="w-full bg-gray-200 bg-opacity-20 rounded-full h-full ">
                {innerBar}
            </div>
        </div>
    );
    return el;
};
