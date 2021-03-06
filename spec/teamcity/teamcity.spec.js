const path = require('path'),
      basePackagePath = path.resolve(__dirname, '../..'),
      nock = require('nock'),
      fs = require('fs-extra'),
      eslintReportJSON = fs.readJSONSync(`${basePackagePath}/spec/fixtures/error.json`);

let tc;

nock.disableNetConnect();

describe('teamcity', () => {
  beforeEach(() => {
    tc = require(path.resolve(basePackagePath, 'lib/teamcity'));
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Модуль', () => {
    const testMasterBuildName = '1.12.0/develop',
          encodedTestMasterBuildName = encodeURIComponent('1.12.0/develop'),
          testBuildStatus = 'Failed',
          testBuildFailedReason = 'It`s not good build',
          testBuildProblem = 'It`s real big problem',
          testUsername = 'teamcity',
          testPassword = 'password',
          testHost = 'http://localhost:8080',
          testProjectId = 'testProjectId',
          testBuildName = 'pull-requests/2741',
          testBuildId = 19994;

    it('подключен', () => {
      expect(tc).toBeDefined();
    });

    it('поддердивает необходимое api', () => {
      expect(tc.init).toBeDefined();

      expect(tc.setBuildStatus).toBeDefined();

      expect(tc.getBuildArtifact).toBeDefined();

      expect(tc.prepareEslintReportForTeamcity).toBeDefined();
    });

    describe('в работе', () => {
      beforeEach(() => {
        nock(testHost)
          .persist()
          .log(console.log)
          .get(`/httpAuth/app/rest/builds?locator=buildType:${testProjectId},branch:name:${encodedTestMasterBuildName},count:1,status:SUCCESS,state:finished`)
          .reply(200, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><builds count="1" href="/httpAuth/app/rest/builds?locator=buildType:project_id,branch:name:1.12.0/develop,count:1,status:SUCCESS,state:finished" nextHref="/httpAuth/app/rest/builds?locator=buildType:project_id,branch:(name:1.12.0/develop),count:1,status:SUCCESS,state:finished,start:1"><build id="${testBuildId}" buildTypeId="project_id" number="1.12.0/develop" status="SUCCESS" state="finished" branchName="1.12.0/develop" href="/httpAuth/app/rest/builds/id:1900030" webUrl="https://teamcity.host/viewLog.html?buildId=1900030&amp;buildTypeId=project_id"/></builds>`)
          .get(`/repository/download/${testProjectId}/${testBuildId}:id/reports.zip%21/eslint.json`)
          .reply(200, eslintReportJSON);
      });

      afterEach(() => {
        nock.cleanAll();
      });

      it('использует входные данные', () => {
        nock(testHost)
          .get(function (url) {
            expect(url).toEqual('/httpAuth/app/rest/builds');
            return false;
          })
          .query(
            function (actualQueryObject) {
              expect(actualQueryObject.locator).toEqual(`buildType:${testProjectId},branch:name:${encodedTestMasterBuildName},count:1,status:SUCCESS,state:finished`);
              return false;
            }
          );

        tc.init({username: testUsername, password: testPassword, host: testHost, projectId: testProjectId}, testMasterBuildName);
      });

      describe('позволяет получать', () => {
        beforeEach((done) => {
          tc.init({username: testUsername, password: testPassword, host: testHost, projectId: testProjectId}, testMasterBuildName).then(done);
        });

        it('артефакт мастер сборки', () => {
          nock(testHost)
            .get(function (url) {
              expect(url).toEqual(`repository/download/${testProjectId}/${testBuildId}:id/reports.zip%21/eslint.json`);
              return false;
            });
          tc.getBuildArtifact().then((buildArtifact) => {
            expect(JSON.parse(buildArtifact)).toEqual(eslintReportJSON);
          });
        });
      });

      describe('позволяет устанавливать', () => {
        let stdout;
        beforeEach(() => {
          stdout = '';

          process.stdout.write = (function (write) {
            return function (string, encoding, fileDescriptor) {
              stdout += `${string}\n`;
              write.apply(process.stdout, arguments);
            };
          })(process.stdout.write);
        });

        it('имя сборки', () => {
          tc.setBuildName(`${testBuildName}`);

          expect(stdout).toContain(`##teamcity[buildNumber '${testBuildName}']`);
        });

        it('проблему сборки', () => {
          tc.setBuildProblem(testBuildProblem);

          expect(stdout).toContain(`##teamcity[buildProblem description='${testBuildProblem}' identity='']`);
        });

        it('статус сборки', () => {
          tc.setBuildStatus(`${testBuildStatus}`, `${testBuildFailedReason}`);

          expect(stdout).toContain(`##teamcity[buildStatus status='${testBuildStatus}' text='${testBuildFailedReason}']`);
        });
      });
    });
  });
});
