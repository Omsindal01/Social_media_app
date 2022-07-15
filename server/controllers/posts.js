import postMessage from "../models/postMessages.js";
import mongoose from "mongoose";
export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await postMessage.countDocuments({});

    const posts = await postMessage
      .find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await postMessage.find({
      $or: [{ title: title }, { tags: { $in: tags.split(",") } }],
    });

    res.json(posts);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postMessage.findById(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};
export const createPost = async (req, res) => {
  const post = req.body;
  try {
    const newPost = await postMessage.create({
      ...post,
      creator: req.userId,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({
      message: err.message,
    });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({
      message: "Invalid ID!",
    });
  }
  try {
    const updatedPost = await postMessage.findByIdAndUpdate(
      _id,
      { ...req.body, _id },
      {
        new: true,
      }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};
export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({
      message: "Invalid ID!",
    });
  }
  try {
    await postMessage.findByIdAndRemove(_id);
    res.json({ message: "post deleted successfully" });
  } catch (error) {
    res.json({
      message: "couldn't delete the post!",
    });
  }
};
export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) return res.status(400).json({ message: "UnAuthenticated!" });
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(404).json({
      message: "Invalid ID!",
    });
  }
  try {
    const post = await postMessage.findById(_id);
    const index = post.likes.includes(String(req.userId));
    if (!index) post.likes.push(req.userId);
    else post.likes = post.likes.filter((id) => id !== String(req.userId));
    const updatedPost = await postMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.json({
      message: err.message,
    });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    const post = await postMessage.findById(id);
    post.comments.push(comment);
    const updatedPost = await postMessage.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.json(updatedPost);
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};
