import React, { useState } from "react";
import {
  useAddPostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../redux/appSlice";
import "./ApiData.css";

const ApiData = () => {
  const { data, isLoading, isError, error } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [title, setTitle] = useState("");

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>Error: {JSON.stringify(error)}</h2>;

  const handleAdd = async () => {
    try {
      if (!title) return alert("Enter title");
      console.log('Add Successfully')
      await addPost({ title }).unwrap();
      setTitle("");
    } catch (err) {
      console.error("Add failed:", err);
      alert("Add failed");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const newTitle = prompt("Enter new title");
      console.log('Update Successfully');
      if (!newTitle) return;
      await updatePost({ id, title: newTitle }).unwrap();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this post?")) return;
      console.log('Delelte Successfully');
      await deletePost(id).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>RTK Query + DummyJSON Posts</h1>
      <input
        value={title}
        placeholder="New Post Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleAdd}>Add Post</button>

      <hr />

      <table className="table">
        <thead>
          <tr className="table-row">
            <th>Post</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {data?.posts?.map((post) => (
            <tr className="table-row" key={post.id}>
              <td>{post.title}</td>

              <td>
                <button onClick={() => handleUpdate(post.id)}>Edit</button>
              </td>

              <td>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApiData;
