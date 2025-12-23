# Horses Currency Controls

A Foundry VTT v13 module for the 5e system to rename, weight, and toggle the default currencies (PP, GP, EP, SP, CP). Disabled currencies are removed from the system currency list so they disappear on actor sheets and related UI. The module applies a global currency weight for accurate encumbrance calculations.

## Usage

1. Install the module and enable it in your world.
2. Open *Configure Settings → Module Settings → Horses Currency Controls*.
3. For each currency, you can:
   - Enable/disable it (disabled currencies are hidden from sheets).
   - Override its display name.
4. Set a global weight per coin (0 to ignore weight).
5. Saving settings immediately re-renders open actor sheets so you can see the change.

## Features

- **Currency Toggle**: Enable or disable individual currencies (PP, GP, EP, SP, CP).
- **Currency Renaming**: Customize display names for each currency.
- **Global Currency Weight**: Set a single weight applied to all currencies.
- **Encumbrance Integration**: Automatically patches the D&D 5e encumbrance system to use the configured currency weight instead of the default universal coin weight.

## Encumbrance Calculation

The module overrides the default D&D 5e encumbrance calculation to support a global currency weight. Instead of using the standard "50 coins = 1 lb" rule, it calculates currency weight as:

```
Total Currency Weight = sum(currencyAmount[k] * CONFIG.DND5E.currencies[k].weight)
```

This allows you to adjust the overall weight of coins for your table. For example:
- You can make all coins lighter or heavier than the system default
- You can set coin weight to 0 if you want to ignore currency weight entirely

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
