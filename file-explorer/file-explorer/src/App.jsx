import { useState, useEffect } from "react";
import "./App.css";
import FileExplorer from "./components/fileExplorer";

function App() {
  const [tree, setTree] = useState(null);

  async function fetchTree() {
    try {
      const response = await fetch("http://localhost:3000/files");
      const data = await response.json();
      setTree(data.tree);
    } catch (error) {
      console.error("Error fetching tree:", error);
    }
  }

  useEffect(() => {
    fetchTree();
  }, []);

  function insertNode(tree, path, name, isFolder) {
    if (path.length === 0) {
      return {
        ...tree,
        [name]: isFolder ? {} : null,
      };
    }

    const [current, ...rest] = path;
    console.log("current======>", current);
    console.log("rest======>", rest);
    console.log("path======>", path);
    const child = tree[current];
    if (child !== undefined && child !== null && typeof child === "object") {
      return {
        ...tree,
        [current]: insertNode(child, rest, name, isFolder, insertNode),
      };
    }

    return tree;
  }

  return (
    <>
      <div>
        {tree &&
          Object.keys(tree).map((file, index) => {
            return (
              <FileExplorer
                key={index}
                files={file}
                tree={tree}
                insertNode={insertNode}
                setTree={setTree}
              />
            );
          })}
      </div>
    </>
  );
}

export default App;
