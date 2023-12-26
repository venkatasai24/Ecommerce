// FilterModel.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faRefresh,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import "../css/FilterModel.css";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/system";

const CustomSlider = styled(Slider)({
  color: "white",
  "& .MuiSlider-thumb": {
    backgroundColor: "white",
  },
  "& .MuiSlider-valueLabel": {
    color: "white",
    backgroundColor: "steelblue",
  },
});

function FilterModel({
  onClose,
  onApply,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
}) {
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((c) => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const Categories = [
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting",
  ];

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const resetFilters = () => {
    setPriceRange([0, 175000]);
    setSelectedCategories([]);
  };

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal">
        <h2>Filters</h2>
        <div className="filter-section">
          <h3>Price Range</h3>
          <div className="price-range-icons">
            <CustomSlider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => (
                <span>
                  <FontAwesomeIcon icon={faIndianRupeeSign} />
                  {value}
                </span>
              )}
              min={0}
              max={175000}
            />
          </div>
        </div>
        <div className="filter-section">
          <h3>Categories</h3>
          {Categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
        <div className="filter-buttons">
          <button onClick={onApply}>Apply</button>
          <button title="reset Filters">
            <FontAwesomeIcon icon={faRefresh} onClick={resetFilters} />
          </button>
          <button className="close-filter" title="close" onClick={onClose}>
            {" "}
            <FontAwesomeIcon icon={faRemove} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModel;
