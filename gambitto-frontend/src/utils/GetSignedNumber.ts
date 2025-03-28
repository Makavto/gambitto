export const GetSignedNumber = (number?: number | null): string => {
  if (!number) return "";
  if (number > 0) {
    return "+" + number;
  } else {
    return number.toString();
  }
};
