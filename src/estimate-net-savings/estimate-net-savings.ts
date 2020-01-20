function gpSum(initial: number, rate: number, count: number): number {
  return (initial * (Math.pow(rate, count) - 1)) / (rate - 1);
}

export function estimateNetSavings(data: {
  years: number;
  initialSalPerYear: number;
  salHike: number;
  tax: number;
  rentPerMonth: number;
  foodAndUtilPerMonth: number;
  miscPerMonth: number;
  inflation: number;
}) {
  const sal = gpSum(data.initialSalPerYear, 1 + data.salHike, data.years);
  const salAfterTax = sal - sal * data.tax;
  const rent = gpSum(data.rentPerMonth * 12, 1 + data.inflation, data.years);
  const foodAndUtil = gpSum(
    data.foodAndUtilPerMonth * 12,
    1 + data.inflation,
    data.years
  );
  const miscPerMonth = gpSum(
    data.miscPerMonth * 12,
    1 + data.inflation,
    data.years
  );
  return salAfterTax - rent - foodAndUtil - miscPerMonth;
}
