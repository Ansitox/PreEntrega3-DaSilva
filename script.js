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
        } else {
            // Si el producto no existe, agregarlo a la lista
            const targetProduct = createdProducts.find(product => product.name.toLowerCase() === productName.toLowerCase());

            if (targetProduct) {
                const newProduct = { ...targetProduct, quantity, subTotal: targetProduct.price * quantity };
                this.productList.push(newProduct);
            } else {
                alert("No se encontró el producto");
            }
        }

        this.total = this.calculateTotal();
        console.log(this.productList);
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
    }
};
function shoppingSimulator() {
    //Asignación de productos
    new Products("Rosa (Rosa spp.)", 500, "Belleza eterna: Las rosas añaden un toque de elegancia a cualquier jardín. Requieren pleno sol y suelo bien drenado. Perfectas para arreglos florales y regalos especiales."),
    new Products("Lavanda (Lavandula spp.)", 350, "Aroma relajante: La lavanda es conocida por su fragancia calmante y atrae a polinizadores. Prefiere pleno sol y suelos secos. Ideal para bordes de jardín y aromaterapia."),
    new Products("Tomate (Solanum lycopersicum)", 240, "Frescura del huerto: Los tomates son fáciles de cultivar y deliciosos. Necesitan pleno sol y riego regular. Disfruta de tomates frescos en tus ensaladas y platos favoritos."),
    new Products("Helecho (Filicophyta spp.)", 375, "Elegancia natural: Los helechos son plantas de interior que añaden un toque de verdor a cualquier espacio. Prefieren sombra parcial y humedad constante. Perfectos para baños y áreas sombrías."),
    new Products("Suculenta (Suculenta spp.)", 130, "Belleza resistente: Las suculentas son fáciles de cuidar y vienen en una variedad de formas y colores. Prefieren pleno sol y suelos bien drenados. Ideales para decorar interiores y regalos duraderos."),
    new Products("Bambú (Bambusoideae spp.)", 625, "Elegancia vertical: El bambú agrega altura y estructura al jardín. Necesita pleno sol o sombra parcial y suelos húmedos. Crea setos o pantallas de privacidad con esta planta versátil.")

    //Inicialización de carrito
    const shoppingCart = new ShoppingCart();

    const showProducts = (cart) => {
        console.log(cart);
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
                    <p class="card-text">$${product.price}</p>
                `;
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
                addButton.onclick = () => {
                    const quantity = parseInt(document.getElementById(`quantity-input-${product.id}`).value, 10);
                    cart.addProduct(product.name, quantity);
                };
                //Anexar elementos
                cardButtons.appendChild(quantityInput);
                cardButtons.appendChild(addButton);

                card.appendChild(cardBody);
                card.appendChild(cardButtons);

                document.getElementById("content").appendChild(card);
            })
        } else {
            document.getElementById("content").innerHTML = `<h4 class="content-title">No hay productos disponibles por el momento</h4>`;
        }
    };

    showProducts(shoppingCart);
};
//Iniciar simulador de compra
shoppingSimulator();