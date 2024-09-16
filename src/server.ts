import app from './app'
import appEnvs from './config/env';

console.log(appEnvs)
const port = 8080;
app.listen(port, () => console.log(`Server is running on ${port}`))