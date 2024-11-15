exports.main = async (event: any) => {
  const path = event.path;

  if (path === '/items') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: JSON.stringify({
        items: ['item1', 'item2', 'item3'],
      }),
    };
  } else if (path === '/traerboton') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: `<button onclick="fetchItems()">Traer lista de ítems</button>
             <script>
               function fetchItems() {
                 fetch('https://ha34pe4tg3.execute-api.us-east-1.amazonaws.com/prod/items')
                   .then(response => response.json())
                   .then(data => {
                     const itemsDiv = document.getElementById('items');
                     itemsDiv.innerText = JSON.stringify(data.items);
                   })
                   .catch(error => console.error('Error fetching items:', error));
               }
             </script>`,
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: 'Resource not found',
    };
  }
};
