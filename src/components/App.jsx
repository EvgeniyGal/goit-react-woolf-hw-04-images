import SearchBar from './SearchBar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import Loader from './Loader';
import { getPhotoGallery } from '../services/pixabay-api';
import { useEffect, useState } from 'react';

const PER_PAGE = 12;

export default function App() {
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalHints, setTotalHints] = useState(0);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(newQuery) {
    if (newQuery !== query) {
      setGalleryPhotos([]);
      setQuery(newQuery);
      setPage(1);
    }
  }

  useEffect(() => {
    if (page > 0) {
      (async function fetchData() {
        try {
          setIsLoading(true);
          const {
            data: { hits, totalHits },
          } = await getPhotoGallery(query, page, PER_PAGE);
          setGalleryPhotos(prevState => [...prevState, ...hits]);
          setTotalHints(totalHits);
          setError('');
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [page, query]);

  async function handleLoadMore() {
    setPage(prevState => prevState + 1);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleModalOpen(largeImageURL) {
    setIsModalOpen(true);
    setCurrentPhoto(largeImageURL);
  }

  return (
    <div className="App">
      <SearchBar onSubmit={handleSubmit} />
      {galleryPhotos.length > 0 ? (
        <ImageGallery
          onModalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          galleryPhotos={galleryPhotos}
        />
      ) : undefined}
      {isLoading && <Loader />}
      {error && <p>{error}</p>}
      {page < Math.ceil(totalHints / PER_PAGE) ? (
        <Button onClick={handleLoadMore}>Load more</Button>
      ) : undefined}
      {isModalOpen && (
        <Modal url={currentPhoto} onModalClose={handleModalClose} />
      )}
    </div>
  );
}
