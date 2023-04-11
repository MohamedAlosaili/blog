import ReactMarkdown from "react-markdown";
import MdEditor from "react-markdown-editor-lite";
import remarkGfm from "remark-gfm";

import "react-markdown-editor-lite/lib/index.css";
import "./editor.css";

export default ({ value, onChange }) => {
  return (
    <MdEditor
      style={{ height: "500px" }}
      renderHTML={text => (
        <ReactMarkdown
          children={text}
          remarkPlugins={[remarkGfm]}
          linkTarget="_blank"
          skipHtml={false}
        />
      )}
      value={value}
      onChange={onChange}
      view={{ md: true, html: false }}
    />
  );
};
