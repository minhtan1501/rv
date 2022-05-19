import React, { useState } from 'react';
import Selector from '../../components/form/Selector';
import Submit from '../../components/form/Submit';
import TagsInput from '../../components/form/TagsInput';
import CastModal from '../../components/modals/CastModal';
import GenresModal from '../../components/modals/GenresModal';
import WritersModal from '../../components/modals/WritersModal';
import PosterSelector from '../../components/poster/PosterSelector';
import { useNotification } from '../../hooks';
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from '../../utils/options';
import { commonInputClass } from '../../utils/theme';
import GenresSelector from '../user/GenresSelector';
import LiveSearch from '../user/LiveSearch';
import CastForm from './CastForm';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from '../../utils/debounce';
import { getToken } from '../../redux/selector';
import searchSlice, { handleSearch } from '../../redux/searchSlice';
// const results = [
//   {
//     name: 'Tan',
//     avatar:
//       'https://res.cloudinary.com/dtvwgsmrq/image/upload/v1651746615/baocao/obpd9zdoq6ctn4gep8kz.jpg',
//     id: 1,
//   },
//   {
//     name: 'Tannn',
//     avatar:
//       'https://res.cloudinary.com/dtvwgsmrq/image/upload/v1651746615/baocao/obpd9zdoq6ctn4gep8kz.jpg',
//     id: 2,
//   },
//   {
//     name: 'Tannnnn',
//     avatar:
//       'https://res.cloudinary.com/dtvwgsmrq/image/upload/v1651746615/baocao/obpd9zdoq6ctn4gep8kz.jpg',
//     id: 3,
//   },
//   {
//     name: 'Tannnnnn',
//     avatar:
//       'https://res.cloudinary.com/dtvwgsmrq/image/upload/v1651746615/baocao/obpd9zdoq6ctn4gep8kz.jpg',
//     id: 4,
//   },
// ];

const defaultMovieInfo = {
  title: '',
  storyLine: '',
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releseDate: '',
  poster: null,
  genres: [],
  type: '',
  language: '',
  status: '',
};

export default function MovieForm() {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [selectedPosterUI, setSelectedPosterUI] = useState('');
  const [showGenresModal, setShowGenresModal] = useState(false);
  const dispatch = useDispatch();
  const debounceSearch = debounce(dispatch, 500);
  const token = useSelector(getToken);
  const [writerName,setWriterName] = useState('')
  const { updateNotification } = useNotification();
  const { searching, results } = useSelector((state) => state.search);
  const [writerPoster,setWriterPoster] = useState([])
  const [directorPoster,setDirectorPoster] = useState([])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(movieInfo);
  };
  const renderItem = (result) => {
    return (
      <div className="flex space-x-2 rounded overflow-hidden">
        <img
          className="w-16 h-16 object-cover"
          src={result.avatar}
          alt={result.name}
        />
        <p className="dark:text-white font-semibold">{result.name}</p>
      </div>
    );
  };

  const updatePosterForUi = (file) => {
    const img = ['image/jpg', 'image/png', 'image/jpeg'];
    if (!img.includes(file?.type))
      return updateNotification('error', 'Supported only image files');
    const url = URL.createObjectURL(file);
    setSelectedPosterUI(url);
  };

  
  const {
    title,
    storyLine,
    director,
    writers,
    cast,
    tags,
    genres,
    status,
    laguage,
    type,
  } = movieInfo;

  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === 'poster') {
      const poster = files[0];
      updatePosterForUi(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }
    if(name === 'writers') return setWriterName(value)
    setMovieInfo({ ...movieInfo, [name]: value });
  };

  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags: [...tags] });
  };

  const updateDiretor = (director) => {
    setMovieInfo({ ...movieInfo, director });
    dispatch(searchSlice.actions.resetSearch())
  };

  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          'warning',
          'This profile is already selected!'
        );
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };
  
  const hideWritersModal = () => {
    setShowWritersModal(false);
  };
  
  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };


  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };


  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const handleRemoveWriter = (id) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter((w) => w.id !== id);
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  const handleRemoveCast = (id) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== id);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  const updateCast = (newCast) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, newCast] });
  };

  const handleProfileChange = ({ target }) => {
    const {value,name} = target;
    if(name === 'director'){
      setMovieInfo({ ...movieInfo, director: { name: value } });
      debounceSearch(handleSearch({ query: value, token,updaterFuc: setDirectorPoster }));
    
    }

    if(name === 'writers') {
      setWriterName(value);
      debounceSearch(handleSearch({ query: value, token,updaterFuc: setWriterPoster }));

    }

    console.log(writerPoster)

  };
  return (
    <>
      <div onSubmit={handleSubmit} className="flex space-x-3">
        <div className="w-[70%] space-y-5">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              type="text"
              className={'border-b-2 font-semibold text-xl ' + commonInputClass}
              placeholder="Game of Thrones"
            />
          </div>
          {/* Story Line */}
          <div>
            <Label htmlFor="storyLine">Story Line</Label>
            <textarea
              id="storyLine"
              value={storyLine}
              name="storyLine"
              onChange={handleChange}
              placeholder="Movie story line"
              className={commonInputClass + ' resize-none h-24 border-b-2'}
            ></textarea>
          </div>
          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput name="tags" value={tags} onChange={updateTags} />
          </div>
          {/* {Director} */}
          <div>
            <Label htmlFor="director">Director</Label>

            <LiveSearch
              name="director"
              results={directorPoster}
              renderItem={renderItem}
              placeholder="Search profile"
              onSelect={updateDiretor}
              value={director.name}
              onChange={handleProfileChange}
              visible={directorPoster.length}
            />
          </div>
          {/* Writers */}
          <div>
            <div className="flex justify-between">
              <LabelWithBadge htmlFor="writers" badge={writers.length}>
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllBtn>
            </div>

            <LiveSearch
              name="writers"
              results={writerPoster}
              renderItem={renderItem}
              placeholder="Search profile"
              onSelect={updateWriters}
              onChange={handleProfileChange}
              value={writerName}
              visible={writerPoster.length}
            />
          </div>

          {/* Cast and crew */}
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm
              onSubmit={updateCast}
            />
          </div>
          {/* Relese Date */}
          <div>
            <Label htmlFor="releseDate">Release Date</Label>
            <div>
              <input
                type="date"
                onChange={handleChange}
                name="releseDate"
                className={`${commonInputClass} rounded border-2 p-1 w-auto`}
              />
            </div>
          </div>
          <Submit value="Upload" onClick={handleSubmit} type="submit" />
        </div>
        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            accept="image/jpg, image/png, image/jpeg"
            selectedPoster={selectedPosterUI}
            label="Select poster"
          />
          <GenresSelector badge={genres.length} onClick={displayGenresModal} />

          <Selector
            onChange={handleChange}
            value={type}
            name="type"
            label="Type"
            options={typeOptions}
          />
          <Selector
            onChange={handleChange}
            value={laguage}
            name="language"
            label="Language"
            options={languageOptions}
          />
          <Selector
            onChange={handleChange}
            value={status}
            name="status"
            label="Status"
            options={statusOptions}
          />
        </div>
      </div>
      <WritersModal
        onClose={hideWritersModal}
        visible={showWritersModal}
        profiles={writers}
        onRemoveClick={handleRemoveWriter}
      />
      <CastModal
        onClose={hideCastModal}
        visible={showCastModal}
        casts={cast}
        onRemoveClick={handleRemoveCast}
      />
      <GenresModal
        onSubmit={updateGenres}
        visible={showGenresModal}
        onClose={hideGenresModal}
        genres={genres}
        previousSelection={genres}
      />
    </>
  );
}

const Label = ({ children, htmlFor }) => {
  return (
    <label
      className="dark:text-dark-subtle text-light-subtle
          font-semibold"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

const LabelWithBadge = ({ children, htmlFor, badge }) => {
  const renderBadge = () => {
    return (
      <span
        className="dark:bg-dark-subtle 
    bg-light-subtle absolute top-0 right-0 w-5 h-5 
    rounded-full flex justify-center items-center
    translate-x-2 -translate-y-1 text-xs
    "
      >
        {badge <= 9 ? badge : '9+'}
      </span>
    );
  };
  return (
    <div className="relative">
      <Label htmlFor={htmlFor}>{children}</Label>
      {badge ? renderBadge() : null}
    </div>
  );
};

const ViewAllBtn = ({ children, onClick, visible }) => {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="
  dark:text-white text-primary 
    hover:underline transtion"
    >
      {children}
    </button>
  );
};
