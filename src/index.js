export default class Manager {
  /**
   * @param {Function} rollbackFn will execute when call undo or redo method. pass the stepDetail for the function(require return a stepDetail to push on undo/redo stack)
   * @param {Number} maxStep max stored undoList and redoList
   */
  constructor(rollbackFn, maxStep = 500) {
    // if (typeof undoFn !== 'function') throw new Error('not define undoFn or undoFn is not a function')
    // if (typeof redoFn !== 'function') throw new Error('not define redoFn or redoFn is not a function')
    if (typeof rollbackFn !== 'function') throw new Error('not define rollbackFn or rollbackFn is not a function')

    // this._undoFn = undoFn
    // this._redoFn = redoFn
    this._rollbackFn = rollbackFn
    this._maxStep = maxStep

    this._undoStack = []
    this._redoStack = []
  }

  /**
   * pushes a stepDetail on the undo stack, and clears the redo stack
   * @param {*} stepDetail the stepDetail to push on last of the undo stack
   */
  push(stepDetail) {
    if (!stepDetail) throw new Error('no stepDetail')
    this._redoStack = []
    this._undoStack.push(stepDetail)
    if (this._undoStack.length > this._maxStep) this._undoStack.splice(0, 1)
    return this
  }

  /**
   * call once or more rollbackFn function, and push rollbackFn returns to redo stack
   * @param {Number} stepNum number of undo times
   */
  undo(stepNum = 1) {
    if (!this.canUndo) return this
    if (stepNum > this._undoStack.length) stepNum = this._undoStack.length
    let stepDetail = this._rollbackFn(this._undoStack[this._undoStack.length - 1])
    this._undoStack.pop()
    if (!stepDetail) throw new Error('the rollbackFn not return a stepDetail, manager can not be work well')
    this._redoStack.push(stepDetail)
    if (stepNum > 1) this.undo(stepNum - 1)
    return this
  }

  /**
   * call once or more rollbackFn function, and push rollbackFn returns to undo stack
   * @param {Number} stepNum number of redo times
   */
  redo(stepNum = 1) {
    if (!this.canRedo) return this
    if (stepNum > this._redoStack.length) stepNum = this._redoStack.length
    this._undoStack.push(this._rollbackFn(this._redoStack[this._redoStack.length - 1]))
    this._redoStack.pop()
    if (stepNum > 1) this.redo(stepNum - 1)
    return this
  }

  get canUndo() {
    return !!this._undoStack.length
  }

  get canRedo() {
    return !!this._redoStack.length
  }

  get undoStack() {
    return this._undoStack
  }

  get redoStack() {
    return this._redoStack
  }
}
