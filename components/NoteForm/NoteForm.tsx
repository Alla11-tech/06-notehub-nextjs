
"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import type { CreateNotePayload, NoteTag } from "@/types/note";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  content: Yup.string()
    .trim()
    .max(500, "Content must be at most 500 characters")
    .notRequired(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) =>
        mutate({
          ...values,
          content: values.content?.trim() || "",
        })
      }
    >
      <Form className={css.form}>
        <label className={css.label}>
          Title
          <Field className={css.input} name="title" type="text" />
          <ErrorMessage className={css.error} name="title" component="span" />
        </label>

        <label className={css.label}>
          Content
          <Field className={css.textarea} name="content" as="textarea" />
          <ErrorMessage className={css.error} name="content" component="span" />
        </label>

        <label className={css.label}>
          Tag
          <Field className={css.select} name="tag" as="select">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage className={css.error} name="tag" component="span" />
        </label>

        <div className={css.actions}>
          <button className={css.button} type="submit" disabled={isPending}>
            Create note
          </button>
          <button
            className={css.buttonSecondary}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}
