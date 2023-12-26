// FilterModel.jsx

import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { styled } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faRefresh,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import "../css/FilterModel.css";

const SteelBlueSlider = styled(Slider)({
  color: "white",
  "& .MuiSlider-valueLabel": {
    color: "steelblue",
  },
});

const useStyles = makeStyles((theme) => ({
  slider: {
    marginTop: theme.spacing(2),
  },
}));

function FilterModel({
  onClose,
  onApply,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
}) {
  const classes = useStyles();

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
            <SteelBlueSlider
              className={classes.slider}
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={175000}
              color="primary"
            />
            <FontAwesomeIcon icon={faIndianRupeeSign} />
            <span className="price-span">{priceRange[0]}</span>
            <span className="price-span">-</span>
            <FontAwesomeIcon icon={faIndianRupeeSign} />
            <span className="price-span">{priceRange[1]}</span>
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
