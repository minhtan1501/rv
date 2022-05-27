import { forwardRef, useEffect, useRef, useState } from 'react';
import { commonInputClass } from '../../utils/theme';

export default function LiveSearch({
  results = [],
  selectedResulStyle,
  resultContainerStyle,
  renderItem = null,
  value = '',
  onChange = null,
  placeholder = '',
  onSelect = null,
  inputStyle,
  name,
  visible,
}) {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const handleFocus = (e) => {
    if (results.length) setDisplaySearch(true);
  };

  const closeSearch = () => {
    setDisplaySearch(false);
    setFocusIndex(-1);
  };

  const handleBlur = () => {
    setTimeout(() => {
      closeSearch();
    }, 150);
  };

  const handleSelection = (selectedItem) => {
    if (selectedItem) {
      onSelect(selectedItem);
      closeSearch();
    }
  };

  const handleKeyDown = ({ key }) => {
    let nextCount = focusIndex;
    const keys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
    if (!keys.includes(key)) return;

    //move selection up and down
    if (key === 'ArrowDown') {
      nextCount = (nextCount + 1) % results.length;
    }
    if (key === 'ArrowUp') {
      nextCount = (nextCount + results.length - 1) % results.length;
    }
    if (key === 'Enter') return handleSelection(results[focusIndex]);
    if (key === 'Escape') return closeSearch();
    setFocusIndex(nextCount);
  };

  const getInputStyle = () => {
    return inputStyle
      ? inputStyle
      : `${commonInputClass} border-2 p-1 rounded text-lg`;
  };

  useEffect(() => {
    if (results.length) return setDisplaySearch(true);
    setDisplaySearch(false);
  }, [results.length]);

  return (
    <div className="relative">
      <input
        onKeyDown={handleKeyDown}
        onFocus={(e) => handleFocus(e)}
        onBlur={handleBlur}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={getInputStyle()}
        name={name}
        id={name}
        autoComplete="off"
      />
      <SearchResults
        focusIndex={focusIndex}
        visible={displaySearch}
        results={results}
        onSelect={handleSelection}
        renderItem={renderItem}
        resultContainerStyle={resultContainerStyle}
        selectedResulStyle={selectedResulStyle}
      />
    </div>
  );
}

const SearchResults = ({
  visible,
  results = [],
  focusIndex,
  onSelect,
  renderItem,
  selectedResulStyle,
  resultContainerStyle,
}) => {
  const resultContainer = useRef();
  useEffect(() => {
    resultContainer.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [focusIndex]);

  if (!visible) return null;
  return (
    <div
      className={`
      z-50 absolute right-0 left-0 top-10 bg-white dark:bg-secondary
        shadow-md p-2 max-h-64 space-y-2 overflow-auto mt-1 custom-scroll-bar`}
    >
      {results.map((result, index) => {
        const getSelectedClass = () => {
          return selectedResulStyle
            ? selectedResulStyle
            : 'dark:bg-dark-subtle bg-light-subtle';
        };

        return (
          <ResultCard
            ref={index === focusIndex ? resultContainer : null}
            key={index.toString()}
            item={result}
            renderItem={renderItem}
            resultContainerStyle={resultContainerStyle}
            selectedResulStyle={index === focusIndex ? getSelectedClass() : ''}
            onClick={() => onSelect(result)}
          />
        );
      })}
    </div>
  );
};

const ResultCard = forwardRef((props, ref) => {
  const {
    item,
    renderItem,
    selectedResulStyle,
    resultContainerStyle,
    onClick,
  } = props;
  const getClasses = () => {
    if (resultContainerStyle)
      return resultContainerStyle + ' ' + selectedResulStyle;
    return (
      selectedResulStyle +
      '  cursor-pointer rounded overflow-hide dark:hover:bg-dark-subtle hover:bg-light-subtle transition flex space-x-2'
    );
  };

  return (
    <div ref={ref} onClick={onClick} className={getClasses()}>
      {renderItem(item)}
    </div>
  );
});
