import React from 'react';

const commonPosterUIClass = `
flex justify-center items-center 
border border-dashed rounded 
aspect-video dark:border-dark-subtle 
border-light-subtle cursor-pointer `;

export default function PosterSelector({
  name,
  accept,
  selectedPoster,
  onChange,
  className,
  label
}) {
  return (
    <div>
      <input
        accept={accept}
        onChange={onChange}
        name={name}
        id={name}
        type="file"
        hidden
        multiple
      />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            className={commonPosterUIClass + ' object-cover ' + className}
            src={selectedPoster}
            alt=""
          />
        ) : (
          <PosterUI label={label}  className={className}/>
        )}
      </label>
    </div>
  );
}

const PosterUI = ({className,label}) => {
  return (
    <div className={commonPosterUIClass + className}>
      <span className="dark:text-dark-subtle text-light-subtle">
        {label}
      </span>
    </div>
  );
};
