function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Поиск по названию или адресу..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default SearchBar
