import Joi from "joi";

export const validateBlog = async (req, res, next) => {
  const blogPayload = req.body;
  try {
    await blogValidator.validateAsync(blogPayload);
    next();
  } catch (error) {
    res.status(406).send(error.details[0].message);
  }
};

const blogValidator = Joi.object({
  title: Joi.string().min(3).trim().required(),
  description: Joi.string().min(3).trim(),
  author: Joi.string().lowercase().email().trim(),
  body: Joi.string().min(3).trim().required(),
  tags: Joi.array(),
});
