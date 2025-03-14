export function patchNumber(num) {
  const isString = typeof num === 'string';
  const isNumber = typeof num === 'number';

  if (!isNumber && !isString) {
    return 0;
  }

  if (isString) {
    num = isNaN(+(num.replace(/,/g, '.'))) ? 1 : +(num.replace(/,/g, '.'));
  }

  const isFloat = n => Number(n) === n && n % 1 !== 0;

  return Number(isFloat(num) ? num.toFixed(2) : num);
}