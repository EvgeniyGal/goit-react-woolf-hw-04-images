import SearchBar from './SearchBar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import Loader from './Loader';
import { getPhotoGallery } from '../services/pixabay-api';
import { useEffect, useState } from 'react';

const INITIAL_GALLERY_STATE = {
  galleryPhotos: [],
  page: 0,
  totalHits: 0,
  query: '',
};

const INITIAL_ACTIONS_STATE = {
  currentPhoto: '',
  isModalOpen: false,
  isLoading: false,
};

const INITIAL_ERROR = { isError: false, message: '' };

const PER_PAGE = 12;

async function fetchPhotos(query, page, setActions, error, setError) {
  setActions(prevState => ({ ...prevState, isLoading: true }));
  try {
    const {
      data: { hits, totalHits },
    } = await getPhotoGallery(query, page, PER_PAGE);
    const newPhotos = hits.map(({ id, webformatURL, largeImageURL }) => {
      return { id, webformatURL, largeImageURL };
    });
    if (error.isError) {
      setError(INITIAL_ERROR);
    }
    return { newPhotos, totalHits };
  } catch (error) {
    setError({ isError: true, message: error.message });
  } finally {
    setActions(prevState => ({ ...prevState, isLoading: false }));
  }
}

export default function App() {
  const [galleryState, setGalleryState] = useState(INITIAL_GALLERY_STATE);
  const [actions, setActions] = useState(INITIAL_ACTIONS_STATE);
  const [error, setError] = useState(INITIAL_ERROR);

  async function handleSubmit(query) {
    if (query !== galleryState.query) {
      setGalleryState(() => ({ ...INITIAL_GALLERY_STATE, query, page: 1 }));
    }
  }

  useEffect(() => {
    if (galleryState.page > 0) {
      (async function handleFetch() {
        const fetchData = await fetchPhotos(
          galleryState.query,
          galleryState.page,
          setActions,
          error,
          setError
        );

        if (fetchData) {
          setGalleryState(prevState => ({
            ...prevState,
            galleryPhotos: [...prevState.galleryPhotos, ...fetchData.newPhotos],
            totalHits: fetchData.totalHits,
          }));
        }
      })();
    }
  }, [galleryState.page, galleryState.query, error]);

  async function handleLoadMore() {
    setGalleryState(prevState => ({ ...prevState, page: prevState.page + 1 }));
  }

  function handleModalClose() {
    setActions(prevState => ({ ...prevState, isModalOpen: false }));
  }

  function handleModalOpen(largeImageURL) {
    setActions(prevState => ({
      ...prevState,
      isModalOpen: true,
      currentPhoto: largeImageURL,
    }));
  }

  return (
    <div className="App">
      <SearchBar onSubmit={handleSubmit} />
      {galleryState.galleryPhotos.length > 0 ? (
        <ImageGallery
          onModalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          galleryPhotos={galleryState.galleryPhotos}
        />
      ) : undefined}
      {actions.isLoading && <Loader />}
      {error.isError && <p>{error.message}</p>}
      {galleryState.page < Math.ceil(galleryState.totalHits / PER_PAGE) ? (
        <Button onClick={handleLoadMore}>Load more</Button>
      ) : undefined}
      {actions.isModalOpen && (
        <Modal url={actions.currentPhoto} onModalClose={handleModalClose} />
      )}
    </div>
  );
}
