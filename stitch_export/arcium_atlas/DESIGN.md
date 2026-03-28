# Design System Specification: The Technical Cartographer

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Atlas"**
This design system moves beyond typical "dark mode" dashboards to create a high-fidelity, researcher-grade interface. It is inspired by the precision of modern cartography and the complexity of network visualization. The goal is to make the user feel like an operator of a sophisticated, high-stakes system.

To break the "template" look, we employ **Intentional Asymmetry**. Information is not always centered; it is anchored to a rigorous grid that allows for vast areas of negative space, mimicking a map where the "data" is the focus, and the "terrain" is the background. We use high-contrast typography scales—pairing tiny, precise monospaced labels with expansive, airy display type—to create an editorial feel that commands authority.

---

## 2. Colors & Surface Logic
The palette is rooted in the deep void of a digital night, punctuated by high-energy signals.

### Color Tokens
- **Background (Base):** `#111417` (Deep Navy/Near-Black)
- **Primary (Signal):** `#00f0ff` (Cool Cyan) — Use for critical data points and active states.
- **Secondary (Link):** `#1A73E8` (Electric Blue) — Use for connectivity and secondary actions.
- **Neutral/Surface:** A range from `surface-container-lowest` (#0c0e12) to `surface-bright` (#37393d).

### The "No-Line" Rule
Traditional 1px solid borders for sectioning are strictly prohibited. In this system, boundaries are defined through:
1.  **Background Shifts:** Use `surface-container-low` for the main canvas and `surface-container` for nested modules.
2.  **Tonal Transitions:** Define areas through subtle shifts in saturation rather than lines.

### Surface Hierarchy & Nesting
Treat the UI as a layered stack of "Data Panes." 
- **The Base:** `surface` (#111417).
- **The Workspaces:** `surface-container-low` (#191c1f).
- **The Insights (Cards):** `surface-container` (#1d2023).
- **The Detail Pop-overs:** `surface-container-high` (#282a2e).

### Glass & Gradient Rule
For high-end flair, use **Glassmorphism** on floating panels.
- **Recipe:** `surface-container-highest` at 60% opacity with a `20px` backdrop-blur. 
- **Signature Texture:** Apply a subtle radial gradient on large backgrounds, moving from `surface` to a hint of `on-secondary-fixed-variant` (#004493) at 5% opacity to simulate a glowing terminal screen.

---

## 3. Typography
The typographic voice is "Clinical Precision meets Editorial Sophistication."

*   **Display & Headlines (Space Grotesk):** Used for high-level data points and section titles. The wide aperture of Space Grotesk feels technological and modern.
*   **Data & Technical Labels (JetBrains Mono):** Every piece of metadata, coordinate, or status must be in JetBrains Mono. It reinforces the "Researcher" persona.
*   **Body & Utility (Inter):** Used for long-form reading and interface instructions. Inter provides the necessary legibility to balance the sharp technicality of the monospaced font.

**Hierarchy Tip:** Pair a `display-lg` statistic with a `label-sm` monospaced description. This extreme contrast in scale is a hallmark of high-end digital experiences.

---

## 4. Elevation & Depth
We reject traditional drop shadows. Depth in this system is a result of light and layering.

*   **The Layering Principle:** Achieve lift by stacking. A `surface-container-lowest` card placed inside a `surface-container-low` section creates a "recessed" look, while a `surface-container-high` card creates a "raised" look.
*   **Ambient Shadows:** If a floating element (like a context menu) requires separation, use an ultra-diffused shadow: `box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5)`. The shadow must never look "dirty"; it should feel like a natural falloff of light.
*   **The Ghost Border Fallback:** For interactive elements that require a boundary (like input fields), use a "Ghost Border": `outline-variant` (#3b494b) at 20% opacity. This defines the shape without cluttering the "map."

---

## 5. Components

### Buttons
- **Primary:** Background: `primary_container` (#00f0ff), Text: `on_primary` (#00363a). Sharp 0px corners.
- **Secondary (Ghost):** No background. Ghost border (20% opacity `outline`). Text: `primary`.
- **Tertiary:** Text only. `label-md` (JetBrains Mono) in `secondary` (#adc7ff) with a small `+` or `_` prefix.

### Input Fields
- **Style:** Underline only or Ghost Border. Use `surface-container-lowest` as the fill. 
- **State:** On focus, the bottom border animates to `primary` (#00f0ff). Helper text must be `label-sm` (JetBrains Mono).

### Data Chips
- Small, rectangular blocks. Background: `surface-container-highest`. Text: `on_surface_variant`. 
- For active "filtering," use `primary_container` with `on_primary`.

### Cards & Lists
- **Rule:** Forbid divider lines. 
- **Implementation:** Separate list items using `0.4rem` (Spacing 2) of vertical padding and a background hover state of `surface-container-high`.
- **Layout:** Use the spacing scale to create "Information Clusters." A cluster of data should be separated from another by at least `1.75rem` (Spacing 8).

### The "Atlas" Component (Custom)
A persistent background element consisting of a subtle `1px` grid or topographic SVG pattern using `outline_variant` at 5% opacity. This tethers all components to a "global coordinate system."

---

## 6. Do's and Don'ts

### Do:
- **Do** use uppercase for monospaced labels to increase the "technical" feel.
- **Do** use `0px` border radius everywhere. Sharpness is precision.
- **Do** allow content to breathe. Use the `24` (5.5rem) spacing token for major section margins.
- **Do** use the `primary` cyan sparingly—like a laser pointer on a map.

### Don't:
- **Don't** use rounded corners. It softens the authoritative tone.
- **Don't** use standard grey shadows. They muddy the deep navy aesthetic.
- **Don't** use 100% opaque borders. They create "visual noise" that distracts from the data.
- **Don't** use "Information Density" as an excuse for clutter. Even complex data can have generous white space.

### Accessibility Note:
While the aesthetic is dark and technical, ensure that `on_surface_variant` text on `surface_container` backgrounds maintains at least a 4.5:1 contrast ratio. Use the `primary` cyan for critical alerts to ensure they "pop" against the dark terrain.