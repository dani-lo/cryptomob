export const dateToPostgresDateString = (jsDate: Date, readable = false) => {
    
    let day = `${ jsDate.getDate() }`
    let month = `${ jsDate.getMonth() + 1 }`
    let year = jsDate.getFullYear()
    
    if (day.length === 1) {
        day = `0${ day }`
    }
    if (month.length === 1) {
        month = `0${ month }`
    }

    return readable ? `${ year }-${ month }-${ day }` : `${ day }-${ month }-${ year }`
}

export const timestampToDateString = (ts: number, readable = false) => {
    
    let jsDate = new Date(ts)

    return dateToPostgresDateString(jsDate, readable)
}