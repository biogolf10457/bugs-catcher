import "./style.css";
import Phaser, { Physics } from "phaser";
import MyGame from "./myGame";

//Phaser Game Config
const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  canvas: gameCanvas, //id from html
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [MyGame],
};

const game = new Phaser.Game(config);
