import Phaser from "phaser";

export default class SummaryScore extends Phaser.Scene {
  constructor() {
    super("SummaryScore");
    this.spider;
    //text
    this.summaryText;
    this.score;
    this.s = "";
    //button
    this.playAgainButton;
  }

  preload() {
    this.load.image("bg", "./assets/bg.png");
    this.load.spritesheet("spider", "./assets/spiderSprite.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    //add picture
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.spider = this.physics.add.sprite(400, 250, "spider").setScale(4);

    //add score summary
    this.score = localStorage.getItem("score");
    if (this.score > 1) {
      this.s = "s";
    }
    this.summaryText = this.add.text(
      160,
      380,
      `You caught  ${this.score}  bug${this.s}`,
      {
        font: "48px Verdana",
        color: "#faeea0",
        stroke: "#7a2c0f",
        strokeThickness: 20,
        align: "center",
      }
    );

    //add button
    this.playAgainButton = this.add.text(280, 500, "Play Again", {
      font: "32px Verdana",
      color: "#faeea0",
      stroke: "#7a2c0f",
      backgroundColor: "#32a852",
      strokeThickness: 10,
      padding: { x: 30, y: 10 },
      align: "center",
    });
    //add click
    this.playAgainButton.setInteractive();
    this.playAgainButton.on("pointerdown", () => {
      this.scene.start("MyGame");
    });
  }

  update() {}
}
