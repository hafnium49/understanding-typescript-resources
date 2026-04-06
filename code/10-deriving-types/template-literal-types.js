"use strict";
// =====================================================================
// TEMPLATE LITERAL TYPES — composing string literal types like strings.
// =====================================================================
//
// Template literal types use the same backtick syntax as JavaScript's
// template literals, but they operate on TYPES (not values). They let
// you build new string literal types by combining other string literal
// types — including the cross-product of unions.
//
// JAVASCRIPT REMINDER (a value, not a type):
// const mainUserName = 'Max';
// const greeting = `Hi there, ${mainUserName}.`;
//
// The same backtick + ${...} syntax appears in TypeScript types, but
// in a TYPE position (after "type ... ="). The result is a string
// literal TYPE, not a string value.
