import FabricTool, { ConfigureCanvasProps } from "./fabrictool"
import { fabric } from "fabric"

class AdjustmentTool extends FabricTool {
  isMouseDown: boolean = false
  fillColor: string = "#eb34c9"
  strokeWidth: number = 10
  strokeColor: string = "#eb34c9"
  currentCircle: fabric.Circle = new fabric.Circle()
  currentStartX: number = 0
  currentStartY: number = 0
  displayRadius: number = 1

  private _clipboard: fabric.Object | null = null

  configureCanvas(args: ConfigureCanvasProps): () => void {
    let canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = true
    canvas.forEachObject((o) => (o.selectable = o.evented = true))

    canvas.on("mouse:dblclick", (e: any) => this.handleDoubleClick(e))
    canvas.on("mouse:up", (e: any) => this.onMouseUp(e))
    canvas.on("mouse:out", (e: any) => this.onMouseOut(e))

    // Add keyboard event listeners
    document.addEventListener("keydown", this.handleKeyDown)

    return () => {
      canvas.off("mouse:dblclick")
      canvas.off("mouse:up")
      canvas.off("mouse:out")
      document.removeEventListener("keydown", this.handleKeyDown)
    }
  }

  
  handleDoubleClick(o: any) {
    let canvas = this._canvas
    let _clicked = o.e["button"]
    this.isMouseDown = true
    let pointer = canvas.getPointer(o.e)
    this.currentStartX = pointer.x - (this.displayRadius + this.strokeWidth / 2.)
    this.currentStartY = pointer.y //- (this._minRadius + this.strokeWidth)
    this.currentCircle = new fabric.Circle({
      left: this.currentStartX,
      top: this.currentStartY,
      originX: "left",
      originY: "center",
      strokeWidth: this.strokeWidth,
      stroke: this.strokeColor,
      fill: this.fillColor,
      selectable: false,
      evented: false,
      radius: this.displayRadius,
    })
    if (_clicked === 0 || o.e instanceof TouchEvent) {
      canvas.add(this.currentCircle)
    }
  }

  onMouseUp(o: any) {
    this.isMouseDown = false
    this.currentCircle.set({
      selectable: true,
      evented: true,
    })
  }

  onMouseOut(o: any) {
    this.isMouseDown = false
    this.currentCircle.set({
      selectable: true,
      evented: true,
    })
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this._canvas) return
    if (e.key === "Delete" || e.key === "Backspace") {
      const activeObjects = this._canvas.getActiveObjects()
      activeObjects.forEach(obj => this._canvas?.remove(obj))
      this._canvas.discardActiveObject()
      this._canvas.requestRenderAll()
    } else if (e.ctrlKey && e.key === "c") {
      this.copy()
    } else if (e.ctrlKey && e.key === "v") {
      this.paste()
    }
  }
  

  // Copy the active object
  private copy() {
    const activeObject = this._canvas?.getActiveObject()
    if (activeObject) {
      activeObject.clone((cloned: fabric.Object) => {
        this._clipboard = cloned
      })
    }
  }

  // Paste the copied object
  private paste() {
    if (!this._clipboard || !this._canvas) return

    // Clone again to prevent references to the same object
    this._clipboard.clone((clonedObj: fabric.Object) => {
      const left = clonedObj.left ?? 10 // Use a default value or 0 if undefined
      const top = clonedObj.top ?? 10   // Use a default value or 0 if undefined

      this._canvas?.discardActiveObject()
      clonedObj.set({
        left: left + 10, // Ensure it's always offset
        top: top + 10,   // Ensure it's always offset
        evented: true,
      })
      this._canvas?.add(clonedObj)
      this._canvas?.setActiveObject(clonedObj)
      this._canvas?.requestRenderAll()
    })
  }
}

export default AdjustmentTool