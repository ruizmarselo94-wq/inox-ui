---
name: inox-ui-contrib
description: >-
  Cómo agregar o modificar algo en Inox UI sin romper su universalidad. Usar
  SIEMPRE al tocar este repo — un componente, un token, un ícono, un estilo—
  y también al decidir DESDE OTRO PROYECTO si algo que falta debe agregarse
  acá o resolverse allá. Hace cumplir: tokens sin valores cromáticos, cero
  identidad de producto adentro, fallback para no romper consumidores, y la
  separación entre la capa CSS universal y los componentes Svelte.
---

# Contribuir a Inox UI

Inox UI es el design system de Lantano. Lo consumen **varios productos a la
vez** —Didimio, RustKnight, y lo que venga—, cada uno fijándolo por commit SHA.

Todo lo que entra acá tiene que servirle a cualquiera de ellos. Esa es la
única regla, y de ella salen todas las demás.

## La pregunta previa: ¿va acá o en el producto?

| Va **acá** | Va en el **producto** |
|---|---|
| Un patrón que a más de un producto le sirve | Una pantalla, un flujo, una regla de negocio |
| Estructura: espaciado, tipografía, estados, foco | Los **valores** de color de una marca |
| Un componente genérico (`IxModal`, `IxTable`) | La composición de esos componentes |
| Un ícono de uso general | Un ícono que solo tiene sentido en un dominio |

**Ante la duda, va acá** — pero neutral. Es preferible un token opcional en la
librería que la misma solución copiada en tres productos.

Si al escribir el componente necesitás nombrar un producto, un rubro o un país
para que funcione, **estás resolviendo el problema en el lugar equivocado**.

## Los tres errores que ya se cometieron

Están acá porque volvieron a aparecer más de una vez.

1. **Identidad de producto adentro de un tipo.** `Theme` llegó a ser
   `'dark' | 'light' | 'carbon' | 'stainless' | 'titanium'` — los nombres de
   tema de **un** consumidor, más una dimensión de acento con sus hex. Ningún
   otro producto podía usar el tipo sin heredar una identidad ajena. Hoy es
   `'dark' | 'light'` y los valores los pone cada tema.

2. **Un país hardcodeado.** `IxFlag` dibujaba la bandera de Paraguay dentro de
   la librería. Se eliminó.

3. **Un componente que decide por el consumidor.** El `appName` por defecto era
   el nombre de un producto, así que cualquier otro que no lo pasara mostraba
   una marca ajena.

## Tokens

- **`tokens.scss` declara la estructura, no los valores.** Los `--ix-color-*`
  existen **vacíos**; el consumidor los llena en su tema. Nunca poner un color
  ahí.
- **Un token nuevo que un componente ya existente va a consumir se agrega con
  fallback:**

  ```scss
  background: var(--ix-color-surface-chrome, var(--ix-color-surface));
  ```

  Sin el fallback, todo consumidor que no lo defina se rompe en silencio al
  bumpear el pin. Con él, quien no lo define sigue igual y quien lo quiere lo
  activa.
- Documentar **por qué existe** el token, no solo qué hace. Si es una decisión
  de identidad —que el chrome avance o retroceda, por ejemplo— decirlo: le
  explica al consumidor que la elección es suya.

## Componentes

1. **CSS** — `style/components/_nombre.scss`, clases `ix-nombre-*`, sin un solo
   valor hardcodeado: todo por token.
2. **Agregador** — `@forward` en `style/components.scss`.
3. **Svelte** — `src/lib/components/<categoría>/IxNombre.svelte`, con runes.
4. **Tipos** — si necesita un enum de variantes, a `src/lib/types.ts`. Que sea
   **semántico**, no de marca: `primary | danger`, no `rust | steel`.
5. **Export** — en `src/lib/index.ts`.
6. **CHANGELOG** — en `[Unreleased]`, explicando el porqué.

La capa CSS **no puede asumir nada del framework**: nada de sintaxis Svelte en
`.scss`, ni variables JS en tokens. Si algo necesita comportamiento (modal,
drawer, cola de toasts), el CSS define la presentación y el componente Svelte
gestiona el estado.

## Accesibilidad — se resuelve acá, una vez

Es la razón de peso para que un patrón viva en la librería: que ningún producto
tenga que volver a resolverlo.

- **WCAG AA como piso.** Texto 4.5:1; elementos de interfaz 3:1 (1.4.11).
- El borde de un control **sin relleno** —`outline`, `ghost`, `btn-icon`— es su
  única identidad visual y cae bajo 1.4.11. Por eso existe
  `--ix-color-border-interactive`, separado del borde decorativo.
- Escala tipográfica en `rem`, para que respete el zoom del sistema (1.4.4).
- `focus-visible` en todo lo enfocable, con **un solo anillo heredado** — no uno
  por componente, o cada quien elige su color y alguno falla el contraste.
- Área de toque mínima 44px (2.5.5). Y **feedback al toque**: el hover no
  alcanza en una pantalla táctil.

## Versionado

**No se bumpea.** Inox UI se queda en `0.1.0`: no hay paquete publicado y cada
consumidor la fija por commit SHA, así que el número describe pero no controla.
Lo que entra va a `[Unreleased]`.

## Antes de pushear

- [ ] `npm run check` en cero
- [ ] Ningún valor cromático en `tokens.scss`
- [ ] Ningún nombre de producto, rubro o país en código o tipos
- [ ] Los tokens nuevos que consumen componentes existentes tienen fallback
- [ ] `CHANGELOG.md` actualizado en `[Unreleased]`, con el porqué
- [ ] Si es un cambio incompatible, se verificó qué consumidores lo tocan

Después de pushear, **cada producto decide cuándo mover su pin.** No se bumpea
por él.
