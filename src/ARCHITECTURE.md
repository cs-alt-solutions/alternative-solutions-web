# ALTERNATIVE SOLUTIONS - ARCHITECTURAL STANDARDS (STRICT MODE)

## 1. THE "NO-INLINE" PROTOCOL
* **Strict Ban:** Do NOT use `style={{ ... }}` for static styling (colors, padding, margins).
* **Execution:** All static styles MUST be handled via Tailwind classes or entries in `globals.css`.
* **Exception:** Inline styles are permitted ONLY for dynamic, calculated values (e.g., progress bar percentages).

## 2. GLOSSARY-FIRST DEVELOPMENT (Single Source of Truth)
* **Zero Hardcoding:** No UI text strings, labels, or asset paths should live inside components.
* **The Registry:** All content must be registered in `src/utils/glossary.js`. If you need to change a header, you change the glossary, not the code.

## 3. ATOMIC COMPONENT STRUCTURE
* **Modularization:** Large page files are prohibited. Break features into small, reusable components in `src/components/`.
* **Domain Isolation:** Components like `JoinForm` or `WaitlistRow` handle their own logic while the Page handles the layout.

## 4. THE INDUSTRIAL THEME (CSS Variables)
* **Centralized Colors:** Use CSS variables defined in `globals.css`.
* **Standard Palette:**
    * `--bg-app`: Deepest Black (#09090b)
    * `--brand-primary`: Cyan/Teal (#06b6d4)
    * `--brand-secondary`: Slate Blue (#3b82f6)