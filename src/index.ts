import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

app.post(`/signup`, async (req, res) => {
  const { username, fullname, password } = req.body

  try {
    const result = await prisma.user.create({
      data: {
        username: (username as string).toLowerCase(),
        fullname,
        password
      },
    })

    res.json(result)
  } catch (error) {
    res.status(404).json(error)
  }
})

app.post(`/login`, async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })
  
    if (!user || user.password !== password) {
      res.status(404).json(false)
      return
    }
  
    res.json(true)
  } catch (error) {
    res.status(404).json(error)
  }
})


app.get(`/`, async (req, res) => {
  res.json("Hi")
})

// Resident

app.get(`/resident`, async (req, res) => {
  try {
    const result = await prisma.resident.findMany({
      where: {
        active: true,
      }
    })
    res.json(result)
  } catch(error) {
    res.status(404).json(error)
  }
})

app.post('/resident', async (req, res) => {
  const { name, address, phone, age, gender, description, firstRoad, secondRoad } = req.body

  try {
    const result = await prisma.resident.create({
      data: {
        name,
        address,
        phone,
        age,
        gender,
        description,
        firstRoad,
        secondRoad,
      },
    })

    res.json(result)
  } catch (error) {
    res.status(404).json(error)
  }
})

app.patch('/resident/:id', async (req, res) => {
  const { id } = req.params
  const { name, address, phone, age, gender, description, firstRoad, secondRoad } = req.body

  try {
    const result = await prisma.resident.update({
      where: {
        id: +id,
      },
      data: {
        name,
        address,
        phone,
        age,
        gender,
        description,
        firstRoad,
        secondRoad,
      },
    })

    res.json(result)
  } catch (error) {
    res.status(404).json(error)
  }
})


// Payment

app.post('/payment', async (req, res) => {
  const { dueDate, type, amount, person, residentId } = req.body

  try {
    const result = await prisma.payment.create({
      data: {
        dueDate, 
        type, 
        amount: Number(amount), 
        person,
        resident: {
          connect: {
            id: residentId
          }
        }
      },
    })
    console.log('Result payment', result)

    res.json(result)
  } catch (error) {
    console.log("🚀 ~ error", error)
    res.status(404).json("Something went wrong")
  }
})

app.get(`/payment`, async (req, res) => {
  try {
    const result = await prisma.payment.findMany()
    res.json(result)
  } catch (error) {
    res.status(404).json(error)
  }
})

app.patch('/payment/:id', async (req, res) => {
  const { id } = req.params
  const { dueDate, type, amount, person } = req.body

  try {
    const result = await prisma.payment.update({
      where: {
        id: +id
      },
      data: {
        dueDate, 
        type, 
        amount: amount && Number(amount), 
        person,
      },
    })
    console.log('Result payment', result)

    res.json(result)
  } catch (error) {
    console.log("🚀 ~ error", error)
    res.status(404).json("Something went wrong")
  }
})


/*
app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
  })
  res.json(result)
})
*/

// app.put('/post/:id/views', async (req, res) => {
//   const { id } = req.params

//   try {
//     const post = await prisma.post.update({
//       where: { id: Number(id) },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     })

//     res.json(post)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.put('/publish/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const postData = await prisma.post.findUnique({
//       where: { id: Number(id) },
//       select: {
//         published: true,
//       },
//     })

//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) || undefined },
//       data: { published: !postData?.published },
//     })
//     res.json(updatedPost)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.delete(`/post/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.delete({
//     where: {
//       id: Number(id),
//     },
//   })
//   res.json(post)
// })

// app.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.json(users)
// })

// app.get('/user/:id/drafts', async (req, res) => {
//   const { id } = req.params

//   const drafts = await prisma.user
//     .findUnique({
//       where: {
//         id: Number(id),
//       },
//     })
//     .posts({
//       where: { published: false },
//     })

//   res.json(drafts)
// })

// app.get(`/post/:id`, async (req, res) => {
//   const { id }: { id?: string } = req.params

//   const post = await prisma.post.findUnique({
//     where: { id: Number(id) },
//   })
//   res.json(post)
// })

// app.get('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req.query

//   const or: Prisma.PostWhereInput = searchString
//     ? {
//         OR: [
//           { title: { contains: searchString as string } },
//           { content: { contains: searchString as string } },
//         ],
//       }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })

//   res.json(posts)
// })

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
`))
