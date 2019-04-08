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
  },
  input_test: {
    key: 'input_test',
    from: (_, input) => input,
    to: (_, input) => input
  }
};

const raw = {
  name: 'John Doe',
  age_of_person: 123,
  timestamp: new Date('2012-12-12').getTime(),
  input_test: 'This property is for testing custom input'
};

describe('serialize-layout', function() {
  let input = {},
      person = SL.deserialize(Person, layout, raw, input);

  it('Should deserialize a plain Object', function() {
    expect(person instanceof Person).to.equal(true);
    expect(person.name).to.equal(raw.name);
    expect(person.getName()).to.equal(raw.name);
    expect(person.age).to.equal(raw.age_of_person);
    expect(person.birthday instanceof Date).to.equal(true);
    expect(person.birthday.getTime()).to.equal(raw.timestamp);
    expect(person.input_test).to.equal(input);
  });

  it('Should serialize an Object', function() {
    let newRaw = SL.serialize(layout, person, input);

    expect(newRaw.name).to.equal(raw.name);
    expect(newRaw.age_of_person).to.equal(raw.age_of_person);
    expect(newRaw.timestamp).to.equal(raw.timestamp);
    expect(newRaw.input_test).to.equal(input);
  });

});
