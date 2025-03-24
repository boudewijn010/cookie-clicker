document.addEventListener("DOMContentLoaded", () => {
  class Game {
    constructor() {
      this.score = 1000000000000;
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
      this.countElement = document.getElementById(`count-${buttonId}`);
      this.updateButtonText();
    }

    purchase() {
      if (this.game.spendPoints(this.cost)) {
        this.totalCps += this.cps;
        this.start();
        this.cost = Math.ceil(this.cost * 1.25);
        this.updateButtonText();
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
          this.game.addPoints(this.totalCps);
          if (this.isActive) {
            setTimeout(cookiesPerSecond, 1000);
          }
        };
        cookiesPerSecond();
      }
    }

    stop() {
      this.isActive = false;
    }

    updateButtonText() {
      this.button.innerHTML = `Koop Oma (Koekjes: ${this.cost})<span id="count-buyAutoClicker">${this.countElement.textContent}</span>`;
    }

    upgrade(increase, cost, button, originalText, countElement) {
      if (this.game.spendPoints(cost)) {
        this.totalCps += increase;
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

  const game = new Game();
  const imageClicker = new ImageClicker("cookie", 1, game);
  const autoClicker = new AutoClicker(game, 0.3, 15, "buyAutoClicker");

  document
      .getElementById("buyAutoClicker")
      ?.addEventListener("click", () => autoClicker.purchase());
  document
      .getElementById("stopAutoClicker")
      ?.addEventListener("click", () => autoClicker.stop());

  class Upgrade {
    constructor(game, autoClicker, increase, cost, buttonId, countElementId, text) {
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
        this.countElement.textContent = `${this.text.split(" ")[1]}: 0`;
        this.button.addEventListener("click", () => this.applyUpgrade());
      }
    }

    applyUpgrade() {
      const currentCost = parseInt(this.button.dataset.cost, 10);
      if (this.game.spendPoints(currentCost)) {
        const currentCount =
          parseInt(this.countElement.textContent.split(": ")[1], 10) || 0;

        const newCount = currentCount + 1;

        this.countElement.textContent = `${
          this.text.split(" ")[1]
        }: ${newCount}`;

        const newCost = Math.ceil(currentCost * 1.2);
        this.button.dataset.cost = newCost;

        this.autoClicker.upgrade(
            this.increase,
            currentCost,
            this.button,
            this.text,
            this.countElement
        );
      } else {
        alert("Niet genoeg koekjes voor deze upgrade!");
      }
    }
  }

  new Upgrade(game, autoClicker, 100, 5000, "upgrade1", "count-upgrade1", "Koop Bakvormpjes");
  new Upgrade(game, autoClicker, 500, 20000, "upgrade2", "count-upgrade2", "Koop Extra Oven");
  new Upgrade(game, autoClicker, 1000, 50000, "upgrade3", "count-upgrade3", "Koop Bakkerij");
  new Upgrade(game, autoClicker, 5000, 100000, "upgrade4", "count-upgrade4", "Koop Personeel");
  new Upgrade(game, autoClicker, 10000, 500000, "upgrade5", "count-upgrade5", "Koop Fabriek");
  new Upgrade(game, autoClicker, 50000, 1000000, "upgrade6", "count-upgrade6", "Koop Gordon Ramsay");

  class EfficiencyUpgrade {
    constructor(game, imageClicker, cost, buttonId, countElementId, text) {
      this.game = game;
      this.imageClicker = imageClicker;
      this.cost = cost;
      this.text = text;
      this.button = document.getElementById(buttonId);
      this.countElement = document.getElementById(countElementId);
      this.init();
    }

    init() {
      if (this.button && this.countElement) {
        this.button.dataset.cost = this.cost;
        this.countElement.textContent = `${this.text.split(" ")[1]}: 0`;
        this.button.addEventListener("click", () => this.applyUpgrade());
      }
    }

    applyUpgrade() {
      const currentCost = parseInt(this.button.dataset.cost, 10);
      if (this.game.spendPoints(currentCost)) {
        this.autoClicker.cps *= 2;

        const currentCount =
          parseInt(this.countElement.textContent.split(": ")[1], 10) || 0;
        this.autoClicker.totalCps = this.autoClicker.cps * (currentCount + 1);

        console.log(
          `Efficiency upgrade toegepast! Nieuwe CPS: ${this.autoClicker.cps}, Total CPS: ${this.autoClicker.totalCps}`
        );

        const newCost = Math.ceil(currentCost * 2);
        this.button.innerHTML = `${this.text} (${newCost} koekjes)<span id="${this.countElement.id}">${this.countElement.textContent}</span>`;
        this.button.dataset.cost = newCost;

        this.countElement.textContent = `${this.text.split(" ")[1]}: ${
          currentCount + 1
        }`;
        this.countElement.style.display = "inline";
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
    "koop Gordon Ramsay"
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
    50000,
    "doubleClick",
    "count-doubleClick",
    "Verdubbel Click Power"
  );
  new EfficiencyUpgrade(
    game,
    autoClicker,
    100000,
    "doubleOma",
    "count-doubleOma",
    "Verdubbel Oma's snelheid"
  );
  new EfficiencyUpgrade(
    game,
    autoClicker,
    250000,
    "doubleDeeg",
    "count-doubleDeeg",
    "verdubble de productie van deeg"
  );
  new EfficiencyUpgrade(
    game,
    autoClicker,
    500000,
    "doubleBakvormpjes",
    "count-doubleBakvormpjes",
    "verdubble de capasiteit van de bakvormpjes"
  );
  new EfficiencyUpgrade(
    game,
    AutoClicker,
    1000000,
    "doubleOven",
    "count-doubleOven",
    "verdubble de capasiteit van de ovens"
  );
  new EfficiencyUpgrade(
    game,
    AutoClicker,
    10000000,
    "doubleGordon",
    "count-doubleGordon",
    "verdubble Gordon zijn snelheid"
  );
});
