import * as Koa from 'koa';

const app = new Koa();

app.use((ctx) => ctx.body = 'Hello Elowen');

app.listen(3000);
