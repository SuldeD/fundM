export const numberToCurrency = (value: any) =>
  `${value ?? ""} ₮`.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
