document.addEventListener("DOMContentLoaded", () => {
  class Game {
    constructor() {
      this.score = 10000000000; // later aanpassen naar 0
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
      this.button.textContent = `Koop upgrade (kost: ${this.cost})`;
    }

    upgrade(increase, cost, button) {
      if (this.game.spendPoints(cost)) {
        this.totalCps += increase;
        console.log(`Upgrade gekocht: +${increase} cps voor ${cost} koekjes.`);
        const newCost = Math.ceil(cost * 1.2); // Increase cost by 20%
        button.textContent = `Koop upgrade (kost: ${newCost})`;
        button.dataset.cost = newCost; // Store the new cost in a data attribute
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }
  }

  const game = new Game();
  new ImageClicker("cookie", 1, game);

  const autoClicker = new AutoClicker(game, 0.3, 15, "buyAutoClicker");
  document
    .getElementById("buyAutoClicker")
    ?.addEventListener("click", () => autoClicker.purchase());
  document
    .getElementById("stopAutoClicker")
    ?.addEventListener("click", () => autoClicker.stop());

  const upgrades = [
    { increase: 100, cost: 5000 },
    { increase: 500, cost: 20000 },
    { increase: 1000, cost: 50000 },
    { increase: 5000, cost: 100000 },
    { increase: 10000, cost: 500000 },
    { increase: 50000, cost: 1000000 },
    { increase: 100000, cost: 5000000 },
    { increase: 500000, cost: 10000000 },
  ];

  upgrades.forEach((upgrade, index) => {
    const button = document.getElementById(`upgrade${index + 1}`);
    if (button) {
      button.dataset.cost = upgrade.cost; // Initialize the cost in a data attribute
      button.addEventListener("click", () => {
        const currentCost = parseInt(button.dataset.cost, 10);
        autoClicker.upgrade(upgrade.increase, currentCost, button);
      });
    }
  });

  const upgradeAutoClickerButton =
    document.getElementById("upgradeAutoClicker");
  if (upgradeAutoClickerButton) {
    upgradeAutoClickerButton.dataset.cost = 1000; // Initialize the cost in a data attribute
    upgradeAutoClickerButton.addEventListener("click", () => {
      const currentCost = parseInt(upgradeAutoClickerButton.dataset.cost, 10);
      autoClicker.upgrade(100, currentCost, upgradeAutoClickerButton);
    });
  }
});
