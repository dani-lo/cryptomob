export const intersects = <T>(arrA: T[], arrB: T[]) => !!arrA.filter(x => arrB.includes(x))
export const intersection = <T>(arrA: T[], arrB: T[]) => arrA.filter(x => arrB.includes(x))