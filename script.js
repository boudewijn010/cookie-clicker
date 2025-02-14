document.addEventListener("DOMContentLoaded", () => {
  class Game {
    constructor() {
      this.score = 0;
      this.scoreElement = document.getElementById("score");
      this.updateScore();
    }

    addPoints(points) {
      this.score += points;
      this.updateScore();
    }

    updateScore() {
      this.scoreElement.textContent = `Score: ${Math.floor(this.score)}`;
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
    constructor(game, cps, cost, buttonId) {
      this.game = game;
      this.cps = cps;
      this.totalCps = 0;
      this.cost = cost;
      this.isActive = false;
      this.button = document.getElementById(buttonId);
      this.updateButtonText();
    }

    purchase() {
      if (this.game.spendPoints(this.cost)) {
        this.totalCps += this.cps;
        this.start();
        this.cost = Math.ceil(this.cost * 1.25);
        this.updateButtonText();
        console.log(`Nieuwe kosten: ${this.cost}`);
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }

    start() {
      if (!this.isActive) {
        this.isActive = true;
        const cookiesPerSecond = () => {
          const pointsToAdd = this.totalCps;
          console.log(`Adding points: ${pointsToAdd}`);
          this.game.addPoints(pointsToAdd);
          if (this.isActive) {
            setTimeout(cookiesPerSecond, 1000);
          }
        };
        console.log("Starting AutoClicker");
        cookiesPerSecond();
      }
    }

    stop() {
      this.isActive = false;
    }

    updateButtonText() {
      this.button.textContent = `oma (kost: ${this.cost})`;
    }
  }

  const game = new Game();
  new ImageClicker("cookie", 1, game);

  const autoClicker = new AutoClicker(game, 1, 15, "buyAutoClicker");
  const buyAutoClickerButton = document.getElementById("buyAutoClicker");
  const stopAutoClickerButton = document.getElementById("stopAutoClicker");

  if (buyAutoClickerButton) {
    buyAutoClickerButton.addEventListener("click", () =>
      autoClicker.purchase()
    );
  }

  if (stopAutoClickerButton) {
    stopAutoClickerButton.addEventListener("click", () => autoClicker.stop());
  }
});
