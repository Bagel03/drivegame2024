import { FailButton, PrimaryButton, SuccessButton } from "./button";

export interface DialogPopupProps {
    hideCancelButton?: boolean;
    title: string;
    message?: string;
    oncancel?: (e: MouseEvent) => Promise<void | typeof KEEP_OPEN>;
    onok?: (e: MouseEvent) => Promise<void | typeof KEEP_OPEN>;
}

function closeOpenModal() {
    document.querySelector<HTMLDialogElement>("dialog[open]")!.close();
}

export const KEEP_OPEN = "KEEP_OPEN" as const;

export const DialogPopup: JSX.FC<DialogPopupProps> = function (props) {
    return (
        <dialog className="bg-base w-7/12 min-h-[1/2] overflow-hidden rounded backdrop:bg-secondary/80 open:flex flex-col justify-betweens">
            <div className="w-auto h-16  p-4 ">
                <h1 className="text-white text-center text-xl">{props.title}</h1>
            </div>
            <p className="text-white m-4 mt-0 mb-1"> {props.message || ""}</p>
            {props.children}
            <div className="bottom-0 h-16 mt-auto items-center flex">
                <FailButton
                    className="ml-auto"
                    onclick={function (e) {
                        closeOpenModal();
                        props.oncancel?.(e);
                    }}
                    hidden={!!props.hideCancelButton}
                >
                    Exit
                </FailButton>
                <SuccessButton
                    className="float-right mr-4 default-close-button"
                    onclick={async function (e) {
                        if ((await props.onok?.(e)) !== KEEP_OPEN) closeOpenModal();
                    }}
                >
                    Ok
                </SuccessButton>
            </div>
        </dialog>
    );
};

export function showDialog(options: DialogPopupProps | Node) {
    const el = (
        options instanceof Node ? options : <DialogPopup {...options}></DialogPopup>
    ) as HTMLDialogElement;
    document.body.appendChild(el);

    el.showModal();
    el.querySelector<HTMLButtonElement>(".default-close-button")!.focus();
}
