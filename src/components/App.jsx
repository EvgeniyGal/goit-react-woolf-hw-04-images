import SearchBar from './SearchBar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import Loader from './Loader';
import { getPhotoGallery } from '../services/pixabay-api';
import { useState } from 'react';

const INITIAL_STATE = {
  galleryPhotos: [],
  page: 0,
  totalHits: 0,
  query: '',
};

const INITIAL_ERROR = { isError: false, message: '' };

const PER_PAGE = 12;

async function fetchPhotos(query, page, setIsLoading, error, setError) {
  setIsLoading(true);
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
    setIsLoading(false);
  }
}

export default function App() {
  const [galleryState, setGalleryState] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [error, setError] = useState(INITIAL_ERROR);

  async function handleSubmit(query) {
    const fetchData = await fetchPhotos(
      query,
      1,
      setIsLoading,
      error,
      setError
    );

    if (fetchData) {
      setGalleryState({
        galleryPhotos: fetchData.newPhotos,
        page: 1,
        totalHits: fetchData.totalHits,
        query,
      });
    }
  }

  async function handleLoadMore() {
    const fetchData = await fetchPhotos(
      galleryState.query,
      galleryState.page + 1,
      setIsLoading,
      error,
      setError
    );

    if (fetchData) {
      setGalleryState(prevState => ({
        ...prevState,
        galleryPhotos: [...prevState.galleryPhotos, ...fetchData.newPhotos],
        page: prevState.page + 1,
        totalHits: fetchData.totalHits,
      }));
    }
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleModalOpen(largeImageURL) {
    setCurrentPhoto(largeImageURL);
    setIsModalOpen(true);
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
      {isLoading && <Loader />}
      {error.isError && <p>{error.message}</p>}
      {galleryState.page < Math.ceil(galleryState.totalHits / PER_PAGE) ? (
        <Button onClick={handleLoadMore}>Load more</Button>
      ) : undefined}
      {isModalOpen && (
        <Modal url={currentPhoto} onModalClose={handleModalClose} />
      )}
    </div>
  );
}
