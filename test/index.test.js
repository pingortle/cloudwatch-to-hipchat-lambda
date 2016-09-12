const assert = require('assert');
const mockery = require('mockery');
const sinon = require('sinon');
const fixtures = require('./fixtures');

const sandbox = sinon.sandbox.create();

function generateNotifierMaker(notifier) {
  return { make: () => notifier };
}

describe('index', function () {
  const body = 'some state info';
  const okResponse = 200;
  const notAuthorizedResponse = 403;
  const error = { message: 'something went wrong' };

  before(function () {
    mockery.enable({ useCleanCache: true });
    sinon.stub(console, 'log');
  });

  after(function () {
    mockery.disable();
    console.log.restore();
  });

  afterEach(function () { sandbox.verifyAndRestore(); });

  const failingNotifier = {
    success: (message, callback) => callback(error, notAuthorizedResponse, body),
    failure: (message, callback) => callback(error, notAuthorizedResponse, body)
  };

  const succeedingNotifier = {
    success: (message, callback) => callback(null, okResponse, body),
    failure: (message, callback) => callback(null, okResponse, body)
  };

  const mockContext = {
    succeed: sinon.spy(),
    fail: sinon.spy()
  };

  states = [
    { notifier: succeedingNotifier, name: 'succeed' },
    { notifier: failingNotifier, name: 'fail' }
  ];
  states.forEach(function (state) {
    describe(`the lambda function ${state.name}s`, function () {
      beforeEach(function () {
        mockery.warnOnUnregistered(false);
        mockery.resetCache();
        mockery.registerMock('hipchat-notifier', generateNotifierMaker(state.notifier));
        this.index = require('../index');
      });

      afterEach(function () { mockery.deregisterAll(); });

      it(`should send AWS a '${state.name}' state`, function () {
        this.index.handler(fixtures.snsElbOkEvent, mockContext);
        assert(mockContext[state.name].called);
      });

      describe('#handler', function () {
        beforeEach(function () {
          sinon.spy(state.notifier, 'failure');
          sinon.spy(state.notifier, 'success');
        });

        afterEach(function () {
          state.notifier.failure.restore();
          state.notifier.success.restore();
        });

        it('should send a failure notification for ALARM state', function () {
          this.index.handler(fixtures.snsElbAlarmEvent, mockContext);
          assert(state.notifier.failure.called);
        });
    
        it('should send a success notification for OK state', function () {
          this.index.handler(fixtures.snsElbOkEvent, mockContext);
          assert(state.notifier.success.called);
        });
      });
    });
  });
});
