export const fnCmp = (a: number, b: number) => {
    if (a > b) {
        return 1
    } else if (a < b) {
        return -1
    }
    return 0
}

export const compareNumericArraysOrNumbers = (itemOne: number[] | number, itemTwo: number[] | number) => {

    return  JSON.stringify((typeof itemOne === 'number' ? [itemOne] : itemOne).slice().sort(fnCmp)) 
            !== 
            JSON.stringify((typeof itemTwo === 'number' ? [itemTwo] : itemTwo).slice().sort(fnCmp))
}

export const compareObjects = (itemOne: { [k: string]: any }, itemTwo: { [k: string]: any }) => {

    return  Object.keys(itemOne).reduce((acc, curr) => {
        if (!!acc && itemOne[curr] !== itemTwo[curr]) {
            return false
        }
        return acc
    }, true)
}