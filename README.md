# Horses Currency Controls

A Foundry VTT v13 module for the 5e system to rename, weight, and toggle the default currencies (PP, GP, EP, SP, CP). Disabled currencies are removed from the system currency list so they disappear on actor sheets and related UI.

## Usage

1. Install the module and enable it in your world.
2. Open *Configure Settings → Module Settings → Horses Currency Controls*.
3. For each currency, you can:
   - Enable/disable it (disabled currencies are hidden from sheets).
   - Override its display name.
   - Set weight per coin (0 to ignore weight).
4. Saving settings immediately re-renders open actor sheets so you can see the change.

## Notes

- Applies to the core 5e currency list (PP, GP, EP, SP, CP) only.
- Conversion mappings to disabled currencies are removed to avoid stray references.
- Both `CONFIG.DND5E.currencies` and `game.dnd5e.config.currencies` are updated, along with `currencyOrder`, for better compatibility with sheets and modules.

## Compatibility

- Foundry VTT: v13
- 5e system: v4 (tested baseline)

## License

MIT
