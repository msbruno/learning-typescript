import app from './config/app'
import {MongoHelper} from '../infra/db/mongodb/helper/mongo-helper'
import env from '../main/config/env'

MongoHelper.connect(env.mongoUrl)
    .then(async () => {
        const app = (await import('../main/config/app')).default
        app.listen(env.port, () => console.log('server running'))
    })
    .catch(console.error)

