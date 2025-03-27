document.addEventListener("DOMContentLoaded", () => {
  class Game {
    constructor() {
      this.score = 1000000;
      this.extraClickPower = 0;
      this.scoreElement = document.getElementById("score");
      this.autoClickers = {};
      this.updateScore();
    }

    addPoints(points) {
      this.score += points + this.extraClickPower;
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

    registerAutoClicker(name, autoClicker) {
      this.autoClickers[name] = autoClicker;
    }
  }

  class Clicker {
    constructor(elementId, game, pointsPerClick) {
      this.element = document.getElementById(elementId);
      this.game = game;
      this.pointsPerClick = pointsPerClick;
      this.element.addEventListener("click", () => this.handleClick());
    }

    handleClick() {
      this.game.addPoints(this.pointsPerClick);
    }
  }

  class AutoClicker {
    constructor(game, name, cps, cost, buttonId) {
      this.game = game;
      this.name = name;
      this.cps = cps;
      this.cost = cost;
      this.count = 0;
      this.interval = null;
      this.button = document.getElementById(buttonId);
      this.countElement = document.getElementById(`count-${buttonId}`);
      this.setupButton();
      game.registerAutoClicker(name, this);
    }

    setupButton() {
      if (this.button) {
        this.button.addEventListener("click", () => this.purchase());
        this.updateButtonText();
      }
    }

    purchase() {
      if (this.game.spendPoints(this.cost)) {
        this.count++;
        this.cost = Math.ceil(this.cost * 1.25);
        this.updateButtonText();
        this.start();
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }

    start() {
      if (!this.interval) {
        console.log(`${this.name} AutoClicker gestart!`);
        this.interval = setInterval(() => {
          if (this.count > 0) {
            console.log(
              `${this.name} genereert ${
                this.count * this.cps
              } koekjes per seconde.`
            );
            this.game.addPoints(this.count * this.cps);
          }
        }, 1000);
      }
    }

    updateButtonText() {
      this.button.innerHTML = `Koop ${this.name} (koekjes: ${this.cost}) <span>${this.count}</span>`;
    }
  }

  class Upgrade {
    constructor(game, target, increase, cost, buttonId, description) {
      this.game = game;
      this.target = target;
      this.increase = increase;
      this.cost = cost;
      this.button = document.getElementById(buttonId);
      this.description = description;
      this.count = 0;
      this.setupButton();
    }

    setupButton() {
      if (this.button) {
        this.button.addEventListener("click", () => this.applyUpgrade());
        this.updateButtonText();
      }
    }

    applyUpgrade() {
      if (this.game.spendPoints(this.cost)) {
        this.count++;
        this.cost = Math.ceil(this.cost * 1.2);
        this.target.cps += this.increase;
        this.updateButtonText();
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }

    updateButtonText() {
      this.button.innerHTML = `${this.description} (${this.cost} koekjes) <span>${this.count}</span>`;
    }
  }

  class EfficiencyUpgrade {
    constructor(game, autoClickerName, cost, buttonId, description) {
      this.game = game;
      this.autoClickerName = autoClickerName;
      this.cost = cost;
      this.button = document.getElementById(buttonId);
      this.description = description;
      this.count = 0;
      this.setupButton();
    }

    setupButton() {
      if (this.button) {
        this.button.addEventListener("click", () => this.applyUpgrade());
        this.updateButtonText();
      }
    }

    applyUpgrade() {
      if (this.game.spendPoints(this.cost)) {
        this.count++;
        this.cost = Math.ceil(this.cost * 1.5);
        if (this.game.autoClickers[this.autoClickerName]) {
          this.game.autoClickers[this.autoClickerName].cps *= 2;
        }
        this.updateButtonText();
      } else {
        alert("Niet genoeg punten voor deze upgrade!");
      }
    }

    updateButtonText() {
      this.button.innerHTML = `${this.description} (${this.cost} koekjes) <span>${this.count}</span>`;
    }
  }

  const game = new Game();
  new Clicker("cookie", game, 1);

  new AutoClicker(game, "Oma", 2, 15, "buyAutoClicker");
  new AutoClicker(game, "Beterdeeg", 20, 250, "koopbeterdeeg");
  new AutoClicker(game, "Bakvormen", 50, 1000, "koopbakvormen");
  new AutoClicker(game, "oven", 100, 2000, "koopoven");
  new AutoClicker(game, "Bakkerij", 200, 5000, "koopbakkerij");
  new AutoClicker(game, "Personeel", 300, 10000, "kooppersoneel");
  new AutoClicker(game, "Fabriek", 500, 500000, "koopfabriek");
  new AutoClicker(game, "Gorden", 1000000, 1000000, "koopGorden");

  // new Upgrade(
  //   game,
  //   game.autoClickers["Oma"],
  //   100,
  //   1000,
  //   "upgradeAutoClicker",
  //   "verdubble Oma's snelheid"
  // );
  new EfficiencyUpgrade(
    game,
    "oma",
    5000,
    "doubleOma",
    "Verdubbel Oma's snelheid"
  );
  new EfficiencyUpgrade(
    game,
    "beterdeeg",
    10000,
    "doublebeterdeeg",
    "Verdubbel de productie van deeg"
  );
  new EfficiencyUpgrade(
    game,
    "bakvormen",
    25000,
    "doublebakvormen",
    "Verdubbel de capasiteit van de bakvormen"
  );
  new EfficiencyUpgrade(
      game,
      "oven",
      50000,
      "doebleoven",
      "Verdubbel de capasiteit van de oven"
  );
  new EfficiencyUpgrade(
      game,
      "doubleGorden",
      10000000,
      "doubleGorden",
      "maakt Gorden boos"
  );
});
