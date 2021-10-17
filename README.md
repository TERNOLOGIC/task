# Intro
Ternologic Project front-end.

[![NPM Version][npm-image]][npm-url]
[![React Version][react-image]][react-url]
[![Material-UI Version][material-ui-image]][material-ui-url]

# Codebase structure
Please do not put all of your code in one file / folder. Rather choose (or come up with) a designing pattern - like MVC, Clean Architecture etc. that makes
it easier to read your code and reason about it. 

Remember that you are not writing the code for yourself. So, the more your code is clear and clean the better it's maintained by other developers.

Strive to always make your components as dump (with no logic in them) as possible. Put all of your logic inside a custom hook. 

### Completed task should be:
- Error free.
- Properly commented.
- Props documented - adhere to [JSDoc][jsdoc] syntax.
- PropType checked - adhere to React [type checking][react-typechecking] approach.
- Unit and integration tested.
- All exceptions properly handled.
- Free of type `any` unless absolutely necessary. 

### Nice to have:
- End-to-end testing.
- A document describing your design - a.k.a design doc.

### Notes
- Please don't install any dependency with exception of a library for end-to-end testing. Use only the ones defined in the package.json

[react-url]: https://reactjs.org/
[react-image]: https://badgen.net/badge/react/17.0.2/blue
[npm-url]: https://www.npmjs.com/
[npm-image]: https://badgen.net/badge/npm/6.14/red?icon=npm
[material-ui-url]: https://material-ui.com/
[material-ui-image]: https://badgen.net/badge/material-ui/4.11/cyan
[jsdoc]: https://jsdoc.app/
[react-typechecking]: https://reactjs.org/docs/typechecking-with-proptypes.html


