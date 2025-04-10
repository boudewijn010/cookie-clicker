document.addEventListener("DOMContentLoaded", () => {

  function createFallingCookie() {
    const cookie = document.createElement('div');
    cookie.className = 'cookie';
    cookie.style.left = `${Math.random() * 100}vw`;
    cookie.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.getElementById('falling-cookies').appendChild(cookie);

    cookie.addEventListener('animationend', () => {
      cookie.remove();
    });
  }

  setInterval(createFallingCookie, 550);
  class Game {
    constructor() {
      this.score = 1000000000000;
      this.extraClickPower = 0;
      this.scoreElement = document.getElementById("score");
      this.autoClickers = {};
      this.updateScore();
      this.fallingCookieInterval = setInterval(createFallingCookie, 1000); // Initial interval

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
      this.increaseFallingCookies();
    }

    increaseFallingCookies() {
      const originalInterval = 1000;
      const increasedInterval = 100;
      const duration = 1000;

      clearInterval(this.game.fallingCookieInterval);
      this.game.fallingCookieInterval = setInterval(createFallingCookie, increasedInterval);

      setTimeout(() => {
        clearInterval(this.game.fallingCookieInterval);
        this.game.fallingCookieInterval = setInterval(createFallingCookie, originalInterval);
      }, duration);
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
  class DoubleClickUpgrade {
    constructor(game, cost, buttonId, description) {
      this.game = game;
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
        this.game.extraClickPower += 1;
        console.log(`Click power increased! Extra cookies per click: ${this.game.extraClickPower}`);
        this.updateButtonText();
      } else {
        alert("Not enough points for this upgrade!");
      }
    }

    updateButtonText() {
      this.button.innerHTML = `${this.description} (${this.cost} cookies) <span>Count: ${this.count}</span>`;
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
      this.button.innerHTML = `${this.description} (${this.cost} koekjes) <span>Aantal: ${this.count}</span>`;
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

  new EfficiencyUpgrade(game, "Oma", 5000, "doubleOma", "Verdubbel Oma's snelheid");
  new EfficiencyUpgrade(game, "Beterdeeg", 10000, "doublebeterdeeg", "Verdubbel de productie van deeg");
  new EfficiencyUpgrade(game, "Bakvormen", 25000, "doublebakvormen", "Verdubbel de capaciteit van de bakvormen");
  new EfficiencyUpgrade(game, "oven", 50000, "doubleoven", "Verdubbel de capaciteit van de oven");
  new EfficiencyUpgrade(game, "Gorden", 10000000, "doubleGorden", "Maakt Gorden boos");

new DoubleClickUpgrade(game, 50000, "doubleClick", "Double Click Power");
});
