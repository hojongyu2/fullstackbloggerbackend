var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");

router.get('/blog-list', async function (req, res, next) {

    try {
        const collection = await blogsDB().collection('posts');
        const blogPosts = await collection.find({}).project({id:1, title:1, author:1, createdAt:1, lastModified:1}).toArray();
        res.status(200).json({message:blogPosts, success: true});
        // in project, 1 means include, 0 means opposite.
    }catch (e) {
        console.error(e)
            res.json({success: false})
    } 
});

//put is used to update data
//post is used to create new data

router.put('/edit-blog', async function (req, res, next) {

    try {

        const newDate = new Date();
        console.log(req.body)
        const newPostData = {
            id: req.body.blogId,
            title: req.body.title,
            author: req.body.author,
            text: req.body.text,
            lastModified: newDate.toISOString()
          }
        
        const collection = await blogsDB().collection('posts');
        
        await collection.updateOne({
            
            id:req.body.blogId
        },{
            $set:{
                ...newPostData
            }
        })

        res.json({success: true})

    }catch (e) {
        console.error(e)
        res.json({success: "why false"})
    } 
});

router.delete('/delete-blog/:blogId', async function (req, res, next) {
    try {
        const blogId = Number(req.params.blogId)
        const collection = await blogsDB().collection("posts")
        await collection.deleteOne({
            id: blogId
        })    
        res.json({message:success, success:true})
    } catch (e) {
        console.error(e)
            res.json({success: false})
    }
})

module.exports = router;