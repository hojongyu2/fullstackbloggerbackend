var express = require('express');
var router = express.Router();
const { blogsDB } = require("../mongo");

router.get('/hello-blogs', function(req, res, next) {
    res.json({message: "Hello from express"})
})

router.get('/all-blogs', async function(req, res, next) {
    try {

        const limit = Number(req.query.limit)
        const skip = Number(req.query.limit) * (Number(req.query.page) - 1);
        const sortField = req.query.sortField
        const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
        const filterField = req.query.filterField
        const filterValue = req.query.filterValue
        const collection = await blogsDB().collection('posts');

        let filterObj = {}
        if (filterField && filterValue) {
          filterObj = {[filterField]: filterValue}
        }
        let sortObj = {}
        if (sortField && sortOrder) {
          sortObj = {[sortField]: sortOrder}
        }
        
        const posts = await collection.find(filterObj)
        .sort(sortObj)
        .limit(limit)
        .skip(skip)
        .toArray();
        res.json({message:posts})

    }catch(e){
        console.log(e)
        res.status(500).send('error fetching data ' + e)
    }
    
})

router.post('/blog-submit', async function(req, res, next) {
    try {

        const title = req.body.title;
        const text = req.body.text;
        const author = req.body.author;
        const newDate = new Date()

        const getPostCollectionLength = async () => {
            try {
                const collection = await blogsDB().collection('posts');
                return await collection.count()
            }catch(e){
                console.log(500).send('error fetching data ' + e)
            }
        }
        // console.log(await getPostCollectionLength())

        const collection = await blogsDB().collection('posts');
        const newPost = await collection.insertOne({
            title:title,
            text:text,
            author:author,
            createdAt: newDate.toLocaleString(),
            lastModified: newDate.toLocaleString(),
            id: await getPostCollectionLength() + 1
        })
        res.json({message:newPost})

    }catch(e) {
        console.log(e)
        res.status(500).send('error fetching data ' + e)
    }
}) 
module.exports = router;

