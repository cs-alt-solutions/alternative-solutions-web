'use server';

export async function verifyCommandPin(pin: string) {
  const correctPin = process.env.DIVISION_ADMIN_PASSCODE;
  
  // Failsafe: If the environment variable is missing, lock everything down
  if (!correctPin) return false; 
  
  return pin === correctPin;
}