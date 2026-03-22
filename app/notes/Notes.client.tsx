'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../lib/api';
import Pagination from '../../components/Pagination/Pagination';
import SearchBox from '../../components/SearchBox/SearchBox';
import NoteList from '../../components/NoteList/NoteList';
import NoteForm from '../../components/NoteForm/NoteForm';
import Modal from '../../components/Modal/Modal';
import css from './page.module.css';

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  const { data /*isLoading, isFetched*/ } = useQuery({
    queryKey: ['notes', currentPage, query],
    queryFn: () => fetchNotes(query, currentPage),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setCurrentPage(1);
    },
    300,
  );

  const onClose = () => {
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {modalIsOpen && (
        <Modal onClose={onClose}>
          <NoteForm onClose={onClose} />
        </Modal>
      )}

      {data?.notes && data?.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
