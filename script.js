//Lista de productos
let createdProducts = [];

//Clase: Productos
class Products {
//Array para IDs generadas
    static createdIds = [];

//Constructor de productos
    constructor (name, price, description) {
        this.id = this.generateUniqueId()
        this.name = name
        this.description = description
        this.price = price.toFixed(2)

        this.addToCreatedProducts()
    }

//Métodos:
    //Generar ID unico
    generateUniqueId() {
        let id;
        do {
            id = Math.round(Math.random() * 100);
            if (id.toString().length === 1) {
                id = `00${id}`
            } else if (id.toString().length === 2) {
                id = `0${id}`}
        } while (Products.createdIds.includes(id));
        Products.createdIds.push(id);
        return id;
    }

    //Agregar a la lista de productos
    addToCreatedProducts() {
        createdProducts.push(this)
    }

    //Editar nombre
    editName(newName) {
        this.name = newName
    }

    //Editar precio
    editPrice(newPrice) {
        this.price = newPrice.toFixed(2)
    }
};

//Clase: Carrito de compras
class ShoppingCart{
    constructor () {
        this.productList = []
        this.total = 0
    }

//Métodos:
    //Localizar un producto por nombre
    findProduct(productName) {
        return this.productList.find(product => product.name.toLowerCase() === productName.toLowerCase())
    }

    //Calcular total del carrito
    calculateTotal() {
        return this.productList.reduce((total, product) => total + product.subTotal, 0)
    }

    //Añadir producto y actualizar precio
    addProduct(productName, quantity) {
        const targetProductIndex = this.productList.findIndex(product => product.name.toLowerCase() === productName.toLowerCase());

        if (targetProductIndex !== -1) {
            // Si el producto ya existe, actualizar cantidad y subtotal
            this.productList[targetProductIndex].quantity += quantity;
            this.productList[targetProductIndex].subTotal = this.productList[targetProductIndex].price * this.productList[targetProductIndex].quantity;
            this.total = this.calculateTotal();
            localStorage.setItem("cart", JSON.stringify(this));
        } else {
            // Si el producto no existe, agregarlo a la lista
            const targetProduct = createdProducts.find(product => product.name.toLowerCase() === productName.toLowerCase());

            if (targetProduct) {
                const newProduct = { ...targetProduct, quantity, subTotal: targetProduct.price * quantity };
                this.productList.push(newProduct);
                this.total = this.calculateTotal();
                localStorage.setItem("cart", JSON.stringify(this));
            } else {
                alert("No se encontró el producto");
            }
        }
    }
    //Eliminar producto y actualizar precio
    removeProduct(productName) {
        const targetProduct = this.findProduct(productName);

        //Verificar que el producto esté en el carrito
        if (targetProduct) {
            const index = this.productList.indexOf(targetProduct);
            if (index !== -1) {
                //Eliminar
                this.productList.splice(index, 1);
                //Actualizar precio
                this.total = this.calculateTotal()
                localStorage.setItem("cart", JSON.stringify(this));
            }
        } else {
            alert("No se encontró el producto");
        }
    }

    //Editar cantidad de producto
    editProductQuantity(productName, newQuantity) {
        const targetProduct = this.findProduct(productName);
        //Verificar que el producto esté en el carrito
        if (targetProduct) {
            //Actualizar cantidad
            targetProduct.quantity = newQuantity;
            targetProduct.subTotal = targetProduct.price * newQuantity;
            //Actualizar precio
            this.total = this.calculateTotal()
            localStorage.setItem("cart", JSON.stringify(this));
        } else {
            alert("No se encontró el producto");
        }
    }

    //Limpiar carrito
    cleanCart() {
        //Vaciar lista de productos en carrito
        this.productList = []

        //Reiniciar precio total
        this.total = 0
        localStorage.removeItem("cart");
    }
};
function shoppingSimulator() {
    if (localStorage.getItem("products") === null) {
        //Asignación de productos
        new Products("Rosa (Rosa spp.)", 500, "Belleza eterna: Las rosas añaden un toque de elegancia a cualquier jardín. Requieren pleno sol y suelo bien drenado. Perfectas para arreglos florales y regalos especiales."),
        new Products("Lavanda (Lavandula spp.)", 350, "Aroma relajante: La lavanda es conocida por su fragancia calmante y atrae a polinizadores. Prefiere pleno sol y suelos secos. Ideal para bordes de jardín y aromaterapia."),
        new Products("Tomate (Solanum lycopersicum)", 240, "Frescura del huerto: Los tomates son fáciles de cultivar y deliciosos. Necesitan pleno sol y riego regular. Disfruta de tomates frescos en tus ensaladas y platos favoritos."),
        new Products("Helecho (Filicophyta spp.)", 375, "Elegancia natural: Los helechos son plantas de interior que añaden un toque de verdor a cualquier espacio. Prefieren sombra parcial y humedad constante. Perfectos para baños y áreas sombrías."),
        new Products("Suculenta (Suculenta spp.)", 130, "Belleza resistente: Las suculentas son fáciles de cuidar y vienen en una variedad de formas y colores. Prefieren pleno sol y suelos bien drenados. Ideales para decorar interiores y regalos duraderos."),
        new Products("Bambú (Bambusoideae spp.)", 625, "Elegancia vertical: El bambú agrega altura y estructura al jardín. Necesita pleno sol o sombra parcial y suelos húmedos. Crea setos o pantallas de privacidad con esta planta versátil.")

        //Guardar en localStorage
        localStorage.setItem("products", JSON.stringify(createdProducts));
    } else {
        //Cargar productos de localStorage
        createdProducts = JSON.parse(localStorage.getItem("products"));
    }

    //Inicialización de carrito
    let shoppingCart = new ShoppingCart();
    if (localStorage.getItem("cart")) {
        shoppingCart.productList = JSON.parse(localStorage.getItem("cart")).productList;
        shoppingCart.total = JSON.parse(localStorage.getItem("cart")).total;
    }

    const showProducts = (cart) => {
        //Mostrar lista de productos
        //Mostrar solo si la lista de productos tiene elementos
        if (createdProducts.length > 0) {
            createdProducts.forEach(product => {
                //Crear card
                const card = document.createElement('div');
                card.classList.add('card');

                //Crear cuerpo de la card
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                cardBody.innerHTML = `
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-price">$${product.price}</p>`;

                //Crear contenedor de botones
                const cardButtons = document.createElement('div');
                cardButtons.classList.add('card-buttons');

                //Crear input de cantidad
                const quantityInput = document.createElement('input');
                quantityInput.id = `quantity-input-${product.id}`;
                quantityInput.type = 'number';
                quantityInput.value = 1;
                quantityInput.min = 1;
                quantityInput.classList.add('quantity-input');

                //Crear botón de agregar
                const addButton = document.createElement('button');
                addButton.textContent = 'Agregar';
                addButton.classList.add('btn', 'btn-primary');

                //Evento: agregar al carrito
                addButton.onclick = () => {
                    const quantity = parseInt(document.getElementById(`quantity-input-${product.id}`).value, 10);
                    quantityInput.value = 1;
                    cart.addProduct(product.name, quantity);

                    //Limpiar tabla
                    document.getElementById("shopping-cart-container").innerHTML = '<h2>Carrito de compras</h2>';
                    //Actualizar tabla
                    showShoppingCart(cart);
                };

                //Anexar elementos
                cardButtons.appendChild(quantityInput);
                cardButtons.appendChild(addButton);

                card.appendChild(cardBody);
                card.appendChild(cardButtons);

                document.getElementById("products-container").appendChild(card);
            })
        } else {
            document.getElementById("products-container").innerHTML = `<h4 class="content-title">No hay productos disponibles por el momento</h4>`;
        }
    };

    const showShoppingCart = () => {
        //Mostrar carrito de compras
        //Mostrar solo si hay elementos en el carrito
        const container = document.getElementById("shopping-cart-container");
        let cart = JSON.parse(localStorage.getItem('cart'))

        if (!cart || cart.productList.length === 0) {
            //Mostrar mensaje de carrito vacío
            const emptyCart = document.createElement('p');
            emptyCart.classList.add('empty-cart');
            emptyCart.textContent = 'El carrito de compras se encuentra vacío';
            container.appendChild(emptyCart);
        } else {
            //Mostrar lista de productos
            const cartTable = document.createElement('table');
            cartTable.classList.add('product-table');

            //Crear encabezado de la tabla
            const tableHeader = document.createElement('tr');
            tableHeader.innerHTML = '<th>Producto</th><th>Cantidad</th><th>Subtotal</th><th>Quitar</th>';
            cartTable.appendChild(tableHeader);

            //Crear filas de la tabla
            cart.productList.forEach(product => {
                const tableRow = document.createElement('tr');
                tableRow.innerHTML = `
                    <td>${product.name}</td>
                    <td>
                        <input type="number" class="table-quantity-input" id="quantity-input-${product.id}" value="${product.quantity}" min="1" disabled>
                        <button class="edit-button" id="edit-button-${product.id}">Editar</button>
                    </td>
                    <td class="subtotal-cell">$${product.subTotal.toFixed(2)}</td>
                    <td><button class="remove-button-${product.id}">X</button></td>
                `;

                //Obtener input y boton de editar
                const quantityInput = tableRow.querySelector(`#quantity-input-${product.id}`);
                const editButton = tableRow.querySelector('.edit-button');

                //Evento: deshabilitar input de cantidad y mostrar boton de editar
                editButton.addEventListener('click', function() {
                    if (editButton.textContent === 'Editar') {
                        //Habilitar el input para editar la cantidad
                        quantityInput.disabled = false;
                        editButton.textContent = 'Ok';
                    } else if (editButton.textContent === 'Ok') {
                        //Capturar el valor del input y llamar a la función para editar la cantidad en el carrito
                        const newQuantity = parseInt(quantityInput.value);
                        shoppingCart.editProductQuantity(product.name, newQuantity);

                        //Actualizar el subtotal en la lista
                        const subTotalCell = tableRow.querySelector('.subtotal-cell');
                        subTotalCell.textContent = `$${(product.price * newQuantity).toFixed(2)}`

                        //Actualizar el total
                        cart.total = shoppingCart.calculateTotal();
                        const totalContainer = document.querySelector('.total-container');
                        totalContainer.innerHTML = `<p id="total">Total: $${cart.total.toFixed(2)}</p>`

                        //Deshabilitar el input y cambiar el botón de vuelta a "Editar"
                        quantityInput.disabled = true;
                        editButton.textContent = 'Editar';
                    }
                });

                //Obtener boton de eliminar
                const removeButton = tableRow.querySelector(`.remove-button-${product.id}`);

                //Evento: remover del carrito
                removeButton.addEventListener('click', function() {
                    const table = document.querySelectorAll('.product-table>tr');
                    console.log(table);
                    shoppingCart.removeProduct(product.name);
                    cartTable.removeChild(tableRow);
                    const total = document.getElementById("total")
                    if (table.length === 2) {
                        cleanFunction();
                        return
                    }
                    total.textContent = `Total: $${shoppingCart.total.toFixed(2)}`
                })
                cartTable.appendChild(tableRow);
            });
            container.appendChild(cartTable);

            //Mostrar total
            const totalContainer = document.createElement('div');
            totalContainer.classList.add('total-container');
            totalContainer.innerHTML = `<p id="total">Total: $${cart.total.toFixed(2)}</p>`;
            container.appendChild(totalContainer);

            //Agregar botón para limpiar carrito
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Limpiar carrito';
            clearButton.classList.add('clear-button');
            clearButton.addEventListener('click', function() {
                cleanFunction();
            })

            const cleanFunction = () => {
                shoppingCart.cleanCart();
                //Mostrar mensaje de carrito vacío
                const emptyCart = document.createElement('p');
                emptyCart.classList.add('empty-cart');
                emptyCart.textContent = 'El carrito de compras se encuentra vacío';

                //Limpiar tabla
                container.removeChild(document.querySelector('.product-table'));
                container.removeChild(document.querySelector('.total-container'));
                container.removeChild(document.querySelector('.list-button-container'));
                container.appendChild(emptyCart);
            }

            //Agregar botón para finalizar compra
            const finishButton = document.createElement('button');
            finishButton.textContent = 'Realizar compra';
            finishButton.classList.add('finish-button');

            //Evento: mostrar resumen de la compra
            finishButton.addEventListener('click', function() {
                const container = document.querySelector('#container');
                container.innerHTML = `
                <div class="finish-container">
                    <h1>Tu compra ha sido finalizada con éxito</h1>
                    <h2>El precio total de tu compra fue de <strong id="finish-total">$${cart.total.toFixed(2)}</strong></h2>
                    <p>Revisa tu correo para obtener el resumen de la misma</p>
                    <p>Gracias por elegirnos</p>
                </div>`
                //Limpiar localstorage
                localStorage.removeItem("cart");
            })

            //Crear contenedor de botones
            const listButtonContainer = document.createElement('div');
            listButtonContainer.classList.add('list-button-container');

            //Añadir botones al contenedor
            listButtonContainer.appendChild(clearButton);
            listButtonContainer.appendChild(finishButton);

            //Añadir contenedor al contenedor principal
            container.appendChild(listButtonContainer);
        }
    }

    //Mostrar productos disponibles
    showProducts(shoppingCart);

    //Mostrar carrito de compras
    showShoppingCart();
};

//Iniciar simulador de compra
shoppingSimulator();
