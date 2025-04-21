// Función asíncrona que se ejecuta al hacer clic en el botón de búsqueda
async function searchCharacters() {

  // Obtiene el elemento del input con id 'searchInput' del DOM
  const inputElement = document.getElementById('searchInput');

  // Extrae el valor ingresado, elimina espacios al inicio y al final, y lo convierte a minúsculas
  const input = inputElement.value.trim().toLowerCase();

  // Obtiene el contenedor donde se mostrarán los resultados con id 'results'
  const resultsContainer = document.getElementById('results');

  // --- VALIDACIÓN DE CAMPO VACÍO ---
  // Si el campo está vacío, muestra un mensaje de advertencia y detiene la ejecución
  if (!input) {
    resultsContainer.innerHTML = `<p style="color:orange;">Por favor, ingresa un nombre para buscar.</p>`;
    return; // Termina la función anticipadamente
  }

  // --- VALIDACIÓN DE FORMATO DE TEXTO ---
  // Verifica que el valor ingresado contenga únicamente letras (mayúsculas o minúsculas) y espacios
  const validInput = /^[a-zA-Z\s]+$/.test(input);

  // Si la expresión regular no se cumple, muestra advertencia y detiene la función
  if (!validInput) {
    resultsContainer.innerHTML = `<p style="color:orange;">El campo solo debe contener letras y espacios.</p>`;
    return;
  }

  // Muestra un mensaje temporal mientras se cargan los resultados desde la API
  resultsContainer.innerHTML = "Cargando personajes...";

  // --- CONSUMO DE LA API CON BLOQUE TRY-CATCH ---
  try {
    // Llama a la API de Rick and Morty con el nombre ingresado, usando template literal para insertar el valor
    const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${input}`);

    // Si la respuesta de la API no es exitosa (status distinto de 200), lanza un error personalizado
    if (!response.ok) {
      throw new Error("No se encontraron personajes con ese nombre.");
    }

    // Convierte la respuesta JSON en un objeto JavaScript
    const data = await response.json();

    // Toma los primeros 10 personajes del array de resultados 
    const characters = data.results.slice(0, 10);

    // Inserta dinámicamente una tarjeta por cada personaje usando `map` y un template string
    // `.join("")` convierte el array en un solo string HTML
    resultsContainer.innerHTML = characters.map(character => `
      <div class="card">
        <img src="${character.image}" alt="${character.name}" />
        <h3>${character.name}</h3>
        <p>Especie: ${character.species}</p>
      </div>
    `).join("");

  } catch (error) {
    // En caso de error (como que no haya resultados o haya fallado la conexión),
    // muestra un mensaje con el texto del error
    resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}
