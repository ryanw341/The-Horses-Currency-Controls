const MODULE_ID = "horses-currency-controls";
const CURRENCY_KEYS = ["pp", "gp", "ep", "sp", "cp"];
const DEFAULT_WEIGHTS = { pp: 0.02, gp: 0.02, ep: 0.02, sp: 0.02, cp: 0.02 };

let BASE_CURRENCIES = {};

Hooks.once("init", () => {
  if (CONFIG?.DND5E?.currencies) {
    BASE_CURRENCIES = foundry.utils.deepClone(CONFIG.DND5E.currencies);
  }
  registerCurrencySettings();
});

Hooks.once("ready", () => {
  applyCurrencyOverrides();
  setupEncumbranceWrapper();
});

function registerCurrencySettings() {
  for (const key of CURRENCY_KEYS) {
    const defaultLabel = getDefaultLabel(key);
    const defaultWeight = DEFAULT_WEIGHTS[key] ?? 0;

    game.settings.register(MODULE_ID, `${key}-enabled`, {
      name: game.i18n.format("HCC.Settings.Enabled", { currency: defaultLabel }),
      hint: game.i18n.format("HCC.Settings.EnabledHint", { currency: defaultLabel }),
      scope: "world",
      config: true,
      type: Boolean,
      default: true,
      onChange: handleSettingsChange
    });

    game.settings.register(MODULE_ID, `${key}-name`, {
      name: game.i18n.format("HCC.Settings.Name", { currency: defaultLabel }),
      hint: game.i18n.localize("HCC.Settings.NameHint"),
      scope: "world",
      config: true,
      type: String,
      default: defaultLabel,
      onChange: handleSettingsChange
    });

    game.settings.register(MODULE_ID, `${key}-weight`, {
      name: game.i18n.format("HCC.Settings.Weight", { currency: defaultLabel }),
      hint: game.i18n.localize("HCC.Settings.WeightHint"),
      scope: "world",
      config: true,
      type: Number,
      range: { min: 0, step: 0.001 },
      default: defaultWeight,
      onChange: handleSettingsChange
    });
  }
}

function handleSettingsChange() {
  if (!game.ready) return;
  applyCurrencyOverrides();
}

function applyCurrencyOverrides() {
  if (!CONFIG?.DND5E?.currencies) return;

  const currencies = foundry.utils.deepClone(BASE_CURRENCIES);
  const enabledCurrencies = {};
  const order = [];

  for (const key of CURRENCY_KEYS) {
    const existing = currencies[key];
    if (!existing) continue;

    const enabled = game.settings.get(MODULE_ID, `${key}-enabled`);
    if (!enabled) continue;

    const name = (game.settings.get(MODULE_ID, `${key}-name`) || "").trim();
    const weight = Number(game.settings.get(MODULE_ID, `${key}-weight`)) || 0;

    existing.label = name || existing.label;
    existing.abbreviation = deriveAbbreviation(name, existing.abbreviation ?? key.toUpperCase());
    existing.weight = weight;
    existing.conversion = filterConversions(existing.conversion);

    enabledCurrencies[key] = existing;
    order.push(key);
  }

  CONFIG.DND5E.currencies = enabledCurrencies;
  CONFIG.DND5E.currencyOrder = order;

  if (game.dnd5e?.config) {
    game.dnd5e.config.currencies = enabledCurrencies;
    game.dnd5e.config.currencyOrder = order;
  }

  refreshActorSheets();
}

function filterConversions(conversion) {
  if (!conversion) return conversion;
  const filtered = {};
  for (const [target, rate] of Object.entries(conversion)) {
    const targetEnabled = game.settings.get(MODULE_ID, `${target}-enabled`);
    if (targetEnabled) filtered[target] = rate;
  }
  return filtered;
}

function deriveAbbreviation(name, fallback) {
  const trimmed = (name || "").trim();
  if (!trimmed) return fallback;

  if (trimmed.length <= 4 && !trimmed.includes(" ")) return trimmed;

  const abbrev = trimmed
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);

  return abbrev || fallback;
}

function refreshActorSheets() {
  // Force actors to recompute derived data
  for (const actor of game.actors) {
    if (actor.prepareData) {
      actor.prepareData();
    }
  }
  
  // Re-render open actor sheets
  for (const app of Object.values(ui.windows)) {
    const isActorSheet = app?.document?.documentName === "Actor";
    if (isActorSheet && typeof app.render === "function") {
      app.render(false);
    }
  }
}

function setupEncumbranceWrapper() {
  // Check if libWrapper is available
  if (typeof libWrapper === "function") {
    // Wrap the _computeCurrencyWeight method on Actor5e
    libWrapper.register(
      MODULE_ID,
      "CONFIG.Actor.documentClass.prototype._computeCurrencyWeight",
      computePerCurrencyWeight,
      "OVERRIDE"
    );
    console.log(`${MODULE_ID} | Registered libWrapper for per-currency weight encumbrance`);
  } else {
    // Fallback: manually override the method
    const ActorClass = CONFIG.Actor.documentClass;
    if (ActorClass?.prototype?._computeCurrencyWeight) {
      ActorClass.prototype._computeCurrencyWeight = computePerCurrencyWeight;
      console.log(`${MODULE_ID} | Manually overridden _computeCurrencyWeight for per-currency weight`);
    } else {
      console.warn(`${MODULE_ID} | Unable to override currency weight calculation - method not found`);
    }
  }
}

function computePerCurrencyWeight() {
  // Calculate total currency weight using per-currency weights from CONFIG.DND5E.currencies
  const currency = this.system.currency || {};
  let totalWeight = 0;
  
  for (const [key, amount] of Object.entries(currency)) {
    const currencyConfig = CONFIG.DND5E?.currencies?.[key];
    if (!currencyConfig) continue;
    
    const weight = currencyConfig.weight ?? 0;
    const qty = Number(amount) || 0;
    totalWeight += qty * weight;
  }
  
  return totalWeight;
}

function getDefaultLabel(key) {
  const labelKey = CONFIG?.DND5E?.currencies?.[key]?.label;
  const localized = labelKey ? game.i18n.localize(labelKey) : undefined;
  return localized || key.toUpperCase();
}
