const test    = require('tape')
const helpers = require('../test/helpers')

const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc

const identity  = require('../combinators/identity')
const constant  = require('../combinators/constant')

const Sum = require('./Sum')

test('Sum', t => {
  const s = bindFunc(Sum)

  t.ok(isFunction(Sum), 'is a function')

  t.ok(isFunction(Sum.empty), 'provides an empty function')
  t.ok(isFunction(Sum.type), 'provides an type function')

  t.throws(Sum, TypeError, 'throws when nothing is passed')
  t.throws(s(identity), TypeError, 'throws when passed a function')
  t.throws(s(undefined), TypeError, 'throws with undefined')
  t.throws(s(null), 'throws with null')
  t.throws(s(''), 'throws with falsey string')
  t.throws(s('string'), 'throws with truthy string')
  t.throws(s(false), 'throws with false')
  t.throws(s(true), 'throws with true')
  t.throws(s([]), 'throws with an array')
  t.throws(s({}), 'throws with an object')

  t.doesNotThrow(s(0), 'allows a falsey number')
  t.doesNotThrow(s(1), 'allows a truthy number')

  t.end()
})

test('Sum value', t => {
  t.ok(isFunction(Sum(0).value), 'is a function')

  t.equal(Sum(0).value(), 0, 'provides a wrapped falsey number')
  t.equal(Sum(1).value(), 1, 'provides a wrapped truthy number')

  t.end()
})

test('Sum type', t => {
  t.ok(isFunction(Sum(0).type), 'is a function')

  t.equal(Sum(0).type, Sum.type, 'static and instance versions are the same')
  t.equal(Sum(0).type(), 'Sum', 'reports the expected type (Sum)')

  t.end()
})

test('Sum concat properties (Semigroup)', t => {
  const a = Sum(45)
  const b = Sum(20)
  const c = Sum(35)

  const left  = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Sum(0).concat), 'is a function')

  t.equal(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')

  t.end()
})

test('Sum concat functionality', t => {
  const x = 5
  const y = 23

  const a = Sum(x)
  const b = Sum(y)

  const notSum = { type: constant('Sum...Not') }

  const cat = bindFunc(a.concat)

  t.throws(cat(undefined), TypeError, 'throws when passed undefined')
  t.throws(cat(null), TypeError, 'throws when passed null')
  t.throws(cat(0), TypeError, 'throws when passed falsey number')
  t.throws(cat(1), TypeError, 'throws when passed truthy number')
  t.throws(cat(''), TypeError, 'throws when passed falsey string')
  t.throws(cat('string'), TypeError, 'throws when passed truthy string')
  t.throws(cat(false), TypeError, 'throws when passed false')
  t.throws(cat(true), TypeError, 'throws when passed true')
  t.throws(cat([]), TypeError, 'throws when passed array')
  t.throws(cat({}), TypeError, 'throws when passed object')
  t.throws(cat(notSum), TypeError, 'throws when passed non-Any')

  t.equals(a.concat(b).value(), (x + y), 'sums wrapped values as expected')

  t.end()
})

test('Sum empty properties (Monoid)', t => {
  const m = Sum(32)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left  = m.empty().concat(m)

  t.equal(right.value(), m.value(), 'right identity')
  t.equal(left.value(), m.value(), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Sum empty functionality', t => {
  const x = Sum(85).empty()

  t.equal(Sum(0).empty, Sum.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Sum', 'provides a Sum')
  t.equal(x.value(), 0, 'wraps a 0')

  t.end()
})
