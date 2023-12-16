interface ButtonProps {
    className?: string;
    focus?: boolean;
}

export const StyledButton: JSX.FC<ButtonProps> = function (props) {
    return (
        <button
            {...props}
            className={
                `rounded h-9 min-w-[100px] border-none focus:brightness-90 hover:brightness-90 font-default uppercase text-center text-lg tracking-wider text-white m-2` +
                    " " +
                    props.className || ""
            }
        >
            {props.children}
        </button>
    );
};

const ColoredButtonFactory =
    (color: string) => (props: JSX.IntrinsicElements["button"]) =>
        (
            <StyledButton {...props} className={color + " " + props.className || ""}>
                {props.children}
            </StyledButton>
        );

// export function PrimaryButton(props: JSX.IntrinsicElements["button"]) {
//     return (
//         <StyledButton className="bg-primary" {...props}>
//             {props.children}
//         </StyledButton>
//     );
// }

// export function AccentButton(props: JSX.IntrinsicElements["button"]) {
//     return (
//         <StyledButton className="bg-accent" {...props}>
//             {props.children}
//         </StyledButton>
//     );
// }

export const PrimaryButton = ColoredButtonFactory("bg-primary");
export const AccentButton = ColoredButtonFactory("bg-accent");
export const SuccessButton = ColoredButtonFactory("bg-green-500");
export const FailButton = ColoredButtonFactory("bg-red-600");

// export function SuccessButton(props: JSX.IntrinsicElements["button"]) {
//     return (
//         <StyledButton className="bg-green-500" {...props}>
//             {props.children}
//         </StyledButton>
//     );
// }
// export function FailButton(props: JSX.IntrinsicElements["button"]) {
//     return (
//         <StyledButton className="bg-red-600" {...props}>
//             {props.children}
//         </StyledButton>
//     );
// }
