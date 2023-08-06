export default class Manager<T> {
  private _rollbackFn: (stepDetail: T, isLastRollback: boolean) => T;
  private _maxStep: number;
  private _undoStack: T[];
  private _redoStack: T[];

  /**
   * @param {Function} rollbackFn will execute when call undo or redo method. pass the stepDetail and isLastRollback for the function(require return a stepDetail to push on undo/redo stack)
   * @param {Number} maxStep max stored undoList and redoList
   */
  constructor(
    rollbackFn: (stepDetail: T, isLastRollback: boolean) => T,
    maxStep?: number
  );

  /**
   * pushes a stepDetail on the undo stack, and clears the redo stack
   * @param {T} stepDetail the stepDetail to push on last of the undo stack
   */
  push(stepDetail: T): this;

  /**
   * call once or more rollbackFn function, and push rollbackFn returns to redo stack
   * @param {Number} stepNum number of undo times
   */
  undo(stepNum?: number): this;

  /**
   * call once or more rollbackFn function, and push rollbackFn returns to undo stack
   * @param {Number} stepNum number of redo times
   */
  redo(stepNum?: number): this;

  /**
   * clear undo stack and redo stack
   */
  clear(): this;

  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly undoStack: T[];
  readonly redoStack: T[];
}
