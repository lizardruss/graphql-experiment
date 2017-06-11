import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as koaBody from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa';
import { schema } from './schema';
import { model as File } from './schema/file';

const app = new Koa();
const router = new KoaRouter();

app.use(koaBody());

router.post('/graphql', graphqlKoa({
  schema,
  context: {
    File
  }
}));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());

export default app;