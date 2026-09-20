function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="search-input"
      placeholder="Поиск по названию или адресу..."
      aria-label="Поиск по названию или адресу"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default SearchBar
