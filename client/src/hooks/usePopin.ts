import { useEffect, useState } from "react"

export const usePopin = () => {

    let [cname, setCName] = useState('popin popin-hide')

    useEffect(() => {

        const _to = setTimeout(() => setCName((curr) => curr === 'popin popin-show' ? 'popin popin-hide' : 'popin popin-show'), 50)

        return () => {
            if (_to) {
                clearTimeout(_to)
            }
        }
    }, [])

    return [cname, setCName]
}