document.addEventListener("DOMContentLoaded", () => {
  class Game {
    constructor() {
      this.score = 1000000000000;
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

    saveGameState() {
      const gameState = {
        score: this.score,
        extraClickPower: this.extraClickPower,
        autoClickers: Object.keys(this.autoClickers).reduce((acc, key) => {
          acc[key] = {
            count: this.autoClickers[key].count,
            cps: this.autoClickers[key].cps,
            cost: this.autoClickers[key].cost,
            initialCost: this.autoClickers[key].initialCost,
          };
          return acc;
        }, {}),
        upgrades: Array.from(document.querySelectorAll(".upgrade-button")).map(
          (button) => ({
            id: button.id,
            count: parseInt(button.querySelector("span").textContent) || 0,
          })
        ),
      };
      localStorage.setItem("cookieClickerGameState", JSON.stringify(gameState));
      console.log("Game state saved:", gameState);
      console.log("AutoClickers opgeslagen:", gameState.autoClickers);
    }

    loadGameState() {
      const gameState = JSON.parse(
        localStorage.getItem("cookieClickerGameState")
      );
      if (gameState) {
        // Herstel de score en extra click power
        this.score = gameState.score;
        this.extraClickPower = gameState.extraClickPower;
        this.updateScore();

        // Herstel AutoClickers
        for (const key in gameState.autoClickers) {
          const autoClickerData = gameState.autoClickers[key];
          if (this.autoClickers[key]) {
            const autoClicker = this.autoClickers[key];
            autoClicker.count = autoClickerData.count;
            autoClicker.cps = autoClickerData.cps;
            autoClicker.cost = autoClickerData.cost;
            autoClicker.initialCost = autoClickerData.initialCost; // Herstel initialCost
            autoClicker.updateButtonText();

            // Start de AutoClicker opnieuw als er een count is
            if (autoClicker.count > 0) {
              console.log(
                `AutoClicker ${key} wordt gestart met count: ${autoClicker.count}`
              );
              clearInterval(autoClicker.interval); // Zorg dat er geen dubbele intervals zijn
              autoClicker.start();
            }
          }
        }
        console.log("AutoClickers geladen:", gameState.autoClickers);

        // Herstel EfficiencyUpgrades
        gameState.upgrades.forEach((upgrade) => {
          const button = document.getElementById(upgrade.id);
          if (button) {
            const countSpan = button.querySelector("span");
            if (countSpan) {
              countSpan.textContent = upgrade.count;
            }
          }
        });
      }
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
      this.initialCost = cost;
      this.count = 0;
      this.interval = null;
      this.button = document.getElementById(buttonId);
      this.countElement = document.getElementById(`count-${buttonId}`);
      console.log(`AutoClicker ${name} gekoppeld aan knop:`, this.button);
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
      if (this.interval) {
        clearInterval(this.interval); // Voorkom dubbele intervals
      }
      if (this.count > 0) {
        console.log(`${this.name} AutoClicker gestart met interval.`);
        this.interval = setInterval(() => {
          console.log(
            `${this.name} genereert ${
              this.count * this.cps
            } koekjes per seconde.`
          );
          this.game.addPoints(this.count * this.cps);
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
        console.log(
          `Click power increased! Extra cookies per click: ${this.game.extraClickPower}`
        );
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

  // Maak eerst alle AutoClickers aan
  new AutoClicker(game, "Oma", 2, 15, "buyAutoClicker");
  new AutoClicker(game, "Beterdeeg", 20, 250, "koopbeterdeeg");
  new AutoClicker(game, "Bakvormen", 50, 1000, "koopbakvormen");
  new AutoClicker(game, "oven", 100, 2000, "koopoven");
  new AutoClicker(game, "Bakkerij", 200, 5000, "koopbakkerij");
  new AutoClicker(game, "Personeel", 300, 10000, "kooppersoneel");
  new AutoClicker(game, "Fabriek", 500, 500000, "koopfabriek");
  new AutoClicker(game, "Gorden", 1000000, 1000000, "koopGorden");

  // Laad daarna de opgeslagen game state
  game.loadGameState();

  // Save Game knop
  const saveButton = document.getElementById("saveGame");
  saveButton.addEventListener("click", () => {
    game.saveGameState();
    alert("Game saved!");
  });

  // Delete Save knop
  const deleteButton = document.getElementById("deleteSave");
  deleteButton.addEventListener("click", () => {
    // Verwijder de opgeslagen game state uit localStorage
    localStorage.removeItem("cookieClickerGameState");

    // Reset de game state
    game.score = 0;
    game.extraClickPower = 0;
    game.updateScore();

    // Reset AutoClickers
    for (const key in game.autoClickers) {
      const autoClicker = game.autoClickers[key];
      autoClicker.count = 0;
      autoClicker.cost = autoClicker.initialCost; // Zorg dat je een `initialCost` hebt ingesteld
      autoClicker.updateButtonText();
      clearInterval(autoClicker.interval); // Stop eventuele actieve AutoClickers
      autoClicker.interval = null;
    }

    // Reset EfficiencyUpgrades
    document.querySelectorAll(".upgrade-button span").forEach((span) => {
      span.textContent = "0";
    });

    alert("Save deleted and game reset!");
    location.reload(); // Herlaad de pagina om alles opnieuw te initialiseren
  });

  // Automatisch opslaan elke 5 minuten
  setInterval(() => {
    game.saveGameState();
    console.log("Game state automatically saved.");
  }, 300000); // 300.000 ms = 5 minuten

  window.addEventListener("beforeunload", () => game.saveGameState());

  new Clicker("cookie", game, 1);

  new EfficiencyUpgrade(
    game,
    "Oma",
    5000,
    "doubleOma",
    "Verdubbel Oma's snelheid"
  );
  new EfficiencyUpgrade(
    game,
    "Beterdeeg",
    10000,
    "doublebeterdeeg",
    "Verdubbel de productie van deeg"
  );
  new EfficiencyUpgrade(
    game,
    "Bakvormen",
    25000,
    "doublebakvormen",
    "Verdubbel de capaciteit van de bakvormen"
  );
  new EfficiencyUpgrade(
    game,
    "oven",
    50000,
    "doubleoven",
    "Verdubbel de capaciteit van de oven"
  );
  new EfficiencyUpgrade(
    game,
    "Gorden",
    10000000,
    "doubleGorden",
    "Maakt Gorden boos"
  );

  new DoubleClickUpgrade(game, 50000, "doubleClick", "Double Click Power");
});
