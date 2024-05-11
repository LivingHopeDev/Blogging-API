import Blog from "../models/blog.js";
import User from "../models/user.js";
import { calculateReadingTime } from "../helper/readingTimeAlgo.js";
export const createBlog = async (req, res) => {
  const userId = req.user.id;
  const { title, description, tags, body } = req.body;
  try {
    const existingTitle = await Blog.findOne({ title });
    if (existingTitle) {
      return res
        .status(400)
        .json({ error: "Title is not available: Try another one!" });
    }
    const reading_time = calculateReadingTime(body);
    const newBlog = new Blog({
      author: userId,
      title,
      description,
      tags,
      body,
      reading_time,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", data: newBlog });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    let { page, limit, author, title, tags, sortBy, sortOrder } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;

    let query = { state: "published" };

    if (author) {
      const authors = await User.find({
        $or: [
          { first_name: { $regex: author, $options: "i" } },
          { last_name: { $regex: author, $options: "i" } },
        ],
      });

      const authorIds = authors.map((author) => author._id);

      query.author = { $in: authorIds };
    }

    if (title) query.title = { $regex: title, $options: "i" };
    if (tags) query.tags = { $in: tags.split(",") };

    const sortOptions = {};
    if (
      sortBy === "read_count" ||
      sortBy === "reading_time" ||
      sortBy === "createdAt" ||
      sortBy === "updatedAt"
    ) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const blogs = await Blog.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("author", "first_name last_name");

    if (blogs.length === 0) {
      return res
        .status(200)
        .json({ message: "No blog posts yet!", data: blogs });
    }

    res.status(200).json({ message: "List of blogs", data: blogs });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "first_name last_name"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found!", data: blog });
    }
    blog.read_count++;
    await blog.save();
    res.status(200).json({ message: "Current blog", data: blog });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getOwnerBlog = async (req, res) => {
  const userId = req.user.id;

  const { page = 1, limit = 10, state } = req.query;
  try {
    let filter = { author: userId };
    if (state) {
      filter.state = state;
    }

    const paginationOptions = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };
    const blogs = await Blog.find(filter, null, paginationOptions);

    const totalBlogs = await Blog.find(filter).count();
    res.status(200).json({
      message: "Availbale blogs",
      data: blogs,
      totalPages: Math.ceil(totalBlogs / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
export const updateBlogState = async (req, res) => {
  const { state } = req.body;
  const userId = req.user.id;
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this blog post" });
    }

    blog.state = state;
    await blog.save();

    res
      .status(200)
      .json({ message: "Blog state updated successfully", data: blog });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const updateBlog = async (req, res) => {
  const userId = req.user.id;
  const { title, description, tags, body } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this blog post" });
    }

    blog.title = title;
    blog.description = description;
    blog.tags = tags;
    blog.body = body;
    await blog.save();

    res
      .status(200)
      .json({ message: "Blog content updated successfully", data: blog });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const deleteBlog = async (req, res) => {
  const userId = req.user.id;
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this blog post" });
    }

    await Blog.deleteOne({ _id: blog._id });
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
