function generateOTP(length: number = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

function generateExpiryMinutes(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export { generateOTP, generateExpiryMinutes };
