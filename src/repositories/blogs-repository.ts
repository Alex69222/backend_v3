import {BlogType} from "../features/blogs/models/BlogType";
import {CreateBlogType} from "../features/blogs/models/CreateBlogType";

let blogs: BlogType[] = [
    {
        id: "1",
        name: "Backend blog",
        description: "Blog about backend development",
        websiteUrl: "backend.com"
    },
    {
        id: "2",
        name: "Frontend blog",
        description: "Blog about frontend development",
        websiteUrl: "front.com"
    },
    {
        id: "3",
        name: "Fullstack blog",
        description: "Blog about fullstack development",
        websiteUrl: "fullstack.com"
    },
];
export const blogsRepository = {
    async getBlogs(): Promise<BlogType[]> {
        return blogs
    },
    async createBlog(blogData: CreateBlogType): Promise<BlogType> {
        const newBlog = {
            id: String(+new Date()),
            ...blogData
        }
        blogs.push(newBlog);
        return newBlog
    },
    async getBlogById(id: string): Promise<BlogType | null> {
        const blog = blogs.find(b => b.id === id)
        return blog || null
    },
    async testDelete() {
        blogs = []
    }
}
