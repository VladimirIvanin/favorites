export function patchNumber (num) {
  var isString = typeof num == 'string';
  var isNumber = typeof num == 'number';

  if (!isNumber && !isString) {
    return 0;
  }

  if(isString){
    num = num.replace(/,/g, '.');
    num = (isNaN(+num)) ? 1 : +num;
  }

  function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }

  return Number( (isFloat(num)) ? num.toFixed(2) : num );
}
