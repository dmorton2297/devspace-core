import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
    text: String,
    title: String,
    image: {
        url: String,
        id: String,
    },
    description: String,
    tags: [String],
    blogId: String,
    createdAt: String,
    updatedAt: String,
    draft: Boolean,
});

export default blogPostSchema;