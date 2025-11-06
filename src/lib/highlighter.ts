import { createHighlighter } from "shiki/bundle/web";

const highlighter = await createHighlighter({
  themes: ["dark-plus"],
  langs: ["jsx"],
});

export default highlighter;
