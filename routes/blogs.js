var express = require('express');
var router = express.Router();
const { blogsDB } = require("../mongo");

router.get('/hello-blogs', function(req, res, next) {
    res.json({message: "Hello from express"})
})

router.get('/all-blogs', async function(req, res, next) {
    const collection = await blogsDB().collection('posts');
    const allBlogs = await collection.find({}).toArray()
    res.json(allBlogs)
})

module.exports = router;