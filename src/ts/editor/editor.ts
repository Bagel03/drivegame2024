import { World } from "bagelecs";
import { InspectPlugin } from "./inspect";

export const editorPlugins: ((world: World) => void)[] = [InspectPlugin];
