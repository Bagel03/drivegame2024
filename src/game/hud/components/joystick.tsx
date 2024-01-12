export interface JoystickProps {
    side: "left" | "right";
    id: string;
}

export type JoystickConnectedEvent = CustomEvent<{
    joystickId: string;
    joystick: HTMLElement;
}>;

export type JoystickInputChangeEvent = CustomEvent<{
    x: number;
    y: number;
    angle: number;
}>;

export type JoystickFireEvent = CustomEvent<{
    x: number;
    y: number;
    angle: number;
}>;

declare global {
    interface GlobalEventHandlersEventMap {
        joystickconnected: JoystickConnectedEvent;
        inputchange: JoystickInputChangeEvent;
        fire: JoystickFireEvent;
    }
}

export const Joystick: JSX.FC<JoystickProps> = (props) => {
    const thumb = (
        <div className="rounded-full w-8 h-8 bg-gray-800"></div>
    ) as HTMLElement;

    const container = (
        <div
            className={`fixed bottom-0 mb-6 mr-4 ml-4  w-16 h-16 ${
                props.side === "left" ? "left-0" : "right-0"
            }`}
        >
            <div className="rounded-full border-gray-600 border-2 w-16 h-16 bg-gray-400 bg-opacity-40 flex items-center justify-center">
                {thumb}
            </div>
        </div>
    ) as HTMLElement;

    window.dispatchEvent(
        new CustomEvent("joystickconnected", {
            detail: { joystickId: props.id, joystick: container },
        }) satisfies JoystickConnectedEvent
    );

    let pointerId: number | null = null;

    container.addEventListener("pointerdown", (e) => {
        if (pointerId !== null) return;
        pointerId = e.pointerId;
        correctOffset(e);
    });

    window.addEventListener("pointermove", (e) => {
        if (e.pointerId !== pointerId) return;
        correctOffset(e);
    });

    window.addEventListener("pointerup", (e) => {
        console.log("Up");
        if (e.pointerId === pointerId) {
            pointerId = null;
            thumb.style.transform = "";
            container.dispatchEvent(
                new CustomEvent("fire", {
                    detail: {
                        x: parseFloat(container.dataset.x!),
                        y: parseFloat(container.dataset.y!),
                        angle: parseFloat(container.dataset.angle!),
                    },
                }) satisfies JoystickFireEvent
            );
            container.dataset.x = "0";
            container.dataset.y = "0";
            container.dataset.angle = "0";
            container.dispatchEvent(
                new CustomEvent("inputchange", {
                    detail: { x: 0, y: 0, angle: 0, full: false },
                }) satisfies JoystickInputChangeEvent
            );
        }
    });

    return container;

    function correctOffset(event: { clientX: number; clientY: number }) {
        const elPos = container.getBoundingClientRect();

        let diffX = (elPos.left + elPos.right) / 2 - event.clientX;
        let diffY = (elPos.top + elPos.bottom) / 2 - event.clientY;

        // Clamp the diff
        const radius = elPos.width / 2;
        const theta = Math.atan2(diffY, diffX);

        let full = false;
        if (diffX ** 2 + diffY ** 2 > radius ** 2) {
            diffX = Math.cos(theta) * radius;
            diffY = Math.sin(theta) * radius;
            full = true;
        }

        thumb.style.transform = `translate(${-diffX}px,${-diffY}px)`;
        container.dataset.x = diffX / radius + "";
        container.dataset.y = diffY / radius + "";
        container.dataset.angle = theta + Math.PI + "";

        container.dispatchEvent(
            new CustomEvent("inputchange", {
                detail: {
                    x: -diffX / radius,
                    y: -diffY / radius,
                    angle: theta + Math.PI,
                    full,
                },
            }) satisfies JoystickInputChangeEvent
        );
        // container.dispatchEvent()
    }
};
