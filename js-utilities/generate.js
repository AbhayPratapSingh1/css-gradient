import { capitalize } from "./utility.js";

const addToHTMLTemplate = (sideBar, fileName) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${capitalize(fileName)}</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/hover-styles.css">
  <link rel="stylesheet" href="css/gradients/${fileName}.css">
</head>

<body>
  <div class="main-box">
    ${sideBar}
    <div class="main-body">
      <div class="card"></div>
    </div>
  </div>
</body>
</html>`;
};

const createSideBar = (names) => {
  const data = names.map((name) => {
    return `<a class="${name.toLowerCase()}-bar" href="${name.toLowerCase()}.html">
        <div class="bar">${capitalize(name)}</div>
      </a>
    `;
  });

  return `<div class="side-bar">
        ${data.join("")}
    </div>
  `;
};

const createSinglePage = (
  savingPath = "./index.html",
  name = "all",
  types,
) => {
  const sideBar = createSideBar(types);
  const htmlPage = addToHTMLTemplate(sideBar, name);

  Deno.writeTextFileSync(`${savingPath}`, htmlPage);
};

const extractGradient = (data = "") => {
  return data.match(/background: (.*);/)[1];
};

const createHoverEffect = (name, color) => {
  return `
.${name}-bar:hover {
  background: ${color};
}
  `;
};

const generatAllPages = async () => {
  const files = [];
  const filesData = [];
  for await (const { name } of Deno.readDir("./css/gradients/")) {
    const data = Deno.readTextFileSync(`./css/gradients/${name}`);
    const color = extractGradient(data);
    const gradName = name.split(".")[0];
    filesData.push(createHoverEffect(gradName, color));
    files.push(gradName);
  }
  files.sort();
  createSinglePage("./index.html", "Home Page", files);

  files.forEach((file) => {
    createSinglePage(
      `./${file}.html`,
      file,
      files,
    );
  });
  const hoverEffects = filesData.join("\n");
  Deno.writeTextFileSync("./css/hover-styles.css", hoverEffects);
};

generatAllPages();
