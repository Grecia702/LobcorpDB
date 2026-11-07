import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { RiExpandUpDownLine } from "react-icons/ri";

interface SortFields {
    isSelected: boolean,
    sortDirection: string | null,
    onClick: () => void
}

export function SortButton({isSelected, sortDirection, onClick}: SortFields) {

    if(!isSelected) {
        return (
            <button style={{all: 'unset'}} onClick={onClick}>
                <RiExpandUpDownLine color='white'/>
            </button>
        )
    }

    return(
            <button style={{all: 'unset'}}onClick={onClick}> 
                {sortDirection === 'ASC' ? <MdExpandLess color='white'/>  : <MdExpandMore color='white'/> } 
            </button>   
    )
}