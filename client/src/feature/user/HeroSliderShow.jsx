import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import { getLatestUploads } from '../../api/movie';
import { useNotification } from '../../hooks';
import { parseError } from '../../utils/helper';
import { Link } from 'react-router-dom';
let count = 0;

export default function HeroSliderShow() {
  const [currentSlide, setCurrentSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [clonedSlide, setClonedSlide] = useState({});
  const [visible, setVisible] = useState(true);
  const [upNext, setUpNext] = useState([]);
  const sliderRef = useRef();
  const clonedSliderRef = useRef();
  const timeId = useRef();
  const { updateNotification } = useNotification();

  const fetchLatestUploads = async () => {
    try {
      const { movies } = await getLatestUploads();
      setSlides([...movies]);
      setCurrentSlide(movies[0]);
    } catch (error) {
      updateNotification('error', parseError(error));
    }
  };

  const startSlideShow = () => {
    timeId.current = setInterval(handleOnNextClick, 3500);
  };

  const pauseSlideShow = () => {
    clearInterval(timeId.current);
  };

  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;

    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;

    let newSlides = [...slides];

    newSlides = newSlides.slice(upNextCount, end);

    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }

    setUpNext([...newSlides]);
  };

  const handleOnNextClick = () => {
    pauseSlideShow();
    setClonedSlide(slides[count]);
    clonedSliderRef.current?.classList.remove('hidden');
    count = (count + 1) % slides.length;
    setCurrentSlide(slides[count]);

    clonedSliderRef.current?.classList.add('slide-out-to-left');
    sliderRef.current?.classList.add('slide-in-from-right');

    updateUpNext(count);
  };

  const handleOnPreClick = () => {
    pauseSlideShow();
    setClonedSlide(slides[count]);
    clonedSliderRef.current.classList.remove('hidden');
    count = (count + slides.length - 1) % slides.length;
    setCurrentSlide(slides[count]);

    clonedSliderRef.current.classList.add('slide-out-to-right');
    sliderRef.current.classList.add('slide-out-from-left');
    updateUpNext(count);
  };

  const handleAnimationEnd = () => {
    clonedSliderRef.current.classList.add('hidden');

    // next click
    sliderRef.current.classList.remove('slide-in-from-right');
    clonedSliderRef.current.classList.remove('slide-in-from-right');
    // prev click
    clonedSliderRef.current.classList.remove('slide-out-to-right');
    sliderRef.current.classList.remove('slide-out-from-left');
    setClonedSlide({});
    startSlideShow();
  };

  const handleOnVisibilityChange = () => {
    const visibility = document.visibilityState;
    if (visibility === 'hidden') setVisible(false);
    if (visibility === 'visible') setVisible(true);
  };

  useEffect(() => {
    fetchLatestUploads();
    document.addEventListener('visibilitychange', handleOnVisibilityChange);
    return () => {
      pauseSlideShow();
      document.removeEventListener(
        'visibilitychange',
        handleOnVisibilityChange
      );
    };
  }, []);

  useEffect(() => {
    if (slides.length && visible) {
      startSlideShow();
      updateUpNext(count);
    } else {
      pauseSlideShow();
    }
  }, [slides.length, visible]);

  return (
    <div className="w-full flex ">
      <div className="w-4/5 aspect-video relative overflow-hidden">
        {/* current slide */}
        <Slide
          title={currentSlide.title}
          src={currentSlide.poster}
          ref={sliderRef}
          id={currentSlide.id}
        />
        {/* cloned slide */}
        <Slide
          onAnimationEnd={handleAnimationEnd}
          ref={clonedSliderRef}
          className="aspect-video object-cover absolute inset-0"
          src={clonedSlide.poster}
          title={clonedSlide.title}
          id={currentSlide.id}
        />

        <SlideShowController
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPreClick}
        />
      </div>
      <div className="w-1/5 space-y-3 px-3">
        <h1
          className="
        font-semibold text-2xl 
        text-primary dark:text-white"
        >
          Up next
        </h1>
        {upNext?.map(({ poster, id }) => {
          return (
            <img
              key={id}
              src={poster}
              className="object-cover aspect-video rounded"
              alt=""
            />
          );
        })}
      </div>
    </div>
  );
}

const SlideShowController = ({ onPrevClick, onNextClick }) => {
  const btnClass =
    'bg-primary rounded border-2 text-white text-xl p-2 outline-none';
  return (
    <div
      className="
          absolute top-1/2 
          -translate-y-1/2 w-full px-2
          flex justify-between items-center"
    >
      <button onClick={onPrevClick} className={btnClass} type="button">
        <AiOutlineDoubleLeft />
      </button>
      <button onClick={onNextClick} className={btnClass} type="button">
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};

const Slide = forwardRef((props, ref) => {
  const { title, src, className = '', id, ...rest } = props;
  return (
    <Link to={'/movie/' + id}>
      <div ref={ref} className={'cursor-pointer w-full block ' + className} {...rest}>
        {src ? (
          <img className="aspect-video object-cover" src={src} alt="" />
        ) : null}
        {title ? (
          <div
            className="
          absolute inset-0 flex 
          flex-col justify-end p-3
          bg-gradient-to-t from-white dark:from-primary"
          >
            <h1
              className="
              font-semibold text-4xl 
              dark:text-highlight-dark
              text-highlight 
              "
            >
              {title}
            </h1>
          </div>
        ) : null}
      </div>
    </Link>
  );
});
