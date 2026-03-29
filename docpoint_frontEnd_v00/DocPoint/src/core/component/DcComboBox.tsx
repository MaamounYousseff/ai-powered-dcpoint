import { Autocomplete, TextField } from "@mui/material";



export interface DcComboBoxProps {
    options: DcComboBoxOptionProps[],
    placeHolder: string,
    onChange?: (value: string | null) => void;
    additionalClassess?: string
    
}

export interface DcComboBoxOptionProps {
    id: number,
    label: string,
    node: React.ReactNode,
}

function DcComboBox({options, placeHolder, onChange, additionalClassess}: DcComboBoxProps) {
    
    return(
        <>
            <Autocomplete 
                options={options}
                getOptionLabel={(option) => option.label }
                renderInput={(props)=> <TextField {...props}  label={placeHolder} variant="outlined" /> }
                renderOption={(props, option) => <li {...props}  >{option.node}</li>}
                onChange={(event, value) => onChange?.(value?.label ?? null)}
                className= {additionalClassess?additionalClassess : ""}
            />
        </>
    )

}

// Auto complete Framework : 
// 	- list: options ? 
// 	- which field used for filter ? 
// 	- how to render the input ? 	
// 	- how to render the option ? 
// 	- how to retrieve data

export default DcComboBox;
