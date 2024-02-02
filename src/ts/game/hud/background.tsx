export const MenuBackground: JSX.FC<{}> = (props) => {
    return (
        <div className="bg-gradient-radial from-menuBackgroundAccent to-menuBackground w-full h-full">
            {...props.children as any}
        </div>
    );
};
