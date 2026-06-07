"use client";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
  useEffect,
} from "react";

export function MessageInput({
  disabled,
  onSend,
  candidates,
  registerTextSetter,
}: {
  disabled?: boolean;
  onSend: (text: string) => Promise<string | null>;
  candidates?: string[];
  registerTextSetter?: (
    setter: (val: string, caretAtEnd?: boolean) => void
  ) => void;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [caret, setCaret] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const remaining = 500 - text.length;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node | null;
      if (
        showEmojiPicker &&
        pickerRef.current &&
        !pickerRef.current.contains(t as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(t as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [showEmojiPicker]);

  const EMOJIS = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😊",
    "🙂",
    "😍",
    "😘",
    "😎",
    "🤗",
    "🤔",
    "😅",
    "😇",
    "🤩",
    "🙃",
    "😉",
    "😜",
    "🥳",
    "👍",
  ];

  function resizeTextarea(element: HTMLTextAreaElement) {
    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 124)}px`;
  }

  function updateSuggestions(value: string, cursorPos: number) {
    const before = value.slice(0, cursorPos);
    const match = before.match(/@(\w*)$/);
    if (!match) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }
    const query = match[1].toLowerCase();
    const list = (candidates || []).filter((candidate) =>
      candidate.toLowerCase().startsWith(query)
    );
    setSuggestions(list.slice(0, 5));
    setShowSuggestions(list.length > 0);
  }

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    setError("");
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Message cannot be empty.");
      return;
    }
    if (trimmed.length > 500) {
      setError("Message must be 500 characters or fewer.");
      return;
    }
    const result = await onSend(trimmed);
    if (result) {
      setError(result);
      return;
    }
    setText("");
    setShowSuggestions(false);
    if (textareaRef.current) textareaRef.current.style.height = "44px";
  }

  function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value.slice(0, 500);
    const cursorPos = event.target.selectionStart || 0;
    setText(value);
    setCaret(cursorPos);
    updateSuggestions(value, cursorPos);
    resizeTextarea(event.target);
  }

  function pickSuggestion(name: string) {
    const before = text.slice(0, caret);
    const after = text.slice(caret);
    const newBefore = before.replace(/@(\w*)$/, `@${name} `);
    const newText = (newBefore + after).slice(0, 500);
    setText(newText);
    setShowSuggestions(false);
    window.setTimeout(() => {
      if (!textareaRef.current) return;
      const nextCaret = newBefore.length;
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
        nextCaret;
      textareaRef.current.focus();
      resizeTextarea(textareaRef.current);
      setCaret(nextCaret);
    }, 0);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  function insertEmojiAtCaret(emoji: string) {
    const before = text.slice(0, caret);
    const after = text.slice(caret);
    const newText = (before + emoji + after).slice(0, 500);
    setText(newText);
    setShowEmojiPicker(false);
    setTimeout(() => {
      if (!textareaRef.current) return;
      const pos = before.length + emoji.length;
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
        pos;
      textareaRef.current.focus();
      resizeTextarea(textareaRef.current);
      setCaret(pos);
    }, 0);
  }

  useEffect(() => {
    if (!registerTextSetter) return;
    registerTextSetter((val: string, caretAtEnd = true) => {
      const newText = val.slice(0, 500);
      setText(newText);
      setTimeout(() => {
        if (!textareaRef.current) return;
        const pos = caretAtEnd ? newText.length : Math.min(newText.length, 0);
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          pos;
        textareaRef.current.focus();
        resizeTextarea(textareaRef.current);
        setCaret(pos);
      }, 0);
    });
  }, [registerTextSetter]);

  return (
    <form
      onSubmit={submit}
      className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur dark:border-white/[0.08] dark:bg-[#0F172A]/95 sm:px-5"
    >
      <div className="mx-auto max-w-[900px]">
        <div className="relative rounded-md border border-slate-200 bg-slate-50 p-2 shadow-lg shadow-slate-950/5 transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20 dark:border-white/[0.08] dark:bg-[#1E293B] dark:shadow-black/20">
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full left-2 z-20 mb-2 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111827]">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => pickSuggestion(suggestion)}
                  className="block w-full px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none dark:text-slate-200 dark:hover:bg-white/10 dark:focus:bg-white/10"
                >
                  @{suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="mb-1 h-9 w-9 flex-none">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((s) => !s)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md text-sm font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:text-[#94A3B8] dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Emoji picker"
                title="Emoji"
              >
                :)
              </button>
              {showEmojiPicker && (
                <div
                  ref={pickerRef}
                  className="absolute bottom-16 left-3 z-30 w-[260px] rounded-md border bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#111827]"
                >
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJIS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => insertEmojiAtCaret(em)}
                        className="rounded-md px-2 py-1 text-lg hover:bg-white/5"
                        aria-label={`Insert ${em}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={onChange}
              onKeyDown={onKeyDown}
              rows={1}
              disabled={disabled}
              placeholder="Message this public group..."
              className="max-h-[124px] min-h-11 flex-1 resize-none overflow-y-auto bg-transparent px-1 py-3 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#F8FAFC] dark:placeholder:text-[#94A3B8] scrollbar-modern"
            />
            <button
              type="submit"
              disabled={disabled || text.trim().length === 0}
              className="mb-1 h-9 rounded-md bg-violet-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Send
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#94A3B8]">
          <span className="truncate">
            {error || "Enter to send, Shift+Enter for a new line."}
          </span>
          <span className={remaining < 40 ? "font-bold text-orange-500" : ""}>
            {remaining}
          </span>
        </div>
      </div>
    </form>
  );
}
