import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message({ role, text }) {
  return (
    <div className={`message ${role === "user" ? "user" : "bot"}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
