import { cnColorPicker } from "@/src/styles/classnames.tailwind"

const AppColors = ['white', 'cornsilk', 'aliceblue','antiquewhite', 'beige']

export type AppColor = typeof AppColors[number]

const styles ={
    height: '45px',
    width: '45px',
    borderRadius: '50%',
    border: '1px solid #ccc'
}  

export const ColorPickerComponent = ({ currColor, onPick } : { currColor: AppColor; onPick: (color: AppColor) => void; }) => {

    return <div>
        <h2 className="m-0 mt-4 text-sm font-bold tracking-tight">Color background</h2>
        <ul className={ cnColorPicker.ul }>
            {
                AppColors.map(color => {
                    return <li 
                        key={ color } 
                        style={{ ...styles, background: color, border:  color === currColor ? '1px solid #555' : styles.border }} 
                        className={ cnColorPicker.li } 
                        onClick={ () => onPick(color) }
                    />
                })
            }
        </ul>
    </div>  
}