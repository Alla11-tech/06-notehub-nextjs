import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

export default function NoteList({
  notes,
}: {
  notes: Note[];
}) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.tag}>{note.tag}</p>

          <div className={css.actions}>
            {/* ✅ ДОДАЛИ */}
            <Link className={css.detailsLink} href={`/notes/${note.id}`}>
              View details
            </Link>

            {/* твоя існуюча кнопка Delete */}
            {/* <button ...>Delete</button> */}
          </div>
        </li>
      ))}
    </ul>
  );
}
