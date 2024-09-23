export default ({ title, content }) => { // gets passed an object with the page-specific HTML string for <body> contents
  return `
    <!DOCTYPE>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
};