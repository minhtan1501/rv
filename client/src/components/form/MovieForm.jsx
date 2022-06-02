import React, { useEffect, useState } from 'react';
import { useNotification } from '../../hooks';
import {
  languageOptions,
  statusOptions,
  typeOptions
} from '../../utils/options';
import { commonInputClass } from '../../utils/theme';
import { validateMovie } from '../../utils/validator';
import DirectorSelector from '../formFiled/DirectorSelector';
import GenresSelector from '../formFiled/GenresSelector';
import Selector from '../formFiled/Selector';
import TagsInput from '../formFiled/TagsInput';
import WriterSelector from '../formFiled/WriterSelector';
import Label from '../Label';
import LabelWithBadge from '../LabelWithBadge';
import CastModal from '../modals/CastModal';
import GenresModal from '../modals/GenresModal';
import WritersModal from '../modals/WritersModal';
import PosterSelector from '../poster/PosterSelector';
import Submit from '../Submit';
import ViewAllBtn from '../ViewAllButton';
import CastForm from './CastForm';

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

export default function MovieForm({ onSubmit,btnTitle, loading,initialState }) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [selectedPosterUI, setSelectedPosterUI] = useState('');
  const [showGenresModal, setShowGenresModal] = useState(false);
  const { updateNotification } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification('error', error);

    //cast, tags, genres, writers
    const { tags, genres, cast, writers, director, poster } = movieInfo;

    const formData = new FormData();
    const finalMovieInfo = {
      ...movieInfo,
    };

    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    const finalCast = cast.map((c) => {
      return {
        actor: c.profile.id,
        roleAs: c.roleAs,
        leadActor: c.leadActor,
      };
    });
    finalMovieInfo.cast = JSON.stringify(finalCast);

    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    if (director.id) {
      finalMovieInfo.director = director.id;
    }

    if (poster) finalMovieInfo.poster = poster;

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    onSubmit(formData);
  };

  const updatePosterForUi = (file) => {
    const img = ['image/jpg', 'image/png', 'image/jpeg'];
    if (!img.includes(file?.type) && file)
      return updateNotification('error', 'Supported only image files');
    const url = URL.createObjectURL(file);
    setSelectedPosterUI(url);
  };

  useEffect(() => {
    if(initialState) {
      setMovieInfo({
        ...initialState,
        releseDate:initialState.releseDate.split("T")[0],
        poster:null});
      setSelectedPosterUI(initialState.poster);
    }
    console.log(initialState)
  },[initialState])

  const {
    title,
    storyLine,
    writers,
    cast,
    tags,
    genres,
    status,
    language,
    type,
    releseDate
  } = movieInfo;
  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === 'poster') {
      const poster = files[0];
      updatePosterForUi(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }
    setMovieInfo({ ...movieInfo, [name]: value });
  };

  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags: tags });
  };

  const updateDirector = (director) => {
    setMovieInfo({ ...movieInfo, director });
  };

  const updateWriter = (profile) => {
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
    const check = cast.filter(
      ({ profile }) => profile.id === newCast.profile.id
    );
    if (check.length)
      return updateNotification('error', 'Actors already exist');
    setMovieInfo({ ...movieInfo, cast: [...cast, newCast] });
  };

  useEffect(() => {
    window.scroll(0,0)
  },[])

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
          <DirectorSelector onSelect={updateDirector} />
          {/* Writers */}
          <div>
            <div className="flex justify-between">
              <LabelWithBadge htmlFor="writers" badge={writers?.length}>
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onClick={displayWritersModal}
                visible={writers?.length}
              >
                View All
              </ViewAllBtn>
            </div>

            <WriterSelector onSelect={updateWriter} />
          </div>

          {/* Cast and crew */}
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast?.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast?.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>
          {/* Relese Date */}
          <div>
            <Label htmlFor="releseDate">Release Date</Label>
            <div>
              <input
                type="date"
                value={releseDate}
                onChange={handleChange}
                name="releseDate"
                className={`${commonInputClass} rounded border-2 p-1 w-auto`}
              />
            </div>
          </div>
          <Submit
            loading={loading}
            value={btnTitle}
            onClick={handleSubmit}
            type="submit"
          />
        </div>
        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            accept="image/jpg, image/png, image/jpeg"
            selectedPoster={selectedPosterUI}
            label="Select poster"
          />
          <GenresSelector badge={genres?.length} onClick={displayGenresModal} />

          <Selector
            onChange={handleChange}
            value={type}
            name="type"
            label="Type"
            options={typeOptions}
          />
          <Selector
            onChange={handleChange}
            value={language}
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
