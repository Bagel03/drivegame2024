import { Script } from "../engine/script";
import { BombPlayer } from "./scripts/players/bombs";
import { MrCarrierPlayer } from "./scripts/players/carrier";
import { LaserPlayer } from "./scripts/players/laser";
import { ShotgunPlayer } from "./scripts/players/shotgun";

export interface PlayerDescriptor {
    name: string;
    displayName: string;
    available: boolean;
    menuPic: string;
    spriteName: string;
    playerScript: Script;
    description: string;
}

export const Players = {
    // carrier: {
    //     name: "carrier",
    //     displayName: "Mr. Carrier",
    //     available: true,
    //     menuPic: "https://www.freeiconspng.com/download/49305",
    //     spriteName: "carrier",
    //     playerScript: MrCarrierPlayer,
    //     description:
    //         "Mr. Carrier runs around trying to sell drive tickets to all the freshman who were mad their mom didn't turn in their drive shirt forms. His primary allows him to throw 1 ticket at a time, but after finally becoming buzz lightyear with his ult, he can fly around the stadium shoot twice as fast",
    // },
    // handcock: {
    //     name: "handcock",
    //     displayName: "Mr. Handcock",
    //     available: false,
    //     menuPic:
    //         "https://freepngimg.com/save/21721-luigi-transparent-image/772x1024",
    //     spriteName: "handcock",
    //     playerScript: LaserPlayer,
    //     description:
    //         "While normally his laser eyes are used to make kids question all of their life choices when he glaces at them, he can also use them to shoot drive tickets faster than he can give out detentions. When he ults, he becomes even more powerful, and his lasers no longer stop for disobedient objects (including walls)",
    // },
    gismondi: {
        name: "gismondi",
        displayName: "Mr. Gismondi",
        available: false,
        menuPic: window.DIST_URL + "/assets/Gismo.png", //http://localhost:5500/src/assets/Gismo.png",
        spriteName: "Gismo",
        playerScript: LaserPlayer,
        description:
            "Mr. Gismondi, while he isn't writing impossible essay prompts, sells more tickets a second than the senior class will all week",
    },
    carrier: {
        name: "carrier",
        displayName: "Mr. Carrier",
        available: true,
        menuPic: window.DIST_URL + "/assets/Carrier.png", //http://localhost:5500/src/assets/carrier.png",
        spriteName: "Carrier",
        playerScript: MrCarrierPlayer,
        description:
            "Mr. Carrier runs around trying to sell drive tickets to all the freshman who were mad their mom didn't turn in their drive shirt forms",
    },
    // whitehead: {
    //     name: "whitehead",
    //     displayName: "Mr. Whitehead",
    //     available: true,
    //     menuPic: window.DIST_URL + "/assets/Whitehead.png", //http://localhost:5500/src/assets/Whitehead.png",
    //     spriteName: "Whitehead",
    //     playerScript: ShotgunPlayer,
    //     description:
    //         "Even if hes hiding in a spiderman suit, Mr. Whitehead is still better at selling tickets than you, and its not close",
    // },
} satisfies Record<string, PlayerDescriptor>;
