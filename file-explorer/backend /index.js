import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors());

async function generateFileTree({ files }) {
  let tree = {};

  async function processFiles(pathFile, tree) {
    const fsStat = await fs.stat(pathFile);
    const fileName = path.basename(pathFile);
    if (fsStat.isDirectory()) {
      tree[fileName] = {};
      const childFiles = await fs.readdir(pathFile);
      for (const childFile of childFiles) {
        await processFiles(path.join(pathFile, childFile), tree[fileName]);
      }
    } else {
      tree[fileName] = null;
    }
  }

  for (const file of files) {
    const pathFile = path.join("../file-explorer/src", file);
    await processFiles(pathFile, tree);
  }

  console.log("generated tree======>", tree);

  return tree;
}

app.use(express.json());

app.get("/files", async (req, res) => {
  try {
    const files = await fs.readdir("../file-explorer/src");

    console.log(files);

    const tree = await generateFileTree({ files });

    return res.status(200).json({ tree });
  } catch (error) {
    console.log("error occured at fetching files", error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
