<script>
  import { beforeUpdate } from 'svelte'
  import TreeViewItem from './TreeViewItem.svelte'
  import SearchTool from '../components/SearchTool.svelte'
  
  let treeEl
  export let rootTreeItems
  export let selectionManager = null
  export let undoRedoManager = null
  export let isMouseOver = null
  let childComponents = []

  export let onKeyDownRegistered = false
  export let selectionChangedRegistered = false

//
//
// renderer = new GLRenderer(canvas)

//     $scene = new Scene()

//     // Assigning an Environment Map enables PBR lighting for niceer shiny surfaces.
//     if (!SystemDesc.isMobileDevice && SystemDesc.gpuDesc.supportsWebGL2) {
//       const envMap = new EnvMap('envMap')
//       envMap.getParameter('FilePath').setValue('data/StudioG.zenv')
//       envMap.getParameter('HeadLightMode').setValue(true)
//       $scene.getSettings().getParameter('EnvMap').setValue(envMap)
//     }

//     renderer.outlineThickness = 1
//     renderer.outlineColor = new Color(0.2, 0.2, 0.2, 1)

//     // $scene.setupGrid(10, 10)
//     $scene
//       .getSettings()
//       .getParameter('BackgroundColor')
//       .setValue(new Color(0.85, 0.85, 0.85, 1))
//     renderer.setScene($scene)

//     const appData = {}

//     appData.renderer = renderer
//     appData.scene = $scene

//     $assets = new TreeItem('Assets')
//     appData.assets = $assets

//     $scene.getRoot().addChild($assets)

//     /** UNDO START */
//     const undoRedoManager = UndoRedoManager.getInstance()
//     appData.undoRedoManager = undoRedoManager
//     /** UNDO END */

//     /** SELECTION START */
//     const cameraManipulator = renderer.getViewport().getManipulator()
//     cameraManipulator.setDefaultManipulationMode(
//       CameraManipulator.MANIPULATION_MODES.tumbler
//     )
//     appData.cameraManipulator = cameraManipulator
//     const toolManager = new ToolManager(appData)
//     $selectionManager = new SelectionManager(appData, {
//       enableXfoHandles: true,
//     })

//     // Users can enable the handles usinga menu or hotkey.
//     $selectionManager.showHandles(false)

//     appData.selectionManager = $selectionManager

//     const selectionTool = new SelectionTool(appData)
//     selectionTool.setSelectionFilter(filterItemSelection)
//     toolManager.registerTool('SelectionTool', selectionTool)
//     toolManager.registerTool('CameraManipulator', cameraManipulator)

//     renderer.getViewport().setManipulator(toolManager)
//     toolManager.pushTool('CameraManipulator')
//     appData.toolManager = toolManager

  
  const onKeyDown = (event) => {
    if (!isMouseOver) return

    if (!selectionManager) return
    // if (event.key == 'f') {
    //   const selectedItems = selectionManager.getSelection()
    //   expandSelection(selectedItems, true)
    //   event.preventDefault()
    //   event.stopPropagation()
    //   return
    // }

    if (event.key == 'ArrowLeft') {
      const selectedItems = selectionManager.getSelection()
      const newSelection = new Set()
      Array.from(selectedItems).forEach((item) => {
        if (!rootTreeItems.includes(item)) newSelection.add(item.getOwner())
      })
      if (newSelection.size > 0) {
        selectionManager.setSelection(newSelection)
      }
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (event.key == 'ArrowRight') {
      const selectedItems = selectionManager.getSelection()
      const newSelection = new Set()
      Array.from(selectedItems).forEach((item) => {
        if (
          item instanceof window.zeaEngine.TreeItem &&
          item.getNumChildren() > 0 &&
          !(item instanceof window.zeaCad.CADBody)
        )
          newSelection.add(item.getChild(0))
      })
      if (newSelection.size > 0) {
        selectionManager.setSelection(newSelection)
        // expandSelection(newSelection, true)
      }
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (event.key == 'ArrowUp') {
      const selectedItems = selectionManager.getSelection()
      const newSelection = new Set()
      Array.from(selectedItems).forEach((item) => {
        const index = item.getOwner().getChildIndex(item)
        if (index == 0) newSelection.add(item.getOwner())
        else {
          newSelection.add(item.getOwner().getChild(index - 1))
        }
      })
      if (newSelection.size > 0) {
        selectionManager.setSelection(newSelection)
        // expandSelection(newSelection)
      }
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (event.key == 'ArrowDown') {
      const selectedItems = selectionManager.getSelection()
      const newSelection = new Set()
      Array.from(selectedItems).forEach((item) => {
        const index = item.getOwner().getChildIndex(item)
        if (index < item.getOwner().getNumChildren() - 1)
          newSelection.add(item.getOwner().getChild(index + 1))
        else {
          const indexinOwner = item.getOwner().getChildIndex(item)
          if (item.getOwner().getNumChildren() > indexinOwner + 1)
            newSelection.add(item.getOwner().getChild(indexinOwner + 1))
        }
      })
      if (newSelection.size > 0) {
        selectionManager.setSelection(newSelection)
        // expandSelection(newSelection, true)
      }
      event.preventDefault()
      event.stopPropagation()
      return
    }
  }

  if (!onKeyDownRegistered) {
    document.addEventListener('keydown', onKeyDown)
    onKeyDownRegistered = true
  }

  beforeUpdate(() => {
    if (selectionManager && !selectionChangedRegistered) {
      selectionManager.on('leadSelectionChanged', () => {
        const selectedItems = selectionManager.getSelection()
        expandSelection(selectedItems, true)
      })
      selectionChangedRegistered = true
    }
  })

  /**
   * The expandSelection method.
   * @param {Set} selectedItems - The items we wish to expand to show.
   */
  const expandSelection = (selectedItems, scrollToView = true) => {
    Array.from(selectedItems).forEach((selectedItem) => {
      const path = []
      while (true) {
        path.splice(0, 0, selectedItem)
        if (rootTreeItems.includes(selectedItem)) break
        selectedItem = selectedItem.getOwner()
      }
      rootTreeItems.forEach((rootTreeItem, index) => {
        if (rootTreeItem != path[0]) return
        const treeViewItem = childComponents[index]
        treeViewItem.expandTree(path, scrollToView)
      })
    })
  }

  const resizableGrid = (table) => {
  var row = table.getElementsByTagName('tr')[0],
    cols = row ? row.children : undefined;
  if (!cols) return;

  table.style.overflow = 'hidden';

  var tableHeight = table.offsetHeight;

  for (var i = 0; i < cols.length; i++) {
    var div = createDiv(tableHeight);
    cols[i].appendChild(div);
    cols[i].style.position = 'relative';
    setListeners(div);
  }

  const setListeners = (div) => {
    var pageX, curCol, nxtCol, curColWidth, nxtColWidth, tableWidth;

    div.addEventListener('mousedown', function(e) { 
    
    	tableWidth = document.getElementById('tableId').offsetWidth;
      curCol = e.target.parentElement;
      nxtCol = curCol.nextElementSibling;
      pageX = e.pageX;

      var padding = paddingDiff(curCol);

      curColWidth = curCol.offsetWidth - padding;
    //  if (nxtCol)
        //nxtColWidth = nxtCol.offsetWidth - padding;
    });

    div.addEventListener('mouseover', function(e) {
      e.target.style.borderRight = '2px solid #0000ff';
    })

    div.addEventListener('mouseout', function(e) {
      e.target.style.borderRight = '';
    })

    document.addEventListener('mousemove', function(e) {
      if (curCol) {
        var diffX = e.pageX - pageX;

       // if (nxtCol)
          //nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

        curCol.style.width = (curColWidth + diffX) + 'px'; 
        document.getElementById('tableId').style.width = tableWidth + diffX + "px"
      }
    });

    document.addEventListener('mouseup', function(e) {
      curCol = undefined;
      nxtCol = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      curColWidth = undefined
    });
  }

  const createDiv = (height) => {
    var div = document.createElement('div');
    div.style.top = 0;
    div.style.right = 0;
    div.style.width = '5px';
    div.style.position = 'absolute';
    div.style.cursor = 'col-resize';
    div.style.userSelect = 'none';
    div.style.height = height + 'px';
    return div;
  }

  const paddingDiff = (col) => {

    if (getStyleVal(col, 'box-sizing') == 'border-box') {
      return 0;
    }

    var padLeft = getStyleVal(col, 'padding-left');
    var padRight = getStyleVal(col, 'padding-right');
    return (parseInt(padLeft) + parseInt(padRight));

  }

  const getStyleVal = (elm, css) => {
    return (window.getComputedStyle(elm, null).getPropertyValue(css))
  }
};
//var tables = document.getElementsByClassName('flexiCol');
var tables = document.getElementsByClassName('resizable');
for (var i = 0; i < tables.length; i++) {
  resizableGrid(tables[i]);
}
</script>

<style>
  /* *{box-sizing: border-box;}
  table{border-collapse:collapse;}
  th{padding:5px 15px;text-align:left;}
  table,th{border:1px solid #000;} */
  * {
  box-sizing: border-box;
}
table {
  min-width: 100vw;
  width: auto;
  -webkit-box-flex: 1;
          flex: 1;
  display: grid;
  border-collapse: collapse;
  grid-template-columns: 
    minmax(150px, 1fr)
    minmax(150px, 1.67fr)
    minmax(150px, 1.67fr)
    minmax(150px, 1.67fr)
    minmax(150px, 3.33fr)
    minmax(150px, 1.67fr)
    minmax(150px, 3.33fr)
    minmax(150px, 1.67fr);
}

thead,
tbody,
tr {
  display: contents;
}

th{
  padding: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background: #5cb85c;
  text-align: left;
  font-weight: normal;
  font-size: 1.1rem;
  color: white;
  position: relative;
}

th:last-child {
  border: 0;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: black;
  opacity: 0;
  width: 3px;
  cursor: col-resize;
}

.resize-handle:hover,
.header--being-resized .resize-handle {
  opacity: 0.5;
}

th:hover .resize-handle {
  opacity: 0.3;
}

td {
  padding-top: 10px;
  padding-bottom: 10px;
  color: #808080;
}

tr:nth-child(even) td {
  background: #f8f6ff;
}
</style>

<div>
  <SearchTool />
</div>

<table id="tableId" border="1" class="resizable"> 
  
<div bind:this={treeEl} class="TreeView min-w-max noselect">
  <thead>
    <tr>
    <th>Name</th>
    <th>Rev</th>
    <th>Description</th>
    <th>Model Name</th>
    </tr>
  </thead>
  

  <tbody> 
  {#each rootTreeItems as item, i}
  <TreeViewItem
      {item}
      {selectionManager}
      {undoRedoManager}
      bind:this={childComponents[i]}
    />     
  {/each}   
</tbody>  

</div>

</table> 
