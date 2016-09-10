const assert = require('assert');
const mockery = require('mockery');
const sinon = require('sinon');
const fixtures = require('./fixtures');

describe('index', function () {
  var index = null;

  const mockNotifier = {
    success: sinon.spy(),
    failure: sinon.spy()
  };

  const mockHipchatNotifier = {
    make: function () {
      return mockNotifier;
    }
  };

  before(function () {
    sinon.stub(console, 'log');
  });
  after(function () {
    console.log.restore();
  })

  before(function () {
    mockery.enable();
    mockery.warnOnUnregistered(false);
    mockery.registerMock('hipchat-notifier', mockHipchatNotifier);

    index = require('../index');
  });

  after(function () {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#handler', function () {
    const mockContext = {
      succeed: sinon.spy(),
      fail: sinon.spy()
    };

    it('should send a failure notification for ALARM state', function () {
      index.handler(fixtures.snsElbAlarmEvent, mockContext);
      assert(mockNotifier.failure.called);
    });

    it('should send a success notification for OK state', function () {
      index.handler(fixtures.snsElbOkEvent, mockContext);
      assert(mockNotifier.success.called);
    });
  });
});
