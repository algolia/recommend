export default ({ body, initialRecommendations }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <script>window.__APP_INITIAL_STATE__ = ${JSON.stringify(
          initialRecommendations
        )}</script>
        <title>Recommend SSR</title>
      </head>

      <body>
        <div id="root">${body}</div>
      </body>

      <script src="/bundle.js"></script>
    </html>
`;
