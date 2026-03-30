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

function calculateInvestment(data: InvestmentData): CalculationResult {
  const { initialAmount, annualContribution, expectedReturn, duration } = data;

  if (initialAmount < 0) {
    return 'Initial investment amount must be at least zero.'
  }

  if (duration <= 0) {
    return 'No valid amount of years provided.'
  }

  if (expectedReturn < 0) {
    return 'Expected return must be at least zero.'
  }

  let total = initialAmount;
  let totalContributions = 0;
  let totalInterestEarned = 0;

  const annualResults: InvestmentResult[] = [];

  for (let i = 0; i < duration; i++) {
    total = total * (1 + expectedReturn);
    totalInterestEarned = total - totalContributions - initialAmount;
    totalContributions = totalContributions + annualContribution;
    total = total + annualContribution;

    annualResults.push({
      year: `Year ${i + 1}`,
      totalAmount: total,
      totalInterestEarned,
      totalContributions
    });
  }

  return annualResults;
}

function printResults(results: CalculationResult) {
  if (typeof results === 'string') {
    console.log(results);
    return;
  }

  for (const yearEndResult of results) {
    console.log(yearEndResult.year);
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
