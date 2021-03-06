const utils = require('../lib/utils');

describe('utils', () => {
  it('есть нужные функции', () => {
    expect(typeof utils.mergePathsFromAnyEnv === 'function').toBeTruthy();
  });

  describe('mergePathsFromAnyEnv', () => {
    it('env не задан', () => {
      expect(utils.mergePathsFromAnyEnv).toThrowError('Параметр env не задан');
    });

    it('env задан', function () {
      let path = utils.mergePathsFromAnyEnv('/home/alexey/IdeaProjects/sfa',
        '/opt/teamcity-agent/work/89d8f1306cb75ef7/devTools/js/grunt-config/clean.js', 'teamcity');

      expect(path.replace(/\\/g, '/')).toEqual('/home/alexey/IdeaProjects/sfa/devTools/js/grunt-config/clean.js');
    });
  });
});
