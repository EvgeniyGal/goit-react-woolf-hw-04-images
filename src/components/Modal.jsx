import { useEffect } from 'react';

export default function Modal({ onModalClose, url }) {
  useEffect(() => {
    function handleKeydownESC(event) {
      if (event.key === 'Escape') {
        onModalClose();
      }
    }

    document.addEventListener('keydown', handleKeydownESC);

    return () => document.removeEventListener('keydown', handleKeydownESC);
  }, [onModalClose]);

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
