export type NoteTag =
  | "Todo"
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping"
  | "Other";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}
