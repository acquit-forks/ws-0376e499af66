export type Line = { amount: number };

// ISO 4217 List One, maintained by SIX on behalf of the ISO 4217 Maintenance
// Agency. CcyMnrUnts is the number of decimal digits in a currency's minor unit.
// https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml
const MINOR_UNIT_GROUPS = [
  [0, 'BIF CLP DJF GNF ISK JPY KMF KRW PYG RWF UGX UYI VND VUV XAF XOF XPF'],
  [2, `AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BMD BND BOB BOV
    BRL BSD BTN BWP BYN BZD CAD CDF CHE CHF CHW CNY COP COU CRC CUC CUP CVE CZK
    DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD GTQ GYD HKD HNL HTG
    HUF IDR ILS INR IRR JMD KES KGS KHR KPW KYD KZT LAK LBP LKR LRD LSL MAD MDL
    MGA MKD MMK MNT MOP MRU MUR MVR MWK MXN MXV MYR MZN NAD NGN NIO NOK NPR NZD
    PAB PEN PGK PHP PKR PLN QAR RON RSD RUB SAR SBD SCR SDG SEK SGD SHP SLE SOS
    SRD SSP STN SVC SYP SZL THB TJS TMT TOP TRY TTD TWD TZS UAH USD USN UYU UZS
    VED VES WST XCD XCG YER ZAR ZMW ZWG`],
  [3, 'BHD IQD JOD KWD LYD OMR TND'],
  [4, 'CLF UYW'],
] as const;

const CURRENCY_MINOR_UNITS = new Map(
  MINOR_UNIT_GROUPS.flatMap(([minorUnits, currencies]) =>
    currencies.split(/\s+/).map(currency => [currency, minorUnits] as const),
  ),
);

export function formatTotal(lines: Line[], currency: string): string {
  const code = currency.toUpperCase();
  const minorUnits = CURRENCY_MINOR_UNITS.get(code);

  // ISO 4217 also defines codes whose minor unit is "N.A."; neither those nor
  // unknown codes have a principled default number of fractional digits.
  if (minorUnits === undefined) {
    throw new RangeError(`Currency has no defined ISO 4217 minor unit: ${currency}`);
  }

  const sum = lines.reduce((total, line) => total + line.amount, 0);
  return sum.toFixed(minorUnits);
}
