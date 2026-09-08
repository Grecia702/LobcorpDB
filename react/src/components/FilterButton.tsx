interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function FilterButton({label, isSelected, onClick}: FilterButtonProps) {
    return(
        <button className={isSelected ? 'btn btn-selected' : 'btn'} onClick={onClick}>
            <p>{label}</p>
        </button>
    )
}