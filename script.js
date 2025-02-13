document.addEventListener("DOMContentLoaded", () => {
  class Game {
    constructor() {
      this.score = 0;
      this.scoreElement = document.getElementById("score");
      this.updateScore();
    }

    addPoints(points) {
      this.score += Math.floor(points); // Afronden naar beneden naar het dichtstbijzijnde gehele getal
      console.log(`Points added: ${points}, New score: ${this.score}`);
      this.updateScore();
    }

    updateScore() {
      this.scoreElement.textContent = `Score: ${this.score}`;
    }

    canAfford(cost) {
      return this.score >= cost;
    }

    spendPoints(cost) {
      if (this.canAfford(cost)) {
        this.score -= cost;
        this.updateScore();
        return true;
      }
      return false;
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

  class AutoClicker {
    constructor(game, cps, cost) {
      this.game = game;
      this.cps = cps;
      this.cost = cost;
      this.isActive = false;
    }

    purchase() {
      if (this.game.spendPoints(this.cost)) {
        this.start();
        this.cost = Math.ceil(this.cost * 1.15); // Verhoog de kosten met 15%
        console.log(`Nieuwe kosten voor AutoClicker: ${this.cost}`);
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }

    start() {
      if (!this.isActive) {
        this.isActive = true;
        const cookiesPerSecond = () => {
          const deltaTime = 1000 / 60;
          this.game.addPoints((this.cps * deltaTime) / 1000);
          if (this.isActive) {
            requestAnimationFrame(cookiesPerSecond);
          }
        };
        requestAnimationFrame(cookiesPerSecond);
      }
    }

    stop() {
      this.isActive = false;
    }
  }

  // Game initialiseren
  const game = new Game();
  new ImageClicker("cookie", 1, game);

  // AutoClicker initialiseren en beheren
  const autoClicker = new AutoClicker(game, 0.1, 15);
  document
    .getElementById("buyAutoClicker")
    .addEventListener("click", () => autoClicker.purchase());
  document
    .getElementById("stopAutoClicker")
    .addEventListener("click", () => autoClicker.stop());
});
