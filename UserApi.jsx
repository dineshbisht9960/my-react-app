import React, { useState } from "react";
import {
  useAddPostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../redux/userSlice";

const UserApi = () => {
  const { data, isLoading, isError, error } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [title, setTitle] = useState("");

  if (isLoading) return <h2>Loading...</h2>
  if (isError) return <h2>Error: {JSON.stringify(error)}</h2>

  const handleAdd = async () => {
    if (!title) return alert("Enter title");
    let res = await addPost({ title }).unwrap();
    setTitle("");
    console.log(`id ${res.id} added successfully`);
  };

  const handleUpdate = async (id) => {
    const newTitle = prompt("Enter new title");
    if (newTitle) {
      await updatePost({ id, title: newTitle }).unwrap();
      console.log(`id ${id} is updated successfully`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this post?")) {
      await deletePost(id).unwrap();
      console.log(`id ${id} is deleted successfully`)
    }
  };

  return (
    <div className="container">
      <input style={{ marginLeft: '577px', width: '248px' }}
        value={title}
        placeholder="New Post Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      <hr />

      <table className="table">
        <thead>
          <tr style={{ border: '2px solid black' }}>
            <th style={{ border: '2px solid black' }}>Id</th>
            <th style={{ border: '2px solid black' }}>Post</th>
            <th style={{ border: '2px solid black' }}>Edit</th>
            <th style={{ border: '2px solid black' }}>Delete</th>
          </tr>
        </thead>

        <tbody>
          {data?.posts?.map((post) => (
            <tr style={{ border: '2px solid black' }} key={post.id}>
              <td style={{ border: '2px solid black' }}>{post.id}</td>
              <td style={{ border: '2px solid black' }}>{post.title}</td>

              <td style={{ border: '2px solid black' }}>
                <button onClick={() => handleUpdate(post.id)}>Edit</button>
              </td>

              <td style={{ border: '2px solid black' }}>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserApi;
