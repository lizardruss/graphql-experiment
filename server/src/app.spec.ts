import { expect } from 'chai';
import * as sinon from 'sinon';
import * as request from 'supertest';
import app from './app';
import { model as File } from './schema/file';

describe(`GraphQL API`, () => {
  let server;
  let sandbox;

  before(() => {
    server = app.listen(3001);
    sandbox = sinon.sandbox.create();
  });

  after(() => {
    server.close();
    sandbox.restore();
  });

  describe(`file query`, () => {
    describe(`without contents`, () => {
      let response;
      let file;

      before(async () => {
        sandbox.spy(File, `getFile`);
        response = await request(server)
          .post(`/graphql`)
          .send({
            query: `
              {
                file(path: "/poop.txt") {
                  path
                  size
                  createdAt
                }
              }
            `
          });

        file = response.body.data.file;
      });

      it(`calls File.getFile()`, () => {
        expect(File.getFile).to.have.been.called
      });

      it(`returns path`, () => {
        expect(file.path).to.eq(`/poop.txt`);
      });

      it(`returns size`, () => {
        expect(file.size).to.eq(0);
      });

      it(`returns createdAt`, () => {
        expect(file.createdAt).to.not.be.null;
      });
    });

    describe(`with contents`, () => {
      let response;
      let file;

      before(async () => {
        response = await request(server)
          .post(`/graphql`)
          .send({
            query: `
              {
                file(path: "/poop.txt") {
                  path
                  size
                  createdAt
                  contents
                }
              }
            `
          });

        file = response.body.data.file;
      });

      it(`returns path`, () => {
        expect(file.path).to.eq(`/poop.txt`);
      });

      it(`returns size`, () => {
        expect(file.size).to.eq(0);
      });

      it(`returns createdAt`, () => {
        expect(file.createdAt).to.not.be.null;
      });

      it(`returns contents`, () => {
        expect(file.contents).to.eq('Buncha stuff.');
      });
    });

    describe(`with parent`, () => {
      let response;
      let file;

      before(async () => {
        try {
          response = await request(server)
            .post(`/graphql`)
            .send({
              query: `
                {
                  file(path: "/poop.txt") {
                    path
                    size
                    createdAt
                    parent {
                      path
                      createdAt
                      files {
                        ... on File {
                          path
                        }
                      }
                    }
                  }
                }
              `
            });
          file = response.body.data.file;
        } catch(error) {
          console.log(error);
        }
      });

      it(`returns path`, () => {
        expect(file.path).to.eq(`/poop.txt`);
      });

      it(`returns size`, () => {
        expect(file.size).to.eq(0);
      });

      it(`returns createdAt`, () => {
        expect(file.createdAt).to.not.be.null;
      });

      it(`returns parent`, () => {
        expect(file.parent).to.not.be.null;
      });

      it(`returns parent path`, () => {
        expect(file.parent.path).to.eq('/');
      });

      it(`returns parent createdAt`, () => {
        expect(file.parent.createdAt).to.not.be.null;
      });

      it(`returns parent files`, () => {
        expect(file.parent.files).to.be.an('array');
      });
    });
  });

  describe(`directory query`, () => {
    let response;
    let directory;

    before(async () => {
      response = await request(server)
        .post(`/graphql`)
        .send({
          query: `
            {
              directory(path: "/") {
                path
                createdAt
                files {
                  ... on File {
                    path
                    createdAt
                  }
                }
              }
            }
          `
        });

      directory = response.body.data.directory;
    });

    it(`returns path`, () => {
      expect(directory.path).to.eq(`/`);
    });

    it(`returns createdAt`, () => {
      expect(directory.createdAt).to.not.be.null;
    });

    it(`returns files`, () => {
      expect(directory.files).to.be.an('array');
    });
  });
});