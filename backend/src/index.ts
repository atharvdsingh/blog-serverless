import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter'




const app = new Hono <{ Bindings:{
  DATABASE_URL:string
}}> ()



app.post('/api/v1/user/signup',async (c)=>{
  
  const prisma=new PrismaClient({
    
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const body= await c.req.json()
  const data=await prisma.users.create({
    data:{
      email:body.email,
      password:body.password
    }

  })
  

  


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
