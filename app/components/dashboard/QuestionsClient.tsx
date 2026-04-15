"use client";

import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/app/lib/api-client";

type ApiQuestion = {
  _id: string;
  order: number;
  questionText: string;
  attributeId?: string;
  classid?: string;
  storageKey?: string;
  screenKey?: string;
};

type Feedback =
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const readAxiosMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;
    return message || "Request failed.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed.";
};

const normalizeOrderValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function QuestionsClient() {
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [creating, setCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    _id: "",
    order: "",
    questionText: "",
    attributeId: "",
    classid: "",
  });

  const [editingId, setEditingId] = useState<string>("");
  const [editDraft, setEditDraft] = useState({
    order: "",
    questionText: "",
    attributeId: "",
    classid: "",
  });
  const [savingId, setSavingId] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string>("");

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [questions],
  );

  useEffect(() => {
    let ignore = false;

    const fetchQuestions = async () => {
      setIsLoading(true);
      setFeedback(null);

      try {
        const response = await apiClient.get("/admin/questions");
        const data = response.data as { questions?: ApiQuestion[] };

        if (!ignore) {
          setQuestions(Array.isArray(data.questions) ? data.questions : []);
        }
      } catch (error) {
        if (!ignore) {
          setFeedback({ type: "error", message: readAxiosMessage(error) });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void fetchQuestions();

    return () => {
      ignore = true;
    };
  }, []);

  const beginEdit = (question: ApiQuestion) => {
    setFeedback(null);
    setEditingId(question._id);
    setEditDraft({
      order: String(question.order ?? ""),
      questionText: question.questionText ?? "",
      attributeId: question.attributeId ?? "",
      classid: question.classid ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId("");
    setEditDraft({ order: "", questionText: "", attributeId: "", classid: "" });
  };

  const handleCreate = async () => {
    setFeedback(null);
    const order = normalizeOrderValue(createDraft.order);

    if (!createDraft.questionText.trim()) {
      setFeedback({ type: "error", message: "Question text is required." });
      return;
    }

    if (order == null) {
      setFeedback({ type: "error", message: "Order must be a number." });
      return;
    }

    setCreating(true);

    try {
      const payload = {
        _id: createDraft._id.trim() || undefined,
        order,
        questionText: createDraft.questionText.trim(),
        attributeId: createDraft.attributeId.trim() || undefined,
        classid: createDraft.classid.trim() || undefined,
      };

      const response = await apiClient.post("/admin/questions", payload);
      const data = response.data as { question?: ApiQuestion; questions?: ApiQuestion[] };

      const nextQuestions = Array.isArray(data.questions)
        ? data.questions
        : data.question
          ? [...questions, data.question]
          : questions;

      setQuestions(nextQuestions);
      setCreateDraft({
        _id: "",
        order: "",
        questionText: "",
        attributeId: "",
        classid: "",
      });
      setFeedback({ type: "success", message: "Question created." });
    } catch (error) {
      setFeedback({ type: "error", message: readAxiosMessage(error) });
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async (questionId: string) => {
    setFeedback(null);
    const order = normalizeOrderValue(editDraft.order);

    if (!editDraft.questionText.trim()) {
      setFeedback({ type: "error", message: "Question text is required." });
      return;
    }

    if (order == null) {
      setFeedback({ type: "error", message: "Order must be a number." });
      return;
    }

    setSavingId(questionId);

    try {
      const payload = {
        order,
        questionText: editDraft.questionText.trim(),
        attributeId: editDraft.attributeId.trim() || undefined,
        classid: editDraft.classid.trim() || undefined,
      };

      const response = await apiClient.put(
        `/admin/questions/${encodeURIComponent(questionId)}`,
        payload,
      );
      const data = response.data as { question?: ApiQuestion; questions?: ApiQuestion[] };

      const nextQuestions = Array.isArray(data.questions)
        ? data.questions
        : data.question
          ? questions.map((q) => (q._id === questionId ? data.question! : q))
          : questions;

      setQuestions(nextQuestions);
      setFeedback({ type: "success", message: "Question updated." });
      cancelEdit();
    } catch (error) {
      setFeedback({ type: "error", message: readAxiosMessage(error) });
    } finally {
      setSavingId("");
    }
  };

  const handleDelete = async (question: ApiQuestion) => {
    const confirmed = window.confirm(
      `Delete question \"${question.questionText}\"?\n\nID: ${question._id}`,
    );
    if (!confirmed) {
      return;
    }

    setFeedback(null);
    setDeletingId(question._id);

    try {
      await apiClient.delete(`/admin/questions/${encodeURIComponent(question._id)}`);
      setQuestions((current) => current.filter((q) => q._id !== question._id));

      if (editingId === question._id) {
        cancelEdit();
      }

      setFeedback({ type: "success", message: "Question deleted." });
    } catch (error) {
      setFeedback({ type: "error", message: readAxiosMessage(error) });
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[26px] border border-[#e4ebf2] bg-white shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
        <div className="border-b border-[#ebf0f5] px-5 py-5 sm:px-6">
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#16253a]">
            Create Question
          </h2>
          <p className="mt-1 text-[14px] text-[#738399]">
            Add a new quiz question entry. Keep IDs stable if they are used in submissions.
          </p>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
          <label className="grid gap-1">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6e7e95]">
              ID (optional)
            </span>
            <input
              value={createDraft._id}
              onChange={(event) =>
                setCreateDraft((current) => ({ ...current, _id: event.target.value }))
              }
              placeholder="screen1-age"
              className="rounded-[14px] border border-[#dfe6ef] bg-white px-3 py-3 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6e7e95]">
              Order
            </span>
            <input
              value={createDraft.order}
              onChange={(event) =>
                setCreateDraft((current) => ({ ...current, order: event.target.value }))
              }
              placeholder="1"
              inputMode="numeric"
              className="rounded-[14px] border border-[#dfe6ef] bg-white px-3 py-3 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
            />
          </label>

          <label className="grid gap-1 lg:col-span-2">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6e7e95]">
              Question Text
            </span>
            <input
              value={createDraft.questionText}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  questionText: event.target.value,
                }))
              }
              placeholder="Enter question text..."
              className="rounded-[14px] border border-[#dfe6ef] bg-white px-3 py-3 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6e7e95]">
              Attribute
            </span>
            <input
              value={createDraft.attributeId}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  attributeId: event.target.value,
                }))
              }
              placeholder="age"
              className="rounded-[14px] border border-[#dfe6ef] bg-white px-3 py-3 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6e7e95]">
              Class
            </span>
            <input
              value={createDraft.classid}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  classid: event.target.value,
                }))
              }
              placeholder="screen1-age"
              className="rounded-[14px] border border-[#dfe6ef] bg-white px-3 py-3 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#ebf0f5] px-5 py-5 sm:px-6">
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="rounded-[16px] bg-[linear-gradient(135deg,#18345e_0%,#2e71d0_100%)] px-5 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#e4ebf2] bg-white shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
        <div className="flex flex-col gap-3 border-b border-[#ebf0f5] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#16253a]">
              Questions
            </h2>
            <p className="mt-1 text-[14px] text-[#738399]">
              Click edit to update a question, or delete to remove it.
            </p>
          </div>

          {feedback ? (
            <div
              className={`rounded-[16px] border px-4 py-3 text-[14px] ${
                feedback.type === "success"
                  ? "border-[#cfe8d4] bg-[#f0fbf2] text-[#1f7a34]"
                  : "border-[#f3c5c5] bg-[#fff2f2] text-[#a02424]"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[15px] text-[#718095]">Loading questions...</p>
          </div>
        ) : sortedQuestions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-[26px] font-semibold text-[#17263e]">No questions found</h3>
            <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.6] text-[#718095]">
              Create your first question above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-[#edf2f7] bg-[#fbfcfe]">
                <tr className="text-[12px] uppercase tracking-[0.12em] text-[#6e7e95]">
                  <th className="px-6 py-4 font-semibold">Order</th>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Question</th>
                  <th className="px-6 py-4 font-semibold">Attribute</th>
                  <th className="px-6 py-4 font-semibold">Class</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2f7]">
                {sortedQuestions.map((question) => {
                  const isEditing = editingId === question._id;
                  const isSaving = savingId === question._id;
                  const isDeleting = deletingId === question._id;

                  return (
                    <tr key={question._id} className="text-[14px] text-[#1f2e45]">
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            value={editDraft.order}
                            onChange={(event) =>
                              setEditDraft((current) => ({
                                ...current,
                                order: event.target.value,
                              }))
                            }
                            inputMode="numeric"
                            className="w-20 rounded-[12px] border border-[#dfe6ef] bg-white px-3 py-2 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
                          />
                        ) : (
                          <span className="font-semibold text-[#14253d]">{question.order}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-[10px] bg-[#f3f6fb] px-3 py-1 font-mono text-[13px] text-[#344e75]">
                          {question._id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            value={editDraft.questionText}
                            onChange={(event) =>
                              setEditDraft((current) => ({
                                ...current,
                                questionText: event.target.value,
                              }))
                            }
                            className="w-[520px] max-w-[70vw] rounded-[12px] border border-[#dfe6ef] bg-white px-3 py-2 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
                          />
                        ) : (
                          <p className="max-w-[560px] text-[#273a56]">{question.questionText}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#516077]">
                        {isEditing ? (
                          <input
                            value={editDraft.attributeId}
                            onChange={(event) =>
                              setEditDraft((current) => ({
                                ...current,
                                attributeId: event.target.value,
                              }))
                            }
                            className="w-44 rounded-[12px] border border-[#dfe6ef] bg-white px-3 py-2 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
                          />
                        ) : (
                          question.attributeId || "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#516077]">
                        {isEditing ? (
                          <input
                            value={editDraft.classid}
                            onChange={(event) =>
                              setEditDraft((current) => ({
                                ...current,
                                classid: event.target.value,
                              }))
                            }
                            className="w-44 rounded-[12px] border border-[#dfe6ef] bg-white px-3 py-2 text-[14px] text-[#16253a] outline-none focus:border-[#2e71d0]"
                          />
                        ) : (
                          question.classid || "-"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSave(question._id)}
                                disabled={isSaving}
                                className="rounded-[12px] bg-[#18345e] px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
                              >
                                {isSaving ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={isSaving}
                                className="rounded-[12px] border border-[#dfe6ef] bg-white px-3 py-2 text-[13px] font-semibold text-[#1d3559] transition hover:bg-[#f4f7fb] disabled:opacity-60"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => beginEdit(question)}
                              className="rounded-[12px] border border-[#dfe6ef] bg-white px-3 py-2 text-[13px] font-semibold text-[#1d3559] transition hover:bg-[#f4f7fb]"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(question)}
                            disabled={isDeleting || isSaving}
                            className="rounded-[12px] border border-[#f2c9c9] bg-white px-3 py-2 text-[13px] font-semibold text-[#a02424] transition hover:bg-[#fff2f2] disabled:opacity-60"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

