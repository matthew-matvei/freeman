# Code Structure

This document outlines the main structure of the FreeMAN codebase. It is a guide,
and not an exhaustive list.

## src

All TypeScript code lives in here.

- `src/common` - application code that runs on either the `main` or `renderer`
    process
- `src/interfaces` - code that will not run in any process (`interface` and
    `type` definitions)
- `src/main` - code that runs exclusively in the `main` process
- `src/renderer` - code that runs exclusively in the `renderer` process
    - `src/renderer/components` - React components, essentially the view of the
        application
    - `src/renderer/styles` - sass code responsible for basic styling and
        dimensions. Colours are handled by application logic to support theming

---

## app

Static assets are built here and used during development.

## build

Default `buildResources` folder for `electron-builder` (see [documentation](https://www.electron.build/configuration/configuration#configuration)).

## icons

Default path for icons for `electron-builder`.

## test

All unit tests live here. The pathing maps to the `src` directory under test.

## typings

Custom, usually rather stub, typings definitions for untyped modules.
