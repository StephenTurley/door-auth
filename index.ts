import server from './app'

const PORT = 8443

server().listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`)
})
