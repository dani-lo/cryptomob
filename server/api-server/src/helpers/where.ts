export const whereArrayInValues = (arrayIn: any[]) => {
    return JSON.stringify(arrayIn).replace('[', '(').replace(']', ')')
}