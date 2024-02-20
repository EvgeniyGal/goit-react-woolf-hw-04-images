import { useState } from 'react';

export default function SearchBar({ onSubmit }) {
  const [formState, setFormState] = useState('');

  function handlerSubmitForm(ev) {
    ev.preventDefault();
    if (!formState.trim()) {
      return;
    }
    onSubmit(formState);
  }

  function handlerInput(ev) {
    setFormState(ev.target.value);
  }

  return (
    <header className="Searchbar">
      <form onSubmit={handlerSubmitForm} className="SearchForm">
        <button type="submit" className="SearchForm-button">
          <span className="SearchForm-button-label">Search</span>
        </button>
        <input
          className="SearchForm-input"
          type="text"
          name="query"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={formState}
          onChange={handlerInput}
        />
      </form>
    </header>
  );
}
