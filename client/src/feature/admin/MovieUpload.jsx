import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { uploadTrailer } from '../../api/movie';
import ModalContainer from '../../components/modals/ModalContainer';
import { useNotification } from '../../hooks/index';
import { getToken } from '../../redux/selector';
import MovieForm from './MovieForm';
function MovieUpload({visible, onClose}) {
  const { updateNotification } = useNotification();
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploader, setVideoUploader] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState({});
  const [movieInfo, setMovieInfo] = useState({
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
    trailer: {
      url: '',
      public_id: '',
    },
  });
  const token = useSelector(getToken);
  
  const handleTypeError = (e) => {
    updateNotification('error', e);
  };
 
  const handleUploadTrailer = async (data) => {
    try {
      const result = await uploadTrailer(data,token, setUploadProgress);
      if (result) {
        setVideoUploader(true);
      }
      const { url, public_id } = result;
      setVideoInfo(url, public_id);
    } catch (error) {
      updateNotification('error', error);
    }
  };
 
  const handleChange = (file) => {
    const formData = new FormData();
    formData.append('video', file);
    setVideoSelected(true);
    handleUploadTrailer(formData);
 
  };
  const getUploadProgressValue = () => {
    if (!videoUploader && uploadProgress >= 100) {
      return 'Processing';
    }
    return `Upload progress ${uploadProgress}`;
  };

  
  useEffect(() => {
    window.scroll(0,0)
  },[visible])


  return (
   <ModalContainer visible={visible} onClose={onClose}>
     {/* <UpLoadProgress
       visible={!videoUploader && videoSelected}
       message={getUploadProgressValue()}
       width={uploadProgress}
     />
     <TrailerSelector
       visible={!videoSelected}
       onTypeError={handleTypeError}
       handleChange={handleChange}
     /> */}
     <MovieForm/>
   </ModalContainer>
  );
}

export default MovieUpload;

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;
  return (
    <div className="h-full flex items-center justify-center">
      <FileUploader
        onTypeError={onTypeError}
        handleChange={handleChange}
        types={['mp4', 'avi']}
      >
        <div
          className="w-48 h-48 border border-dashed 
            dark:border-dark-subtle border-light-subtle
            rounded-full flex items-center justify-center flex-col
            dark:text-dark-subtle text-secondary cursor-pointer"
        >
          <AiOutlineCloudUpload size={80} />
          <p>Drop your file here!</p>
        </div>
      </FileUploader>
    </div>
  );
};

const UpLoadProgress = ({ width, message, visible }) => {
  if (!visible) return null;
  return (
    <div className="p-2">
      <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
        <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hide">
          <div
            style={{ width: width + '%' }}
            className="h-full left-0 absolute dark:bg-white bg-secondary"
          />
        </div>
        <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1">
          {message}
        </p>
      </div>
    </div>
  );
};
