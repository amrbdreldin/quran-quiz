/**
 * Converts Arabic and Persian numerals to Western Arabic (English) numerals.
 * Example: '١٢٣' -> '123', '۱۲۳' -> '123'
 */
export const convertArabicToEnglishNumbers = (str: string): string => {
  if (!str) return str;
  return str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
            .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
};
