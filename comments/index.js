const express = require('express');
const bodyParser=require('body-parser');
const {randomBytes}=require('crypto')
const cors=require('cors')
const axios = require('axios')



const app = express();
app.use(bodyParser.json());
app.use(cors())

const commentsById ={   //this one is going have id of a post as key whose value will be the comments of that post. The comments will also have a unique id associated

}

app.post('/events', async (req, res) => {
    console.log('Received events: ', req.body.type)
     
    const {type, data} = req.body

    if (type==='CommentModerated'){
        
        
        const {id, postID, status, content} = data
        
        const comments = commentsById[postID]
        

        const commentToUpdate = comments.find(comment => {return comment.id===id})
        commentToUpdate.status=status

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id, status, postID, content
            }
        } )



    }
    res.send({})
})

app.get('/posts/:id/comments', (req, res)=>{

    res.send(commentsById[req.params.id] || [])

})

app.post('/posts/:id/comments', async (req, res)=>{

    const commentId=randomBytes(4).toString('hex')
    const id=req.params.id; //taking the id from the parameter
    const {content}=req.body;

    const comments = commentsById[id] || [] //returns array of comments in the post if it exists, if not, returns empty array
    comments.push({id: commentId, content, status:'pending'})
    commentsById[id]=comments

    

   await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content, 
            postID: req.params.id,
            status: 'pending'
        }
    })
    res.status(201).send(comments)

})

app.listen(4001, ()=>{
    console.log("comment-ms : Listening on 4001")
})