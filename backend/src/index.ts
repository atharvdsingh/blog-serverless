import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/user/signup',(c)=>{
  return c.text('signup routes')

})
app.post('/api/v1/user/singin',(c)=>{
  return c.text('signup routes')

})
app.post('/api/v1/blog',(c)=>{
  return c.text('create blog')

})
app.put('/api/v1/blog',(c)=>{
  return c.text('update blog')

})
app.get('/api/v1/blog',(c)=>{
  return c.text('get all the blogs')
})
app.get('/api/v1/blog/:id',(c)=>{
  const id =c.req.param

  console.log(id);
  
  return c.text('get the specific blog')
})

export default app
