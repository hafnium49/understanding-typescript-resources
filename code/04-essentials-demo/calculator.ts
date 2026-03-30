// INVESTMENT CALCULATOR — a terminal-based demo project.
//
// This project applies essential TypeScript features (type aliases,
// union types, object types, type narrowing, function return types)
// in a practical context rather than isolated snippets.
//
// EXECUTION WORKFLOW:
//   1. Compile:  tsc calculator.ts
//   2. Run:      node calculator.js
// Node.js executes the compiled JavaScript directly in the terminal —
// no website or browser needed. This is a common approach for running
// demo code throughout the course.
//
// INPUT DATA (hard-coded for simplicity):
// initial amount, annual contribution, expected return, duration
//
// PROJECT SETUP:
// This project was initialized with "tsc --init" to create a tsconfig.json.
// The target was changed to ES2022, and strict mode is enabled. All other
// settings use defaults. To compile, run "tsc" (no filename) from this
// directory so tsconfig.json settings are applied.
//
// APPLICATION DESIGN — two functions with a clear data flow:
//
//   1. calculateInvestment(data) — receives investment parameters (initial
//      amount, annual contribution, expected return rate, duration) and
//      returns an array of per-year results showing the portfolio value,
//      total contributions, and interest earned at each year-end.
//
//   2. printResults(results) — receives the array produced by
//      calculateInvestment and outputs it to the terminal in a readable,
//      multi-line format.
//
// The data flow is: hard-coded input → calculateInvestment → printResults.

// TYPE ALIAS for the input — an object type describing the four pieces
// of investment data the calculator needs.
//
// DESIGN DECISION: Rather than accepting four separate parameters
// (initialAmount, annualContribution, expectedReturn, duration), the
// function takes a single object parameter. This avoids a long parameter
// list and eliminates the risk of passing arguments in the wrong order.
//
// The type is defined as a TYPE ALIAS (using the "type" keyword) rather
// than inline (directly after the colon on the parameter). Either approach
// is valid, but a named alias is easier to read and can be reused in
// other places without copy-pasting the entire definition.
type InvestmentData = {
  initialAmount: number;
  annualContribution: number;
  expectedReturn: number;
  duration: number;
};

// TYPE ALIAS for a single year's output — each entry in the results
// array describes the portfolio state at one year-end.
type InvestmentResult = {
  year: string;
  totalAmount: number;
  totalContributions: number;
  totalInterestEarned: number;
};

// UNION TYPE for the return value — the function either succeeds and
// returns an array of year-end results, or fails validation and returns
// an error message string. This is a practical use of union types:
// one type for the happy path, another for the error path.
type CalculationResult = InvestmentResult[] | string;

// EXPLICIT RETURN TYPE — CalculationResult tells TypeScript (and readers)
// exactly what this function can produce. TypeScript verifies that every
// return path (error strings and the final array) matches this union type.
function calculateInvestment(data: InvestmentData): CalculationResult {
  // OBJECT DESTRUCTURING — a standard JavaScript feature that extracts
  // properties from an object into individual local variables, making
  // the calculation code below cleaner and shorter.
  const { initialAmount, annualContribution, expectedReturn, duration } = data;

  // INPUT VALIDATION — returning early with an error string.
  //
  // These checks demonstrate the union return type in action: when input
  // is invalid, the function returns a string (the error-path type).
  // When input is valid, it eventually returns an InvestmentResult[]
  // (the happy-path type). TypeScript is satisfied because both branches
  // produce values that match the CalculationResult union.
  if (initialAmount < 0) {
    return 'Initial investment amount must be at least zero.'
  }

  if (duration <= 0) {
    return 'No valid amount of years provided.'
  }

  if (expectedReturn < 0) {
    return 'Expected return must be at least zero.'
  }

  // TRACKING VARIABLES — updated each iteration of the loop below.
  // "total" starts at the initial investment. Contributions and interest
  // start at zero because no time has passed yet.
  let total = initialAmount;
  let totalContributions = 0;
  let totalInterestEarned = 0;

  // TYPED ARRAY — explicitly annotated as InvestmentResult[] because it
  // starts empty (TypeScript cannot infer the element type from []).
  // Despite being a "const", its contents can change via push() — const
  // only prevents reassigning the variable itself, not mutating the array.
  const annualResults: InvestmentResult[] = [];

  for (let i = 0; i < duration; i++) {
    // Apply the expected return BEFORE adding this year's contribution,
    // assuming contributions are made at the end of each year.
    // expectedReturn is expected as a decimal (e.g., 0.08 for 8%).
    total = total * (1 + expectedReturn);
    totalInterestEarned = total - totalContributions - initialAmount;
    totalContributions = totalContributions + annualContribution;
    total = total + annualContribution;

    annualResults.push({
      // TEMPLATE LITERAL — JavaScript's backtick syntax for embedding
      // expressions inside strings using ${...}.
      year: `Year ${i + 1}`,
      totalAmount: total,
      // SHORTHAND PROPERTY SYNTAX — a JavaScript feature (not TypeScript).
      // When the property name and variable name are identical, you can
      // omit the ": value" part. These two lines are equivalent to:
      //   totalInterestEarned: totalInterestEarned,
      //   totalContributions: totalContributions,
      totalInterestEarned,
      totalContributions
    });
  }

  // HAPPY-PATH RETURN — an array of InvestmentResult objects, satisfying
  // the other half of the CalculationResult union type.
  return annualResults;
}

// REUSING A TYPE ALIAS — the CalculationResult type defined earlier is
// used here as the parameter type. This is one of the key benefits of
// type aliases: define the type once, use it in multiple places. Without
// the alias, we would have to copy-paste "InvestmentResult[] | string"
// into both the return type above and the parameter type here.
function printResults(results: CalculationResult) {
  // TYPE GUARD — using "typeof" to narrow a union type at runtime.
  //
  // Since results is of type CalculationResult (InvestmentResult[] | string),
  // TypeScript does not know which branch we are in. The "typeof" operator
  // (a standard JavaScript feature) checks the runtime type and lets
  // TypeScript NARROW the union: inside this if-block, results is treated
  // as "string"; after it, results is treated as "InvestmentResult[]".
  //
  // The early "return" ensures no further code runs if we got an error
  // string — so TypeScript knows that everything below this block can
  // only execute when results is the array type.
  if (typeof results === 'string') {
    console.log(results);
    return;
  }

  // FOR-OF LOOP — iterates over each element in the results array.
  // TypeScript knows results is InvestmentResult[] here (not string),
  // thanks to the type guard above, so yearEndResult is automatically
  // inferred as InvestmentResult — giving full access to its properties.
  for (const yearEndResult of results) {
    console.log(yearEndResult.year);
    // toFixed() is a built-in JavaScript method on numbers that formats
    // the value to a fixed number of decimal places (0 here = no decimals).
    // TypeScript allows calling it because it knows totalAmount is a number
    // from the InvestmentResult type definition.
    console.log(`Total: ${yearEndResult.totalAmount.toFixed(0)}`);
    console.log(`Total Contributions: ${yearEndResult.totalContributions.toFixed(0)}`);
    console.log(`Total Interest Earned: ${yearEndResult.totalInterestEarned.toFixed(0)}`);
    console.log('----------------------');
  }
}

const investmentData: InvestmentData = {
  initialAmount: 5000,
  annualContribution: 500,
  expectedReturn: 0.08,
  duration: 10
};

const results = calculateInvestment(investmentData)

printResults(results);
