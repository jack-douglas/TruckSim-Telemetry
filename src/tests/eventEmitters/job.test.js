import assert       from "assert"
import sinon        from "sinon"
import EventEmitter from "events"

import job from "../../lib/eventEmitters/job"

describe("eventEmitters/job()", function() {

  const telemetry = {
    job: new EventEmitter()
  }

  const spies = {
    cancelled: sinon.spy(),
    delivered: sinon.spy(),
    finished:  sinon.spy(),
    started:   sinon.spy(),
  }

  const createData = () => ({
    game: {
      pluginVersion: 10
    },
    events: {
      job: {
        cancelled: {active: false, foo: "bar"},
        delivered: {active: false, bar: "baz"},
        finished:  {active: false, baz: "qux"},
        started:   {active: false, qux: "quux"},
      }
    }
  })

  before(function() {
    const data = [createData(), createData()]

    telemetry.job.on("cancelled", spies.cancelled)
    telemetry.job.on("delivered", spies.delivered)
    telemetry.job.on("finished",  spies.finished)
    telemetry.job.on("started",   spies.started)

    job(telemetry, data)
    
    data[0].events.job.cancelled.active = true
    data[0].events.job.delivered.active = true
    data[0].events.job.finished.active  = true
    data[0].events.job.started.active   = true
    job(telemetry, data)
    
    data[0].events.job.cancelled.active = false
    data[0].events.job.delivered.active = false
    data[0].events.job.finished.active  = false
    data[0].events.job.started.active   = false
    job(telemetry, data)
    
    data[1].events.job.cancelled.active = true
    data[1].events.job.delivered.active = true
    data[1].events.job.finished.active  = true
    data[1].events.job.started.active   = true
    job(telemetry, data)
    
    data[1].events.job.cancelled.active = false
    data[1].events.job.delivered.active = false
    data[1].events.job.finished.active  = false
    data[1].events.job.started.active   = false
    job(telemetry, data)
  })

  it("Should emit cancelled events", function() {
    assert.equal(spies.cancelled.args.length, 1)
    assert.deepEqual(spies.cancelled.args[0][0], {active: true, foo: "bar"})
  })

  it("Should emit delivered events", function() {
    assert.equal(spies.delivered.args.length, 1)
    assert.deepEqual(spies.delivered.args[0][0], {active: true, bar: "baz"})
  })

  it("Should emit finished events", function() {
    assert.equal(spies.finished.args.length, 1)
  })

  it("Should emit started events", function() {
    assert.equal(spies.started.args.length, 1)
    assert.deepEqual(spies.started.args[0][0], {active: true, qux: "quux"})
  })

  it("Should not emit events not supported by plugin version 9", function() {
    const data = [createData(), createData()]
    
    for (let i = 0; i < 2; i++) {
      data[i].game.pluginVersion = 9
  
      delete data[i].events.job.cancelled
      delete data[i].events.job.delivered
    }

    job(telemetry, data)
  })

})