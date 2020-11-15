import { mockImage, blogs } from '../mocks.js';
import moment from 'moment';
import Blog from '../dal/blog.js';
import BlogPost from '../dal/blogPost.js';

let _blogs = [
    ...blogs
];

class BlogController {

    constructor() {
        this.dal = new Blog();
        this.postDal = new BlogPost();
    }

    async getBlog(userId) {
        const blog = await this.dal.getBlogByUserId(userId);
        const posts = await this.postDal.getBlogPosts(blog._id);
        return {...blog._doc, blogPosts: posts };
    };

    async getBlogByEmail(email) {
        const blog = await this.dal.getBlogByEmail(email);
        const posts = await this.postDal.getBlogPosts (blog._id);
        return {...blog, blogPosts: posts };
    }

    async createBlog(blog, userId) {
        const b = await this.dal.createBlog({ ...blog, userId });
        return b;
    }

    async editBlogDetails(blog, userId) {
        const b = await this.dal.editBlog({...blog, userId });
        return b;
    }

    async getBlogPost(id, userId) {
        const p = await this.postDal.getBlogPost(id);
        return p;
    }


    async createBlogPost(blog, userId, email) {
        const p = await this.postDal.createBlogPost({
            ...blog,
            image: blog.image ? blog.image : null,
            userId: userId,
            userEmail: email
        });
        return p;
    }

    async editBlogPost(blogPost, userId) {
        const p = await this.postDal.editBlogPost(blogPost);
        return p;
    }

    async deleteBlogPost(blogPost, userId) {
        const p = await this.postDal.deleteBlogPost(blogPost._id);
        return p;
    }
};

export default BlogController;

