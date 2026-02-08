"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";
import type { NoteTag } from "@/types/note";
import { createNote, type CreateNotePayload } from "@/lib/api";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required").min(2, "Too short"),
  content: Yup.string().trim().required("Content is required").min(2, "Too short"),
  tag: Yup.string().required("Tag is required"),
});

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: async () => {
      // Після створення — оновлюємо список нотаток
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => mutate(values)}
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
            <option value="Other">Other</option>
          </Field>
          <ErrorMessage className={css.error} name="tag" component="span" />
        </label>

        <div className={css.actions}>
          <button className={css.button} type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </button>
          <button className={css.buttonSecondary} type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}
