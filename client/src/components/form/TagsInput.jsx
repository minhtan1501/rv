import { useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
export default function TagsInput({ name, onChange,value }) {
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const input = useRef();
  const tagsInput = useRef();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    console.log(value);
    if (value !== ',') setTag(value);
  };

  const handleKeyDown = ({ key }) => {
    if (key === ',' || key === 'Enter') {
      if (!tag) return;
      if (tags.includes(tag)) return setTag('');
      setTags([...tags, tag]);
      setTag('');
    }
    if (key === 'Backspace' && !tag && tags.length) {
      const newTags = tags.filter((_, index) => {
        return tags.length - 1 !== index;
      });
      setTags([...newTags]);
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags([...newTags]);
  };

  const handleFocus = (e) => {
    tagsInput.current.classList.remove(
      'dark:border-dark-subtle',
      'border-light-subtle'
    );
    tagsInput.current.classList.add('dark:border-white', 'border-primary');
  };

  const handleOnBlur = (e) => {
    tagsInput.current.classList.remove('dark:border-white', 'border-primary');
    tagsInput.current.classList.add(
      'dark:border-dark-subtle',
      'border-light-subtle'
    );
  };

  useEffect(() => {
   if(onChange) onChange(tags);
  },[tags]);

  useEffect(() => {
    input.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tag]);
  return (
    <div
      ref={tagsInput}
      className="border-2 bg-transparent 
    dark:border-dark-subtle border-light-subtle 
    px-2 h-10 rounded w-full text-white flex items-center 
    space-x-2 overflow-x-auto custom-scroll-bar transition"
      onKeyDown={handleKeyDown}
    >
      {tags.map((t) => (
        <Tag onClick={() => removeTag(t)} key={t}>
          {t}
        </Tag>
      ))}

      <input
        ref={input}
        type="text"
        name={name}
        className="
        h-full flex-grow bg-transparent 
        outline-none dark:text-white text-primary"
        placeholder="Tag one, Tag two,..."
        value={tag}
        onChange={handleOnChange}
        onFocus={handleFocus}
        onBlur={handleOnBlur}
      />
    </div>
  );
}

const Tag = ({ children, onClick }) => {
  return (
    <span
      className="dark:bg-white bg-primary dark:text-primary
        text-white flex items-center text-sm px-1 whitespace-nowrap"
    >
      {children}
      <button type="button" onClick={onClick}>
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};
