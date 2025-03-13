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
      this.countElement = document.getElementById(`count-${buttonId}`);
      this.updateButtonText();
    }

    purchase() {
      if (this.game.spendPoints(this.cost)) {
        this.totalCps += this.cps;
        this.start();
        this.cost = Math.ceil(this.cost * 1.25);
        this.updateButtonText();
        console.log(`Nieuwe kosten: ${this.cost}`);
        const currentCount =
          parseInt(this.countElement.textContent.split(": ")[1], 10) || 0;
        this.countElement.textContent = `Oma: ${currentCount + 1}`;
        this.countElement.style.display = "inline";
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
      this.button.innerHTML = `koop oma (koekjes: ${this.cost})<span id="count-buyAutoClicker">${this.countElement.textContent}</span>`;
    }

    upgrade(increase, cost, button, originalText, countElement) {
      if (this.game.spendPoints(cost)) {
        this.totalCps += increase;
        console.log(`Upgrade gekocht: +${increase} cps voor ${cost} koekjes.`);
        const newCost = Math.ceil(cost * 1.2);
        button.innerHTML = `${originalText} (${newCost} koekjes)<span id="${countElement.id}">${countElement.textContent}</span>`;
        button.dataset.cost = newCost;
        const currentCount =
          parseInt(countElement.textContent.split(": ")[1], 10) || 0;
        countElement.textContent = `${originalText.split(" ")[1]}: ${
          currentCount + 1
        }`;
        countElement.style.display = "inline";
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }
  }

  class Upgrade {
    constructor(
      game,
      autoClicker,
      increase,
      cost,
      buttonId,
      countElementId,
      text
    ) {
      this.game = game;
      this.autoClicker = autoClicker;
      this.increase = increase;
      this.cost = cost;
      this.button = document.getElementById(buttonId);
      this.countElement = document.getElementById(countElementId);
      this.text = text;
      this.init();
    }

    init() {
      if (this.button && this.countElement) {
        this.button.dataset.cost = this.cost;
        this.button.addEventListener("click", () => this.applyUpgrade());
      }
    }

    applyUpgrade() {
      const currentCost = parseInt(this.button.dataset.cost, 10);
      if (this.game.spendPoints(currentCost)) {
        this.autoClicker.upgrade(
          this.increase,
          currentCost,
          this.button,
          this.text,
          this.countElement
        );
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }
  }

  class EfficiencyUpgrade {
    constructor(game, autoClicker, cost, buttonId, countElementId) {
      this.game = game;
      this.autoClicker = autoClicker;
      this.cost = cost;
      this.button = document.getElementById(buttonId);
      this.countElement = document.getElementById(countElementId);
      this.init();
    }

    init() {
      if (this.button && this.countElement) {
        this.button.dataset.cost = this.cost;
        this.button.addEventListener("click", () => this.applyUpgrade());
      }
    }

    applyUpgrade() {
      const currentCost = parseInt(this.button.dataset.cost, 10);
      if (this.game.spendPoints(currentCost)) {
        this.autoClicker.cps *= 2;
        this.autoClicker.totalCps =
          this.autoClicker.cps *
          parseInt(this.countElement.textContent.split(": ")[1], 10);
        console.log(
          `Efficiency upgrade toegepast! Nieuwe CPS: ${this.autoClicker.cps}`
        );
        const newCost = Math.ceil(currentCost * 1.2);
        this.button.innerHTML = `${this.originalText} (${newCost} koekjes)<span id="${this.countElement.id}">${this.countElement.textContent}</span>`;
        this.button.dataset.cost = newCost;
        const currentCount =
          parseInt(this.countElement.textContent.split(": ")[1], 10) || 0;
        this.countElement.textContent = `Aantal upgrades: ${currentCount + 1}`;
        this.countElement.textContent = `${this.originalText.split(" ")[1]}: ${
            currentCount + 1
        }`;
        this.countElement.style.display = "inline";
      } else {
        alert("Niet genoeg koekjes voor deze upgrade!");
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

  new Upgrade(
    game,
    autoClicker,
    100,
    5000,
    "upgrade1",
    "count-upgrade1",
    "koop bakvormpjes"
  );
  new Upgrade(
    game,
    autoClicker,
    500,
    20000,
    "upgrade2",
    "count-upgrade2",
    "koop extra oven"
  );
  new Upgrade(
    game,
    autoClicker,
    1000,
    50000,
    "upgrade3",
    "count-upgrade3",
    "koop bakkerij"
  );
  new Upgrade(
    game,
    autoClicker,
    5000,
    100000,
    "upgrade4",
    "count-upgrade4",
    "koop personeel"
  );
  new Upgrade(
    game,
    autoClicker,
    10000,
    500000,
    "upgrade5",
    "count-upgrade5",
    "koop fabriek"
  );
  new Upgrade(
    game,
    autoClicker,
    50000,
    1000000,
    "upgrade6",
    "count-upgrade6",
    "koop gordon ramsay"
  );

  const upgradeAutoClickerButton =
    document.getElementById("upgradeAutoClicker");
  const countUpgradeAutoClicker = document.getElementById(
    "count-upgradeAutoClicker"
  );
  if (upgradeAutoClickerButton && countUpgradeAutoClicker) {
    upgradeAutoClickerButton.dataset.cost = 1000;
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

  new EfficiencyUpgrade(
    game,
    autoClicker,
    100000,
    "doubleOma",
    "count-doubleOma"
  );
  new EfficiencyUpgrade(
      game,
      autoClicker,
      100000,
      "doubleClick",
      "count-doubleClick"
  );
  const applyUpgrade = [
    {
      increase: 2*,
      cost: 10000,
      text: "verdubble oma's snelheid",
      countid: "count-doubleOma",
    }

  ];
});
