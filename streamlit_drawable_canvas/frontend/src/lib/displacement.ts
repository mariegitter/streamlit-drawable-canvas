import FabricTool, { ConfigureCanvasProps } from "./fabrictool"

class DisplacementTool extends FabricTool {
  configureCanvas(args: ConfigureCanvasProps): () => void {
    let canvas = this._canvas
    canvas.isDrawingMode = false
    canvas.selection = true
    // Lock lines, allow other objects to be selectable
    canvas.forEachObject((o) => {
        if (o.type === "line") {
          o.selectable = false
          o.evented = false
        } else {
          o.selectable = true
          o.evented = true
        }
      })
    return () => {
      
    }
  }
}

export default DisplacementTool