# Undo-redo manager
A simple manager for undo and redo. High customization, can cover update or diff update both.
# Installation
npm install --save undo-redo-manager


# Reference
## constructor
- @param {Function} rollbackFn 
  - will execute when call undo or redo method. pass the stepDetail for the function(require return a stepDetail to push on undo/redo stack)
- @param {Number} maxStep
  - max stored undoList and redoList

## methods
### push
- pushes a stepDetail on the undo stack, and clears the redo stack
- @param {*} stepDetail
  - the stepDetail to push on last of the undo stack
### undo
- call once or more rollbackFn function, and push rollbackFn returns to redo stack
- @param {Number} stepNum
  - number of undo times
### redo
- call once or more rollbackFn function, and push rollbackFn returns to undo stack
- @param {Number} stepNum
  - number of redo times

## properties
### canUndo
- return {Boolean} True if have undo stack
### canRedo
- return {Boolean} True if have redo stack
### undoStack
- return undo stack
### redoStack
- return redo stack


# Examples
## - cover update
```js
let data = 1
let manager = new Manager(detail => {
  let tmp = data
  data = detail
  return tmp
})

data = 2
manager.push(1)
data = 3
manager.push(2)

console.log(manager.undoStack) //[1,2]
manager.undo(1)
console.log(data) //2
console.log(manager.redoStack) //[3]

console.log(manager.undoStack) //[1]
manager.undo(2)
console.log(data) //1
console.log(manager.redoStack) //[3,2]

manager.redo(1)
console.log(data) //2
console.log(manager.redoStack) //[3]

manager.push(data)
data = 99
console.log(manager.undoStack) //[1,2]
console.log(manager.redoStack) //[]
```

## - diff update
```js
let data = [{id:1, value:1}]
const typeReverse = {
  add:'del',
  del:'add',
  update:'update'
}
let manager = new Manager(detail => {
  let index = data.findIndex(i => i.id === detail.id)
  let oldValue

  switch(detail.type){
    case 'add':
      oldValue = data.splice(index,1).value
      break

    case 'update':
      oldValue = data[index].value
      data[index].value = detail.oldValue
      break

    case 'del':
      data.push({id:detail.id,value:detail.oldValue})
  }

  return {id:detail.id, type: typeReverse[detail.type], oldValue}
})

let obj = {id:2,value:2}
data.push(obj)
manager.push({type:'add',id:2})
obj.value = 'WTF'
manager.push({type:'update', id:2, oldValue:2})
console.log(manager.undoStack) //[{type:'add',id:2}, {type:'update', id:2, oldValue:2}]
manager.undo()
console.log(data) //[{id:1, value:1}, {id:2, value:2}]
console.log(manager.redoStack) //[{type:'update', id:2, oldValue:'WTF'}]
manager.redo()
console.log(data) //[{id:1, value:1}, {id:2, value:'WTF'}]
```


# Tips
storage of non-basic type variables can use `JSON.stringify` and `JSON.parse` method
