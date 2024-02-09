interface Props {
    value: string;
    checked: boolean;
    label: string;
    desc: string;
    onChange: () => void
}

export const RadioInputComponent = () => {

}

export const CheckboxInputComponent = ({ value, checked, label, desc, onChange }: Props) => {
    
    const inputId = label.replace(/\s/g, '')

    return <div className="flex chekbox-input" style={{ width: '330px'}}>
    <div className="flex items-center h-5">
        <input 
            type="checkbox" 
            id={ inputId }
            value={ value }
            checked={ checked } 
            onChange = { onChange }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" 
        />
    </div>
    <div className="ml-2 text-sm">
        <label 
            htmlFor={ inputId } 
            className="font-medium text-gray-900 dark:text-gray-300">
                { label }
        </label>
        <p id="helper-checkbox-text" className="text-xs font-normal text-gray-500 dark:text-gray-300">{ desc }</p>
    </div>
</div>
}