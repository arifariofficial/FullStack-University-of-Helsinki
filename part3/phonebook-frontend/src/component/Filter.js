const Filter = ({ filter, setFilter, setShowAll }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setShowAll(false);
  };

  return (
    <div>
      <p>
        filter shown with
        <input type="text" value={filter} onChange={handleFilterChange} />
      </p>
    </div>
  );
};

export default Filter;
