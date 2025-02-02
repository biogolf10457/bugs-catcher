import Phaser from "phaser";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenu" });
    this.title;
    this.startButton;
    this.descriptionPressA;
    this.descriptionPressD;
    this.descriptionPressSpace;
  }

  preload() {
    this.load.image("bg", "./assets/bg.png");
    this.load.image("bug", "./assets/bug.png");
    this.load.spritesheet("spider", "./assets/spiderSprite.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    //add picture
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.physics.add.sprite(200, 300, "spider").setScale(4);
    this.add.image(200, 450, "bug").setScale(1.5);

    //add text menu
    this.title = this.add.text(350, 150, "Bug Catcher", {
      font: "64px Verdana",
      color: "#faeea0",
      stroke: "#7a2c0f",
      strokeThickness: 20,
      align: "center",
    });
    this.startButton = this.add.text(480, 290, "Start", {
      font: "32px Verdana",
      color: "#faeea0",
      stroke: "#7a2c0f",
      backgroundColor: "#32a852",
      strokeThickness: 10,
      padding: { x: 30, y: 10 },
      align: "center",
    });
    this.descriptionPressA = this.add.text(400, 400, "Press 'A' to move left", {
      font: "24px Verdana",
      color: "#faeea0",
      stroke: "#7a2c0f",
      strokeThickness: 6,
      align: "left",
    });
    this.descriptionPressD = this.add.text(
      400,
      450,
      "Press 'D' to move right",
      {
        font: "24px Verdana",
        color: "#faeea0",
        stroke: "#7a2c0f",
        strokeThickness: 6,
        align: "left",
      }
    );
    this.descriptionPressSpace = this.add.text(
      400,
      500,
      "Press 'SPACE' to dive down",
      {
        font: "24px Verdana",
        color: "#faeea0",
        stroke: "#7a2c0f",
        strokeThickness: 6,
        align: "left",
      }
    );

    //add click
    this.startButton.setInteractive();
    this.startButton.on("pointerdown", () => this.scene.start("MyGame"));
  }

  update() {}
}
