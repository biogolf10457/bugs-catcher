import "./style.css";
import Phaser, { Physics } from "phaser";
import MyGame from "./myGame";
import MainMenu from "./mainMenu";
import SummaryScore from "./summaryScore";

//Phaser Game Config
const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  canvas: gameCanvas, //id from html
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [MainMenu, MyGame, SummaryScore],
};

const game = new Phaser.Game(config);
