const SL = require('../index.js');
const chai = require('chai');

const expect = chai.expect;

function Person(name) {
  this.name = name;
  this.age = 42;
  this.birthday = null;
}

Person.prototype.getName = function() {
  return this.name;
};

const layout = {
  name: null,
  age: 'age_of_person',
  birthday: {
    key: 'timestamp',
    from: unix => new Date(unix),
    to: date => date instanceof Date ? date.getTime() : null
  }
};

const raw = {
  name: 'John Doe',
  age_of_person: 123,
  timestamp: new Date('2012-12-12').getTime()
};

describe('serialize-layout', function() {
  let person = SL.deserialize(Person, layout, raw);

  it('Should deserialize a plain Object', function() {
    expect(person instanceof Person).to.equal(true);
    expect(person.name).to.equal(raw.name);
    expect(person.getName()).to.equal(raw.name);
    expect(person.age).to.equal(raw.age_of_person);
    expect(person.birthday instanceof Date).to.equal(true);
    expect(person.birthday.getTime()).to.equal(raw.timestamp);
  });

  it('Should serialize an Object', function() {
    let newRaw = SL.serialize(layout, person);

    expect(newRaw.name).to.equal(raw.name);
    expect(newRaw.age_of_person).to.equal(raw.age_of_person);
    expect(newRaw.timestamp).to.equal(raw.timestamp);
  });

});
