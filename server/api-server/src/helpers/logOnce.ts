function logger()  {
    let logged = false

    return function (str: string) {
        if (!logged) {
            
            logged = true 

            console.log(str)
        }
    }
}