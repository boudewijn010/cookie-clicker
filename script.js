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

    spendPoints(koekjes) {
      if (this.canAfford(koekjes)) {
        this.score -= koekjes;
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

    purchase(countElement) {
      if (this.game.spendPoints(this.cost)) {
        this.totalCps += this.cps;
        this.start();
        this.cost = Math.ceil(this.cost * 1.25);
        this.updateButtonText();
        console.log(`Nieuwe kosten: ${this.cost}`);
        const currentCount = parseInt(
          countElement.textContent.split(": ")[1],
          10
        );
        countElement.textContent = `Oma: ${currentCount + 1}`;
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
      this.button.textContent = `koop oma (koekjes: ${this.cost})`;
    }

    upgrade(increase, cost, button, originalText, countElement) {
      if (this.game.spendPoints(cost)) {
        this.totalCps += increase;
        console.log(`Upgrade gekocht: +${increase} cps voor ${cost} koekjes.`);
        const newCost = Math.ceil(cost * 1.2);
        button.textContent = `${originalText} (${newCost} koekjes)`;
        button.dataset.cost = newCost;
        const currentCount = parseInt(
          countElement.textContent.split(": ")[1],
          10
        );
        countElement.textContent = `${originalText.split(" ")[1]}: ${
          currentCount + 1
        }`;
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }
    doubleEfficiency(cost, button, countElement) {
      if (this.game.spendPoints(cost)) {
        this.cps *= 2; // Verdubbel de CPS van Oma
        this.totalCps *= 2; // Pas ook de actieve auto-clickers aan
        console.log(`Oma's efficiency is verdubbeld! Nieuwe CPS: ${this.cps}`);
        const newCost = Math.ceil(cost * 2);
        button.textContent = `Verdubbel Oma's snelheid (${newCost} koekjes)`;
        button.dataset.cost = newCost;
        const currentCount = parseInt(countElement.textContent.split(": ")[1], 10);
        countElement.textContent = `Aantal upgrades: ${currentCount + 1}`;
      } else {
        alert("Niet genoeg koekjes voor deze upgrade!");
      }
    }
  }

  const game = new Game();
  new ImageClicker("cookie", 1, game);

  const autoClicker = new AutoClicker(game, 0.3, 15, "buyAutoClicker");
  const countBuyAutoClicker = document.getElementById("count-buyAutoClicker");
  document
    .getElementById("buyAutoClicker")
    ?.addEventListener("click", () =>
      autoClicker.purchase(countBuyAutoClicker)
    );
  document
    .getElementById("stopAutoClicker")
    ?.addEventListener("click", () => autoClicker.stop());

  const upgrades = [
    {
      increase: 100,
      cost: 5000,
      text: "koop bakvormpjes",
      countId: "count-upgrade1",
    },
    {
      increase: 500,
      cost: 20000,
      text: "koop extra oven",
      countId: "count-upgrade2",
    },
    {
      increase: 1000,
      cost: 50000,
      text: "koop bakkerij",
      countId: "count-upgrade3",
    },
    {
      increase: 5000,
      cost: 100000,
      text: "koop personeel",
      countId: "count-upgrade4",
    },
    {
      increase: 10000,
      cost: 500000,
      text: "koop fabriek",
      countId: "count-upgrade5",
    },
    {
      increase: 50000,
      cost: 1000000,
      text: "koop gordon ramsay",
      countId: "count-upgrade6",
    },
  ];

  upgrades.forEach((upgrade, index) => {
    const button = document.getElementById(`upgrade${index + 1}`);
    const countElement = document.getElementById(upgrade.countId);
    if (button && countElement) {
      button.dataset.cost = upgrade.cost; // Initialize the cost in a data attribute
      button.addEventListener("click", () => {
        const currentCost = parseInt(button.dataset.cost, 10);
        autoClicker.upgrade(
          upgrade.increase,
          currentCost,
          button,
          upgrade.text,
          countElement
        );
      });
    }
  });

  const upgradeAutoClickerButton =
    document.getElementById("upgradeAutoClicker");
  const countUpgradeAutoClicker = document.getElementById(
    "count-upgradeAutoClicker"
  );
  if (upgradeAutoClickerButton && countUpgradeAutoClicker) {
    upgradeAutoClickerButton.dataset.cost = 1000; // Initialize the cost in a data attribute
    upgradeAutoClickerButton.addEventListener("click", () => {
      const currentCost = parseInt(upgradeAutoClickerButton.dataset.cost, 10);
      autoClicker.upgrade(
        100,
        currentCost,
        upgradeAutoClickerButton,
        "koop beter deeg",
        countUpgradeAutoClicker
      );
    });
  }
  const doubleOmaButton = document.getElementById("doubleOma");
  const countDoubleOma = document.getElementById("count-doubleOma");

  if (doubleOmaButton && countDoubleOma) {
    doubleOmaButton.dataset.cost = 100000; // Startprijs
    doubleOmaButton.addEventListener("click", () => {
      const currentCost = parseInt(doubleOmaButton.dataset.cost, 10);
      autoClicker.doubleEfficiency(currentCost, doubleOmaButton, countDoubleOma);
    });
  }

  const doubleClickButton = document.getElementById("doubleClick");
  const countDoubleClick = document.getElementById("count-doubleClick");

  if (doubleClickButton && countDoubleClick) {
    doubleClickButton.dataset.cost = 5000; // Startprijs
    doubleClickButton.addEventListener("click", () => {
      const currentCost = parseInt(doubleClickButton.dataset.cost, 10);
      autoClicker.doubleEfficiency(currentCost, doubleOmaButton, countDoubleOma);
    });
  }

});
