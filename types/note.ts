
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string; // ✅ вимога
}

export interface CreateNotePayload {
  title: string;
  content?: string; // ✅ content optional
  tag: NoteTag;
}

