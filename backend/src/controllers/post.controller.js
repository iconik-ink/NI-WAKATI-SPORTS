import { Post } from "../models/post.model.js";

// Create a post
const createPosts = async ( req, res) => {
    try {
        const{ name, description, age} = req.body;

        if(!name || !description || !age) {
            return res.status(400).json({
                message: "All field are required"
            });
        }

            const post = await Post.create({ name, description, age })

            res.status(201).json({
                message: "Post created successfully", post
            });
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error", error
        });
    }
}

//read all posts
const getPosts = async (req, res) => {
    try {
        const Posts = await post.find;
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({
            message: "Internal server error", error
        });
    }
}


const updatePosts = async (req, res) => {
    try {
        //basic validation to check if the body is empty

        //
        if(object.keys(req.body).length == 0) {
            return res.status(400).json({
                message: "No data provided for update"
            });
        }


        const post = await Post.findByIdAndUpdate(req.params.id, req.body,
             {new: true});

             if(!post) return res.status(404).json({
                message: "Post not found"
             });

             res.status(200).json({
                message: "Post Updated Successfully ", post
             });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server error",
            error
        })
        
}
}
const deletePosts = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({
            message: "Post not found"
        });

        res.status(200).json({
            message: "Post successfully deleted"
        });
    } catch (error) {
          res.status(500).json({
            message: "Internal Server error",
            error
        });
        
    }
}
export{
    createPosts,
    getPosts,
    updatePosts,
    deletePosts
};