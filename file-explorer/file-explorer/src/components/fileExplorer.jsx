import React, { useState } from "react";

function FileExplorer({ files, tree, insertNode, setTree }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (tree[files] === undefined) {
    return null;
  }
  if (tree[files] === null) {
    return (
      <>
        <div> 📄 {files}</div>
      </>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <div>
          {" "}
          🗂️ {files}
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Collapse" : "Expand"}
            </button>
            <button
              onClick={() => {
                let newTree = insertNode(
                  tree,
                  [files],
                  "newFile",
                  false,
                  insertNode,
                  setTree,
                );
                console.log("newTree======>", newTree);
                setTree(newTree);
              }}
            >
              {"+ file"}
            </button>
            <button
              onClick={() => {
                let newTree = insertNode(
                  tree,
                  [files],
                  "newFolder",
                  true,
                  insertNode,
                  setTree,
                );
                console.log("newTree======>", newTree);
                setTree(newTree);
              }}
            >
              {" + folder"}
            </button>
          </div>
          {isExpanded && (
            <div>
              {Object.keys(tree[files]).map((file, index) => {
                return (
                  <FileExplorer key={index} files={file} tree={tree[files]} />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default FileExplorer;
