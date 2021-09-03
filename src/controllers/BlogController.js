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
        const p = posts.sort((a, b) => {
            if (b.createdAt < a.createdAt) {
                return -1;
            } else if (a.createdAt === b.createdAt) {
                return 0;
            } else {
                return 1;
            }
        })
        return {...blog._doc, blogPosts: p };
    };

    async getBlogByEmail(email) {
        const blog = await this.dal.getBlogByEmail(email);
        const posts = await this.postDal.getPublishedBlogPosts(blog._id);
        const p = posts.sort((a, b) => {
            if (b.createdAt < a.createdAt) {
                return -1;
            } else if (a.createdAt === b.createdAt) {
                return 0;
            } else {
                return 1;
            }
        })
        return {...blog, blogPosts: p };
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
        const createdAt = moment().format();
        const updatedAt = moment().format();
        const p = await this.postDal.createBlogPost({
            ...blog,
            image: blog.image ? blog.image : null,
            userId: userId,
            userEmail: email,
            createdAt,
            updatedAt,
            draft: true,
        });
        return p;
    }

    async editBlogPost(blogPost, userId) {
        const updatedAt = moment().format();
        const p = await this.postDal.editBlogPost({ ...blogPost, updatedAt });
        return p;
    }

    async deleteBlogPost(blogPost, userId) {
        const p = await this.postDal.deleteBlogPost(blogPost._id);
        return p;
    }
};

export default BlogController;

