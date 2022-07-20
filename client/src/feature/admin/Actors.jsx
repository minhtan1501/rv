import React, { useEffect, useState } from 'react';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { deleteActor, getActors, searchActor } from '../../api/actor';
import AppSearchForm from '../../components/form/AppSearchForm';
import ConfirmModal from '../../components/modals/ConfirmModal';
import UpdateActor from '../../components/modals/UpdateActor';
import NextAndPrevButton from '../../components/NextAndPrevButton';
import NotFoundText from '../../components/NotFoundText';
import { useNotification, useSearch } from '../../hooks';
import searchSlice from '../../redux/searchSlice';
import { getToken } from '../../redux/selector';

let currentPageNo = 0;
const limit = 9;

function Actors() {
  const token = useSelector(getToken);
  const [actors, setActors] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [results, setResults] = useState([]);
  const [loading,setLoading] = useState(false);
  const { updateNotification } = useNotification();

  const dispatch = useDispatch();
  const debounceSearch = useSearch();
  const { resultNotFound } = useSelector((state) => state.search);

  const fetchActors = async (page) => {
    try {
      const { profile } = await getActors(page, limit, token);
      setActors([...profile]);
      if (!profile.length) {
        currentPageNo = page - 1;
        return setReachedToEnd(true);
      }
    } catch (e) {
      updateNotification('error', e);
    }
  };

  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchActors(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchActors(currentPageNo);
  };

  const handleOnEditClick = (profile) => {
    setSelectedProfile(profile);
    setShowUpdateModal(true);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleOnActorUpdate = (profile) => {
    const updateActors = actors.map((actor) => {
      if (profile.id === actor.id) {
        return profile;
      }
      return actor;
    });
    setActors([...updateActors]);
  };

  const handleOnSearchSubmit = (value) => {
    debounceSearch({
      query: value,
      token,
      search: searchActor,
      updaterFuc: setResults,
    });
  };
  const handleSearchFormReset = () => {
    setResults([]);
    dispatch(searchSlice.actions.resetSearch());
  };

  const handleOnDeleteClick = (profile) => {
    setSelectedProfile(profile);
    setShowConfirmModal(true);
  };

  const hideConfirmModal = () => {
    setSelectedProfile(null)
    setShowConfirmModal(false);
  }

  const handleOnDeleteConfirm = async() => {
      try {
        setLoading(true);
        const {message} = await deleteActor(selectedProfile.id,token)
        if(message) updateNotification('success',message);
        setSelectedProfile(null)
        hideConfirmModal()
        fetchActors(currentPageNo)
        setLoading(false);
    }
    catch(err) {
      setLoading(false);
      updateNotification('error',err)
    }   
  };

  return (
    <>
      <div className="p-5">
        <div className="justify-end flex mb-5">
          <AppSearchForm
            placeholder="Search Actors..."
            onSubmit={handleOnSearchSubmit}
            showResetIcon={results.length || resultNotFound}
            onReset={handleSearchFormReset}
          />
        </div>
        <NotFoundText text="Record not found" visible={resultNotFound} />
        <div className="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
          {results.length || resultNotFound
            ? results?.map((p) => {
                return (
                  <ActorProfile
                    onEditClick={() => handleOnEditClick(p)}
                    onDeleteClick={() => handleOnDeleteClick(p)}
                    profile={p}
                    key={p.id}
                  />
                );
              })
            : actors?.map((p) => {
                return (
                  <ActorProfile
                    onEditClick={() => handleOnEditClick(p)}
                    profile={p}
                    key={p.id}
                    onDeleteClick={() => handleOnDeleteClick(p)}
                  />
                );
              })}
        </div>

        {!results.length && !resultNotFound ? (
          <NextAndPrevButton
            className="mt-5"
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
          />
        ) : null}
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        subTitle="This action will remove this profile permanently!"
        loading={loading}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
      />

      <UpdateActor
        initialState={selectedProfile}
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        onSuccess={handleOnActorUpdate}
      />
    </>
  );
}

export default Actors;

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;

  const handleOnMouseEnter = (e) => {
    setShowOptions(true);
  };

  const handleOnMouseLeave = (e) => {
    setShowOptions(false);
  };

  if (!profile) return null;

  const getName = (name) => {
    if (name?.length <= acceptedNameLength) return name;

    return name.substring(0, acceptedNameLength) + '...';
  };

  const { name, avatar, about = '' } = profile;

  return (
    <div
      className="
      bg-white shadow dark:shadow
      dark:bg-secondary rounded
      h-20 overflow-hidden 
      "
    >
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img
          src={avatar}
          alt={name}
          className="w-20 aspect-square object-cover"
        />
        <div className="px-2 ">
          <h1
            className="
            text-xl text-primary 
            dark:text-white font-semibold
            whitespace-nowrap"
          >
            {getName(name)}
          </h1>
          <p className="text-primary dark:text-white opacity-70">
            {about.substring(0, 50)}
          </p>
        </div>

        <Options
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          visible={showOptions}
        />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick = null, onEditClick = null }) => {
  if (!visible) return null;

  return (
    <div
      className="
    absolute inset-0 
    bg-primary bg-opacity-25 
    backdrop-blur-sm
    flex justify-center items-center
    space-x-5 "
    >
      <button
        type="button"
        className="
        p-2 rounded-full
        hover:opacity-80 transition 
        bg-white text-primary"
        onClick={onDeleteClick}
      >
        <BsTrash />
      </button>
      <button
        type="button"
        className="
        p-2 rounded-full
        hover:opacity-80 transition 
        bg-white text-primary"
        onClick={onEditClick}
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};
