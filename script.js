document.addEventListener("DOMContentLoaded", () => {
  class Game {
    constructor() {
      this.score = 0;
      this.scoreElement = document.getElementById("score");
      this.updateScore();
    }

    addPoints(points) {
      this.score += points;
      console.log(`Points added: ${points}, New score: ${this.score}`);
      this.updateScore();
    }

    updateScore() {
      this.scoreElement.textContent = `Score: ${this.score}`;
    }
  }

  class ImageClicker {
    constructor(imageId, points, game) {
      this.imageElement = document.getElementById(imageId);
      this.points = points;
      this.game = game;
      this.imageElement.addEventListener("click", () => this.handleClick());
    }

    handleClick() {
      this.game.addPoints(this.points);
    }
  }

  const game = new Game();
  new ImageClicker("cookie", 1, game);
});
