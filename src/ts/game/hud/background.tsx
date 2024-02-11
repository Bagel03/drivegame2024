export const MenuBackground: JSX.FC<{ id?: string; className?: string }> = (
    props
) => {
    return (
        <div
            className={
                "bg-gradient-radial from-menuBackgroundAccent to-menuBackground w-full h-full " +
                (props.className || "")
            }
            id={props.id || "menuBackground"}
        >
            {...props.children as any}
        </div>
    );
};
