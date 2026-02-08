"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import css from "./NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import { fetchNotes } from "@/lib/api";

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const [debouncedSearch] = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryKey = useMemo(
    () => ["notes", { page, perPage: PER_PAGE, search: debouncedSearch }],
    [page, debouncedSearch]
  );

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
      }),
    placeholderData: (prev) => prev,
  });

  if (isError) {
    // Щоб відпрацював app/notes/error.tsx з ТЗ текстом
    throw error;
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} type="button" onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      {(isLoading || isFetching) && <p>Loading, please wait...</p>}

      {!isLoading && notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
