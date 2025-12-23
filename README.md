# Horses Currency Controls

A Foundry VTT v13 module for the 5e system to rename, weight, and toggle the default currencies (PP, GP, EP, SP, CP). Disabled currencies are removed from the system currency list so they disappear on actor sheets and related UI. The module also implements per-currency weight for accurate encumbrance calculations.

## Usage

1. Install the module and enable it in your world.
2. Open *Configure Settings → Module Settings → Horses Currency Controls*.
3. For each currency, you can:
   - Enable/disable it (disabled currencies are hidden from sheets).
   - Override its display name.
   - Set weight per coin (0 to ignore weight).
4. Saving settings immediately re-renders open actor sheets so you can see the change.

## Features

- **Currency Toggle**: Enable or disable individual currencies (PP, GP, EP, SP, CP).
- **Currency Renaming**: Customize display names for each currency.
- **Per-Currency Weight**: Set individual weights for each currency type, enabling realistic encumbrance calculations where different coin types can have different weights.
- **Encumbrance Integration**: Automatically patches the D&D 5e encumbrance system to use per-currency weights instead of the default universal coin weight.

## Encumbrance Calculation

The module overrides the default D&D 5e encumbrance calculation to support per-currency weights. Instead of using the standard "50 coins = 1 lb" rule, it calculates currency weight as:

```
Total Currency Weight = sum(currencyAmount[k] * CONFIG.DND5E.currencies[k].weight)
```

This allows you to set different weights for different currency types. For example:
- Copper pieces could weigh more than gold pieces
- Platinum pieces could weigh less than other currencies
- Any currency can be set to 0 weight if you want to ignore its weight

The module uses [libWrapper](https://foundryvtt.com/packages/lib-wrapper) when available for maximum compatibility, but will work without it using a fallback method.

## Notes

- Applies to the core 5e currency list (PP, GP, EP, SP, CP) only.
- Conversion mappings to disabled currencies are removed to avoid stray references.
- Both `CONFIG.DND5E.currencies` and `game.dnd5e.config.currencies` are updated, along with `currencyOrder`, for better compatibility with sheets and modules.
- The encumbrance wrapper ensures that currency weight changes are immediately reflected in actor encumbrance calculations.

## Compatibility

- Foundry VTT: v13
- 5e system: v4 (tested baseline)
- Recommended: [libWrapper](https://foundryvtt.com/packages/lib-wrapper) for enhanced compatibility

## License

MIT
