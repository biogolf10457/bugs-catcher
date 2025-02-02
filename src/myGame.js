import Phaser from "phaser";

export default class MyGame extends Phaser.Scene {
  constructor() {
    super("MyGame");
    //player
    this.player;
    this.playerIsStay = true;
    this.playerIsCatching = false;
    this.playerSpeedX = 400;
    this.playerSpeedY = 900;
    this.spiderWebLine;
    //target
    this.bugs;
    this.spawnerTimedEvent;
    //particle emitter
    this.emitter;
    //controller
    this.keyA;
    this.keyD;
    this.keySpace;
    //game info
    this.score = 0;
    this.textScore;
    this.timedEvent;
    this.timeCountDown = 30000;
    this.timeRemaining;
    this.textTime;
    this.isGameOver = false;
    this.textTimesUp;
  }

  preload() {
    this.load.image("bg", "./assets/bg.png");
    this.load.image("bug", "./assets/bug.png");
    this.load.image("bugFlip", "./assets/bugFlip.png");
    this.load.image("heart", "./assets/heart.png");
    this.load.spritesheet("spider", "./assets/spiderSprite.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    //initial position of background and player
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add.sprite(400, 64, "spider");
    this.spiderWebLine = this.add
      .line(400, 36, 0, 0, 0, 0, 0xf2f2f2)
      .setOrigin(0, 0)
      .setLineWidth(2);

    //set player constraint
    this.player.setCollideWorldBounds(true);
    this.player
      .setSize((this.player.width * 3) / 4, this.player.height / 3)
      .setOffset(this.player.width / 8, (this.player.height * 2) / 3);

    //check key animation, if already exist then remove old animation for the game restarting
    if (this.anims.exists("moving")) {
      this.anims.remove("moving");
    }
    if (this.anims.exists("catching")) {
      this.anims.remove("catching");
    }
    if (this.anims.exists("stay")) {
      this.anims.remove("stay");
    }
    //set player animation
    this.anims.create({
      key: "moving",
      frames: this.anims.generateFrameNumbers("spider", { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: "catching",
      frames: [{ key: "spider", frame: 1 }],
      frameRate: 1,
    });
    this.anims.create({
      key: "stay",
      frames: [{ key: "spider", frame: 0 }],
      frameRate: 1,
    });

    //set enemy bugs
    this.bugs = this.physics.add.group();
    this.spawnBug();
    this.spawnerTimedEvent = this.time.addEvent({
      delay: 1500,
      callback: this.spawnBug,
      callbackScope: this,
      loop: true,
    });

    //set overlap and add particle effect when the spider catch a bug
    this.physics.add.overlap(this.player, this.bugs, this.catchBug, null, this);
    this.emitter = this.add.particles(0, 0, "heart", {
      speed: 100,
      gravityY: 100,
      scale: 0.15,
      duration: 50,
      stopAfter: 8,
      emitting: false,
    });
    this.emitter.startFollow(this.player, 0, this.player.height, true);

    //set game text
    this.textScore = this.add.text(610, 530, "Score : 0", {
      font: "32px Verdana",
      color: "#faeea0",
      stroke: "#7a2c0f",
      strokeThickness: 10,
      align: "right",
    });
    this.textTime = this.add.text(20, 530, "Time : 30", {
      font: "32px Verdana",
      color: "#faeea0",
      stroke: "#7a2c0f",
      strokeThickness: 10,
      align: "left",
    });

    //set timer count down to game over
    this.timedEvent = this.time.delayedCall(
      this.timeCountDown,
      this.gameOver,
      [],
      this
    );

    //initial input controller
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update() {
    //check is game over
    if (this.isGameOver) {
      return;
    }

    //update timer count down
    this.timeRemaining = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Time : ${Math.ceil(this.timeRemaining).toString()}`);

    //player controller
    if (this.playerIsStay) {
      if (this.keyA.isDown) {
        this.player.anims.play("moving", true);
        this.player.setVelocityX(-this.playerSpeedX);
      } else if (this.keyD.isDown) {
        this.player.anims.play("moving", true);
        this.player.setVelocityX(this.playerSpeedX);
      } else if (this.keySpace.isDown) {
        this.diveCatch();
      } else {
        this.player.anims.play("stay", true);
        this.player.setVelocityX(0);
      }
    }

    //check player state
    if (this.player.y >= 600 - this.player.height / 2) {
      //bounce back if player going down to the bottom of the game window
      this.bounceBack();
    }
    if (
      this.player.y <= 64 &&
      this.playerIsStay == false &&
      this.playerIsCatching == false
    ) {
      //go to state stay if player going back to the top area
      this.stay();
    }

    //draw spider web follow the spider position
    this.spiderWebLine.setX(this.player.x);
    this.spiderWebLine.setTo(0, 0, 0, this.player.y - 64);

    //destroy bug if going far outside the map
    this.bugs.children.iterate((bug) => {
      if (bug && (bug.x <= -200 || bug.x >= 1000)) {
        bug.destroy();
      }
    });
  }

  diveCatch() {
    //spider diving down
    this.player.anims.play("catching", true);
    this.playerIsStay = false;
    this.playerIsCatching = true;
    this.player.setVelocityX(0);
    this.player.setVelocityY(this.playerSpeedY);
    this.spiderWebLine.setAlpha(1);
  }

  bounceBack() {
    //spider going back to top
    this.player.anims.play("stay", true);
    this.playerIsStay = false;
    this.playerIsCatching = false;
    this.player.setVelocityX(0);
    this.player.setVelocityY((-this.playerSpeedY * 2) / 3);
    this.spiderWebLine.setAlpha(1);
  }

  stay() {
    //spider stay at the top
    this.player.anims.play("stay", true);
    this.playerIsStay = true;
    this.playerIsCatching = false;
    this.player.setVelocityY(0);
    this.spiderWebLine.setAlpha(0);
  }

  spawnBug() {
    //spawn bug from outside the map
    var side = Phaser.Math.Between(0, 11);
    var bugSpeed = Phaser.Math.Between(100, 200);
    if (side % 2 == 0) {
      //spawn from right side
      var bug = this.bugs.create(900, Phaser.Math.Between(200, 550), "bug");
      bug.setVelocityX(-bugSpeed);
    } else {
      //spawn from left side
      var bug = this.bugs.create(
        -100,
        Phaser.Math.Between(200, 550),
        "bugFlip"
      );
      bug.setVelocityX(bugSpeed);
    }
  }

  catchBug(player, bug) {
    if (this.playerIsCatching) {
      bug.destroy();
      this.emitter.start();
      this.bounceBack();
      this.score += 1;
      this.textScore.setText(`Score : ${this.score.toString()}`);
    }
  }

  gameOver() {
    //update timer count down last time before stop game process
    this.timeRemaining = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Time : ${Math.ceil(this.timeRemaining).toString()}`);
    //stop player movement and bugs movement
    if (this.player.anims.currentAnim) {
      this.player.anims.currentAnim.pause();
    }
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    this.spawnerTimedEvent.destroy();
    this.timedEvent.destroy();
    this.bugs.children.iterate((bug) => {
      bug.setVelocityX(0);
    });
    //update state
    this.isGameOver = true;
    //show text time's up
    this.textTimesUp = this.add.text(220, 280, "Time's Up !", {
      font: "64px Verdana",
      color: "#faeea0",
      stroke: "#7a2c0f",
      strokeThickness: 20,
      align: "center",
    });
    //save local storage score
    localStorage.setItem("score", this.score);
    //wait 3 seconds and go to summary scene
    this.time.delayedCall(
      3000,
      () => {
        this.playerIsStay = true;
        this.playerIsCatching = false;
        this.isGameOver = false;
        this.score = 0;
        this.scene.start("SummaryScore");
      },
      [],
      this
    );
  }
}
