import React, { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Submit from '../Submit';

const createArray = (count) => {
  return new Array(count).fill('');
};

const ratings = createArray(10);

export default function RatingForm({ onSubmit, initialState, loading }) {
  const [selectedRating, setSelectedRating] = useState([]);
  const [content, setContent] = useState([]);
  console.log(initialState);
  const handleMouseEnter = (index = 0) => {
    const ratings = createArray(index + 1);
    setSelectedRating([...ratings]);
  };

  const handleOnChange = ({ target }) => {
    setContent(target.value);
  };
  const handleSubmit = () => {
    if (!selectedRating.length) return;
    const data = {
      rating: selectedRating.length,
      content,
    };
    onSubmit && onSubmit(data);
  };
  useEffect(() => {
    if (initialState) {
      setContent(initialState.content);
      const ratings = createArray(initialState.rating);
      setSelectedRating([...ratings]);
    }
  }, [initialState]);
  return (
    <div>
      <div className="p-5 dark:bg-primary bg-white rounded space-y-3">
        <div
          className="
            text-highlight dark:text-highlight-dark 
            flex items-center relative"
        >
          <StarsOutLined ratings={ratings} onMouseEnter={handleMouseEnter} />
          <div className="flex absolute top-1/2 -translate-y-1/2 items-center">
            <StarsFilled
              ratings={selectedRating}
              onMouseEnter={handleMouseEnter}
            />
          </div>
        </div>
        <textarea
          className="
            h-24 w-full border-2 
            p-2 dark:text-white
            text-primary outline-none 
            resize-none bg-transparent"
          onChange={handleOnChange}
          value={content}
        ></textarea>

        <Submit
          loading={loading}
          onClick={handleSubmit}
          value="Rate This Movie"
        />
      </div>
    </div>
  );
}

const StarsOutLined = ({ ratings, onMouseEnter }) => {
  return (
    <>
      {ratings?.map((_, index) => {
        return (
          <AiOutlineStar
            onMouseEnter={() => onMouseEnter(index)}
            className="cursor-pointer"
            key={index}
            size={24}
          />
        );
      })}
    </>
  );
};
const StarsFilled = ({ ratings, onMouseEnter }) => {
  return (
    <>
      {ratings?.map((_, index) => {
        return (
          <AiFillStar
            onMouseEnter={() => onMouseEnter(index)}
            className="cursor-pointer"
            key={index}
            size={24}
          />
        );
      })}
    </>
  );
};
