export const HudToolbar: JSX.FC<{
    items: {
        icon: string;
        float?: string;
        onClick: () => void;
    }[];
}> = function (props) {
    return (
        <div className="hud-toolbar">
            <div className="hud-toolbar-container flex">
                {props.items.map((item) => (
                    <button
                        className="hud-toolbar-item unstyled-button"
                        onclick={item.onClick}
                    >
                        <div className="hud-toolbar-item-interior">
                            <img src={item.icon}></img>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
