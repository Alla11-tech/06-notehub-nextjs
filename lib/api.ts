import axios from "axios";
import type { AxiosResponse } from "axios";

import type { Note, CreateNotePayload } from "@/types/note";


const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!token) {
  console.warn("NEXT_PUBLIC_NOTEHUB_TOKEN is not set");
}


const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token ?? ""}`;
  return config;
});


export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

/* API FUNCTIONS */

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search?.trim() || undefined,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return response.data;
}


export async function createNote(
  payload: CreateNotePayload
): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post("/notes", payload);
  return response.data;
}


export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
}
