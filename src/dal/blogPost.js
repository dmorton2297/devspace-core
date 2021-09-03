import mongoose from 'mongoose';
import blogPostSchema from './schemas/blogPostSchema.js';
import dotenv from 'dotenv';
dotenv.config();

export default class BlogPost {
    constructor() {
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    }

    async getBlogPosts(blogId) {
        const BlogPost = mongoose.model('blogPost', blogPostSchema);
        const blogPosts = await BlogPost.find({ blogId: blogId });
        return blogPosts;
    };

    async getPublishedBlogPosts(blogId) {
        const BlogPost = mongoose.model('blogPost', blogPostSchema);
        try {
            const blogPosts = await BlogPost.find({ blogId: blogId, draft: false });
            return blogPosts;

        } catch (e) { console.error(e) }
        return [];
    };
    

    async getBlogPost(postId) {
        const BlogPost = mongoose.model('blogPost', blogPostSchema);
        const blogPost = await BlogPost.findById(postId);
        return blogPost;
    }

    async createBlogPost(blogPost) {
        const BlogPost = mongoose.model('blogPost', blogPostSchema);
        const newBlogPost = new BlogPost(blogPost);
        const p = await newBlogPost.save();
        return newBlogPost;
    }

    async editBlogPost(blogPost) {
        const BlogPost = mongoose.model('blogPost', blogPostSchema);
        await BlogPost.findOneAndUpdate({ _id: blogPost.id }, blogPost, { new: true, useFindAndModify: false });
        const p = await BlogPost.findById(blogPost.id);
        return p;
    }

    async deleteBlogPost(blogPost) {
        const BlogPost = mongoose.model('blogPost', blogPostSchema);
        const p = await BlogPost.findByIdAndDelete(blogPost);
        return blogPost;
    }
}