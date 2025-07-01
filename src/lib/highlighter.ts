import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
  themes: ["dark-plus"],
  langs: ["jsx"],
});

export default highlighter;
