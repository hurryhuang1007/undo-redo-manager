"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Manager = /*#__PURE__*/function () {
  /**
   * @param {Function} rollbackFn will execute when call undo or redo method. pass the stepDetail and isLastRollback for the function(require return a stepDetail to push on undo/redo stack)
   * @param {Number} maxStep max stored undoList and redoList
   */
  function Manager(rollbackFn) {
    var maxStep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    _classCallCheck(this, Manager);
    // if (typeof undoFn !== 'function') throw new Error('not define undoFn or undoFn is not a function')
    // if (typeof redoFn !== 'function') throw new Error('not define redoFn or redoFn is not a function')
    if (typeof rollbackFn !== "function") {
      throw new Error("not define rollbackFn or rollbackFn is not a function");
    }

    // this._undoFn = undoFn
    // this._redoFn = redoFn
    this._rollbackFn = rollbackFn;
    this._maxStep = maxStep;
    this._undoStack = [];
    this._redoStack = [];
  }

  /**
   * pushes a stepDetail on the undo stack, and clears the redo stack
   * @param {*} stepDetail the stepDetail to push on last of the undo stack
   */
  _createClass(Manager, [{
    key: "push",
    value: function push(stepDetail) {
      if (!stepDetail) throw new Error("no stepDetail");
      this._redoStack = [];
      this._undoStack.push(stepDetail);
      if (this._undoStack.length > this._maxStep) this._undoStack.splice(0, 1);
      return this;
    }

    /**
     * call once or more rollbackFn function, and push rollbackFn returns to redo stack
     * @param {Number} stepNum number of undo times
     */
  }, {
    key: "undo",
    value: function undo() {
      var stepNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      if (!this.canUndo) return this;
      if (stepNum > this._undoStack.length) stepNum = this._undoStack.length;
      var stepDetail = this._rollbackFn(this._undoStack[this._undoStack.length - 1], stepNum === 1);
      this._undoStack.pop();
      if (!stepDetail) throw new Error("the rollbackFn not return a stepDetail, manager can not be work well");
      this._redoStack.push(stepDetail);
      if (stepNum > 1) this.undo(stepNum - 1);
      return this;
    }

    /**
     * call once or more rollbackFn function, and push rollbackFn returns to undo stack
     * @param {Number} stepNum number of redo times
     */
  }, {
    key: "redo",
    value: function redo() {
      var stepNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      if (!this.canRedo) return this;
      if (stepNum > this._redoStack.length) stepNum = this._redoStack.length;
      this._undoStack.push(this._rollbackFn(this._redoStack[this._redoStack.length - 1], stepNum === 1));
      this._redoStack.pop();
      if (stepNum > 1) this.redo(stepNum - 1);
      return this;
    }

    /**
     * clear undo stack and redo stack
     */
  }, {
    key: "clear",
    value: function clear() {
      this._undoStack = [];
      this._redoStack = [];
      return this;
    }
  }, {
    key: "canUndo",
    get: function get() {
      return !!this._undoStack.length;
    }
  }, {
    key: "canRedo",
    get: function get() {
      return !!this._redoStack.length;
    }
  }, {
    key: "undoStack",
    get: function get() {
      return this._undoStack;
    }
  }, {
    key: "redoStack",
    get: function get() {
      return this._redoStack;
    }
  }]);
  return Manager;
}();
exports["default"] = Manager;