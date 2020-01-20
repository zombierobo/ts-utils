import { estimateNetSavings } from './estimate-net-savings';

const DollarToInr = 70;

test('estimateNetSavings - it should return computed savings', () => {
  /* Estimated net savings in $$ of a Developer working in silicon valley for 7 years */
  const config = {
    years: 7,
    initialSalPerYear: 150000,
    salHike: 0.1,
    inflation: 0.05,
    tax: 1 / 3,
    rentPerMonth: 2000,
    foodAndUtilPerMonth: 1000,
    miscPerMonth: 500
  };
  const savings = Math.floor(estimateNetSavings(config));
  console.log(
    'Savings in $$ -',
    savings,
    ', INR -',
    savings * DollarToInr,
    'for config ',
    config
  );
  expect(savings).toEqual(606752);
});

test('estimateNetSavings - it should return computed savings', () => {
  /* Estimated net savings in INR of a Developer working in Bangalore for 7 years */
  const config = {
    years: 7,
    initialSalPerYear: 2500000,
    salHike: 0.12,
    inflation: 0.05,
    tax: 1 / 3,
    rentPerMonth: 15000,
    foodAndUtilPerMonth: 15000,
    miscPerMonth: 5000
  };
  const savings = Math.floor(estimateNetSavings(config));
  console.log(
    'Savings in $$ -',
    savings / DollarToInr,
    ', INR -',
    savings,
    'for config ',
    config
  );
  expect(savings).toBeGreaterThan(10000000);
});
