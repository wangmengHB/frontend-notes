
function trycatch(func, value) {
  let result = {};
  try {
    result.value = func(value);
    result.status = 'success';
  } catch (error) {
    result.value = error;
    result.status = 'error';
  }
  return result;
}

function getThen(obj) {
  let then;
  if (obj && typeof obj.then === 'function') {
    then = obj.then;
  }
  if (then) {
    return function() {
      then.apply(obj, arguments);
    }
  }
  return undefined;
}

// this should be a micro task, use setTimeout just for demo
function unwrap(promise, func, value) {
  setTimeout(function () {
    var result = trycatch(func, value);
    if (result.status === 'error') {
      return doReject(promise, result.value);
    }
    if (result.value === promise) {
      doReject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      doResolve(promise, result.value);
    }
  });
}


function safelyResolveThenable(self, thenable) {
  let called = false;
  let once = (fn) => (value) => {
    if (called) {
      return;
    }
    called = true;
    fn(self, value);
  }
  const onSuccess = once(doResolve);  
  const onError = once(doReject);
  var result = trycatch(() => thenable(onSuccess, onError));
  if (result.status === 'error') {
    onError(result.value);
  }
}


function doResolve(self, value) {
  // 检查结果是否为 promise
  var result = trycatch(getThen, value);
  if (result.status === 'error') {
    return doReject(self, result.value);
  }
  var thenable = result.value;
  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.value = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;

}

function doReject(self, error) {
  self.state = REJECTED;
  self.value = error;

  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;

}




// PromiseLike class
const PENDING = 'pending';
const FULFILLED = 'resolved';
const REJECTED = 'rejected';

const noop = () => {};

function PromiseLike(resolver) {
  this.state = PENDING;
  this.value = undefined;
  this.queue = [];
  if (resolver !== noop) {
    safelyResolveThenable(this, resolver);
  }
}

PromiseLike.prototype.then = function(onFulfilled, onRejected) {
  if (
    typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) 
  {
    // 跟原生的行为不一样, then 永远会返回一个新的 promise
    return this;
  }
  var promise = new PromiseLike(noop);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.value);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
}


PromiseLike.prototype.finally = function (callback) {
  if (typeof callback !== 'function') {
    return this;
  }
  
  return this.then(resolve, reject);

  function resolve(value) {
    function yes () {
      return value;
    }
    return PromiseLike.resolve(callback()).then(yes);
  }
  function reject(reason) {
    function no () {
      throw reason;
    }
    return PromiseLike.resolve(callback()).then(no);
  }
};

PromiseLike.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};


PromiseLike.resolve = function (value) {
  if (value instanceof PromiseLike) {
    return value;
  }
  return doResolve(new PromiseLike(noop), value);
}

PromiseLike.reject = function (value) {
  var promise = new PromiseLike(noop);
  return doReject(promise, value);
}


PromiseLike.all = function (iterable) {
  
  if (!Array.isArray(iterable)) {
    return PromiseLike.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new PromiseLike(noop);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    PromiseLike.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        doReject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        doResolve(promise, values);
      }
    }
  }
}

PromiseLike.race = function (iterable) {
  if (!Array.isArray(iterable)) {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new PromiseLike(noop);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    PromiseLike.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        doResolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        doReject(promise, error);
      }
    });
  }
}








function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }

  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}


QueueItem.prototype.callFulfilled = function (value) {
  doResolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  doReject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};




