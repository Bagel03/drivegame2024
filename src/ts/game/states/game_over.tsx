import { ExtractPayload, State, StateClass } from "../../engine/state_managment";

export class GameOverState extends State<never> {
    public element = (
        <div className="absolute top-0 left-0 w-full h-full"></div>
    ) as HTMLDivElement;

    async onEnter() {
        document.body.appendChild(this.element);
    }

    private getHTML() {
        return <div className="w-full h-full bg-base bg-opacity-80 "></div>;
    }

    async onLeave() {
        this.element.remove();
        this.element.innerHTML = "";
    }
}
