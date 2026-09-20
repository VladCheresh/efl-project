function CategoryFilter({ categories, value, onChange }) {
  return (
    <select
      className="select"
      aria-label="Категория"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">Все категории</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  )
}

export default CategoryFilter
