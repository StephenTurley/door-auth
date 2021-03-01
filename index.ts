import createServer from './app'

const PORT = 8443

createServer().listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`)
})
