import { useCallback, useEffect } from 'react';

export default function Modal({ onModalClose, url }) {
  const handleKeydownESC = useCallback(
    event => {
      if (event.key === 'Escape') {
        onModalClose();
      }
    },
    [onModalClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydownESC);
    return () => document.removeEventListener('keydown', handleKeydownESC);
  }, [handleKeydownESC]);

  function handleDropDownClick(event) {
    if (event.target.classList.contains('Overlay')) {
      onModalClose();
    }
  }

  return (
    <div onClick={handleDropDownClick} className="Overlay">
      <div className="Modal">
        <img src={url} alt="Gallery item" />
      </div>
    </div>
  );
}
