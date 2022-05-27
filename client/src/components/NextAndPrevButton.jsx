import React from 'react';

export default function NextAndPrevButton({
  onNextClick,
  onPrevClick,
  className = '',
}) {
  const getClasses = () => {
    return 'flex justify-end items-center space-x-3 mt-5 ';
  };
  return (
    <div className={getClasses() + className}>
      <Button onClick={onPrevClick} title="Prev" />
      <Button onClick={onNextClick} title="Next" />
    </div>
  );
}

const Button = ({ title, onClick }) => {
  return (
    <button
      type="button"
      className="
        dark:text-white 
        text-primary hover:underline"
      onClick={onClick}
    >
      {title}
    </button>
  );
};
