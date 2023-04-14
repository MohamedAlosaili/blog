import { useState } from "react";
import { Form } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";
import { CgSpinnerTwo } from "react-icons/cg";

import formatDate from "../../../formatDate";
import "./comment.css";

const Comment = ({ comment, user, setCommentBox }) => {
  const [deleting, setDeleting] = useState(false);
  const commentAuthor = user?._id === comment.author._id;

  const editComment = () => {
    setCommentBox({
      type: "edit",
      commentId: comment._id,
      value: comment.content,
    });
  };

  const commentContent = comment.content.split("\n").map(text => {
    if (text.trim()) return <p key={text}>{text}</p>;
    return <br />;
  });

  return (
    <div className="post--comments-card">
      <div className="post-comments--wrapper">
        <h3 className="post--comments--author">{comment.author.name}</h3>
        <span className="post--comments--date">
          On {formatDate(comment.createdAt)}
        </span>
        {commentAuthor && (
          <>
            <button
              className="post--comments--button edit"
              title="Edit comment"
              onClick={editComment}
            >
              <a href="#comments-form">
                <TbEdit />
              </a>
            </button>
            <Form method="DELETE" onSubmit={() => setDeleting(true)}>
              <button
                className="post--comments--button delete"
                title="Delete comment"
                name="commentId"
                value={comment._id}
                disabled={deleting}
              >
                {deleting ? (
                  <CgSpinnerTwo
                    color="rgba(255, 0, 0, 0.85)"
                    className="loading--spinner"
                  />
                ) : (
                  <BsFillTrashFill color="rgba(255, 0, 0, 0.85)" />
                )}
              </button>
            </Form>
          </>
        )}
      </div>
      <div className="post--comments--content">{commentContent}</div>
    </div>
  );
};

export default Comment;
